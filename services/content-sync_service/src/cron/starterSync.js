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
    const pageIds = pages.map(p => p.id);
    const { data: metaRows, error: metaError } = await supabase
      .from('notion_pages_meta')
      .select('page_id, publish, path')
      .in('page_id', pageIds);
    if (metaError) {
      console.error('❌ Supabase starterkits error:', metaError);
      return;
    }

    const metaMap = new Map(metaRows?.map(row => [row.page_id, row]));

    const upsertStarterKits = [];
    const deletePaths = [];
    const metaUpserts = [];
    const changedPaths = new Set();
    for (const page of pages) {
      const pageId = page.id;

      // スターターキット用プロパティの取得
      const title = page.properties?.Title?.title?.[0]?.plain_text ?? '';
      const description = page.properties?.Description?.rich_text?.[0]?.plain_text ?? '';
      const path = page.properties?.Path?.rich_text?.[0]?.plain_text ?? '';
      const tags = page.properties?.Tags?.multi_select?.map(t => t.name) ?? [];
      const publish = page.properties?.Publish?.checkbox ?? false;

      const prevMeta = metaMap.get(pageId);
      const prevPublish = prevMeta?.publish ?? null;
      const prevPath = prevMeta?.path ?? null;

      // 変化なしならスキップ
      if (prevPublish !== null && prevPublish === publish && prevPath === path) {
        continue;
      };

      if (publish) {
        // 公開
        const markdown = await notionToMarkdown(pageId);
        upsertStarterKits.push({
          title,
          description,
          path,
          tags,
          markdown: markdown ?? '',
        });
      } else {
        // 非公開
        if (path) deletePaths.push(path);
      };

      metaUpserts.push({
        page_id: pageId,
        path,
        publish,
        kind: 'starter',
        last_seen: new Date().toISOString(),
        last_synced: new Date().toISOString(),
      });
      if (path) changedPaths.add(path);
      console.log(`✅ 差分同期:StarterKits: pageId=${pageId} path=${path} publish=${publish}`);
    };

    // Supabaseへブルク反映
    if (upsertStarterKits.length > 0) {
      const { error: upsertError } = await supabase
        .from('all_starterkits')
        .upsert(upsertStarterKits, { onConflict: ['path'] });
      if (upsertError) console.error('❌ Supabase starterkits upsert error:', upsertError);
    }
    if (deletePaths.length > 0) {
      const { error: deleteError } = await supabase
        .from('all_starterkits')
        .delete()
        .in('path', deletePaths);
      if (deleteError) console.error('❌ Supabase starterkits delete error:', deleteError);
    }
    if (metaUpserts.length > 0) {
      const { error: metaUpsertError } = await supabase
        .from('notion_pages_meta')
        .upsert(metaUpserts, { onConflict: ['page_id'] });
      if (metaUpsertError) console.error('❌ Supabase starterkits meta upsert error:', metaUpsertError);
    }

    // キャッシュ無効化（一覧は一度だけ、詳細は対象のみ）
    try {
      const keysToDelete = ['list:starterkits', ...[...changedPaths].map(path => `starter-markdown:${path}`)];
      if (keysToDelete.length > 0) {
        await redis.del(keysToDelete);
      }
    } catch (e) {
      console.error('❌ RedisStarterKitsキャッシュ削除エラー', e);
    }
    console.log('🏁 Notion:StarterKits: 差分同期ジョブ完了');
  } catch (error) {
    console.error('❌ Notion:StarterKits: 差分同期エラー:', error);
  }
});