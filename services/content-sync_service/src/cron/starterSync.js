const cron = require('node-cron');
const fs = require('fs');

const { getDatabasePages, notionToMarkdown } = require('../utils/notionToMd');
const supabase = require('../lib/supabaseAPI');
const redis = require('../lib/redisClient');

const notionStarterDatabaseId = fs.existsSync(process.env.NOTION_STARTER_DATABASE_ID_FILE)
  ? fs.readFileSync(process.env.NOTION_STARTER_DATABASE_ID_FILE, 'utf-8').trim()
  : process.env.NOTION_STARTER_DATABASE_ID;

cron.schedule('*/10 * * * *', async () => {
  console.log('🛜 StarterKit 差分同期ジョブ開始（10分間隔）...');
  try {
    const pages = await getDatabasePages(notionStarterDatabaseId);
    let clearedListCache = false;

    for (const page of pages) {
      const pageId = page.id;

      // スターターキット用プロパティの取得
      const title = page.properties?.Title?.title?.[0]?.plain_text ?? '';
      const description = page.properties?.Description?.rich_text?.[0]?.plain_text ?? '';
      const path = page.properties?.Path?.rich_text?.[0]?.plain_text ?? '';
      const tags = page.properties?.Tags?.multi_select?.map(t => t.name) ?? [];
      const publish = page.properties?.Publish?.checkbox ?? false;

      const { data: meta, error: metaError } = await supabase
        .from('notion_pages_meta')
        .select('publish, path')
        .eq('page_id', pageId)
        .maybeSingle();
      if (metaError) {
        console.error('❌ Supabase starterkits meta error:', metaError);
        continue;
      }

      const prevPublish = meta?.publish ?? null;
      const prevPath = meta?.path ?? null;

      // 変化なしならスキップ
      if (prevPublish !== null && prevPublish === publish && prevPath === path) {
        continue;
      };

      if (publish) {
        // 公開
        const markdown = await notionToMarkdown(pageId);

        const payload = {
          title,
          description,
          path,
          tags,
          markdown: markdown ?? '',
        };

        const { error: upsertError } = await supabase
          .from('all_starterkits')
          .upsert(payload, { onConflict: ['path'] });

        if (upsertError) {
          console.error('❌ Supabase starterkits upsert error:', upsertError);
          continue;
        };
      } else {
        // 非公開
        const { error: deleteError } = await supabase
          .from('all_starterkits')
          .delete()
          .eq('path', path)
        if (deleteError) {
          console.error('❌ Supabaes starterkits delete error:', deleteError);
        }
      };
      const { error: metaUpsertError } = await supabase
        .from('notion_pages_meta')
        .upsert({
          page_id: pageId,
          path,
          publish,
          kind: 'starter',
          last_seen: new Date().toISOString(),
          last_synced: new Date().toISOString()
        }, { onConflict: ['page_id'] });
      if (metaUpsertError) {
        console.error('❌ Supabase starterkits meta upsert error:', metaUpsertError);
      }

      // キャッシュ無効化（一覧は一度だけ、詳細は対象のみ）
      try {
        if (!clearedListCache) {
          await redis.del('list:starterkits');
          clearedListCache = true;
        }
        if (path) {
          await redis.del(`starter-markdown:${path}`);
        }
      } catch (e) {
        console.error('❌ RedisStarterKitsキャッシュ削除エラー', e);
      }
      console.log(`✅ 差分同期:StarterKits: pageId=${pageId} path=${path} publish=${publish}`);
    };
    console.log('🏁 Notion:StarterKits: 差分同期ジョブ完了');
  } catch (error) {
    console.error('❌ Notion:StarterKits: 差分同期エラー:', error);
  }
});