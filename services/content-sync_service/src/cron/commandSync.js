const cron = require('node-cron');
const fs = require('fs');

const { getDatabasePages, notionToMarkdown } = require('../utils/notionToMd');
const supabase = require('../lib/supabaseAPI');
const redis = require('../lib/redisClient');

const notionCommandDatabaseId = fs.existsSync(process.env.NOTION_COMMAND_DATABASE_ID_FILE)
  ? fs.readFileSync(process.env.NOTION_COMMAND_DATABASE_ID_FILE, 'utf-8').trim()
  : process.env.NOTION_COMMAND_DATABASE_ID;

// 🔁 10分ごとに実行（Publish/Path の変化があったページのみ同期）
cron.schedule('*/10 * * * *', async () => {
  console.log('🛜 Notion差分同期ジョブ開始（10分間隔）...');
  try {
    const pages = await getDatabasePages(notionCommandDatabaseId);

    let clearedListCache = false; // all-commands を一度だけ削除するためのフラグ

    for (const page of pages) {
      const pageId = page.id;

      // Notion プロパティの安全アクセス
      const level = page.properties?.Level?.multi_select?.map(l => l.name) ?? [];
      const number = page.properties?.No?.number ?? null;
      const title = page.properties?.Title?.title?.[0]?.plain_text ?? '';
      const description = page.properties?.Description?.rich_text?.[0]?.plain_text ?? '';
      const command = page.properties?.Command?.rich_text?.[0]?.plain_text ?? '';
      const path = page.properties?.Path?.rich_text?.[0]?.plain_text?.trim();
      const tags = page.properties?.Tags?.multi_select?.map(t => t.name) ?? [];
      const category = page.properties?.Category?.multi_select?.map(c => c.name) ?? [];
      const publish = page.properties?.Publish?.checkbox ?? false;

      // 直近のメタ情報を取得（存在しない場合は null を返す）
      const { data: meta, error: metaError } = await supabase
        .from('notion_pages_meta')
        .select('publish, path')
        .eq('page_id', pageId)
        .maybeSingle();

      if (metaError) {
        console.error('❌ Supabase meta select error:', metaError);
        continue;
      }

      const prevPublish = meta?.publish ?? null;
      const prevPath = meta?.path ?? null;

      // 変化なしならスキップ
      if (prevPublish !== null && prevPublish === publish && prevPath === path) {
        continue;
      }

      if (publish) {
        // 公開：Markdown 生成して upsert
        const markdown = await notionToMarkdown(pageId);
        const upsertPayload = {
          tags,
          level,
          number,
          title,
          description,
          command,
          path,
          category,
          markdown: markdown ?? '',
        };

        const { error: upsertError } = await supabase
          .from('all_commands')
          .upsert(upsertPayload, { onConflict: ['path'] });
        if (upsertError) {
          console.error('❌ Supabase upsert error:', upsertError);
          continue;
        }
      } else {
        // 非公開：対象 path を削除
        const { error: deleteError } = await supabase
          .from('all_commands')
          .delete()
          .eq('path', path);
        if (deleteError) {
          console.error('❌ Supabase delete error:', deleteError);
        }
      }

      // メタ更新（初回も含め必ず記録）
      const { error: metaUpsertError } = await supabase
        .from('notion_pages_meta')
        .upsert({
          page_id: pageId,
          path,
          publish,
          kind: 'command',
          last_seen: new Date().toISOString(),
          last_synced: new Date().toISOString(),
        }, { onConflict: ['page_id'] });
      if (metaUpsertError) {
        console.error('❌ Supabase meta upsert error:', metaUpsertError);
      }

      // キャッシュ無効化（一覧は一度だけ、詳細は対象のみ）
      try {
        if (!clearedListCache) {
          await redis.del('list:commands');
          clearedListCache = true;
        }
        if (path) {
          await redis.del(`command-markdown:${path}`);
        }
      } catch (e) {
        console.error('❌ RedisCommandキャッシュ削除エラー:', e);
      }
      console.log(`✅ 差分同期:Command: pageId=${pageId} path=${path} publish=${publish}`);
    }
    console.log('🏁 Notion:Command: 差分同期ジョブ完了');
  } catch (error) {
    console.error('❌ Notion:Command: 差分同期エラー:', error);
  }
});