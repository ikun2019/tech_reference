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

    const pageIds = pages.map(p => p.id);
    const { data: metaRows, error: metaError } = await supabase
      .from('notion_pages_meta')
      .select('page_id, publish, path')
      .in('page_id', pageIds);
    if (metaError) {
      console.error('❌ Supabase meta error:', metaError);
      return;
    }

    const metaMap = new Map(metaRows?.map(row => [row.page_id, row]));
    const upsertCommands = [];
    const deletePaths = [];
    const metaPayloads = [];
    const changedPaths = [];

    for (const page of pages) {
      const pageId = page.id;
      const meta = metaMap.get(pageId);

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

      const prevPublish = meta?.publish ?? null;
      const prevPath = meta?.path ?? null;

      // 変化なしならスキップ
      if (prevPublish !== null && prevPublish === publish && prevPath === path) {
        continue;
      }

      if (publish) {
        // 公開：Markdown 生成して upsert
        const markdown = await notionToMarkdown(pageId);
        upsertCommands.push({
          tags,
          level,
          number,
          title,
          description,
          command,
          path,
          category,
          markdown: markdown ?? '',
        });
      } else if (path) {
        // 非公開：対象 path を削除
        deletePaths.push(path);
      }
      // メタ情報更新用payload
      metaPayloads.push({
        page_id: pageId,
        path,
        publish,
        kind: 'command',
        last_seen: new Date().toISOString(),
        last_synced: new Date().toISOString(),
      });

      if (path) {
        changedPaths.push(path);
      }

      console.log(`✅ 差分同期:Command: pageId=${pageId} path=${path} publish=${publish}`);
    }

    // Redisキャッシュ無効化（一覧は一度だけ、詳細は対象のみ）
    try {
      if (changedPaths.length > 0) {
        const keysToDelete = ['list:commands', ...changedPaths.map(path => `command-markdown:${path}`)];
        await redis.del(keysToDelete);
      }
    } catch (e) {
      console.error('❌ RedisCommandキャッシュ削除エラー:', e);
    }

    // Supabaseへのアクセスをバルクで実行
    if (upsertCommands.length > 0) {
      const { error: upsertError } = await supabase
        .from('all_commands')
        .upsert(upsertCommands, { onConflict: ['path'] });
      if (upsertError) console.error('❌ all_commands upsert error:', upsertError);
    };
    if (deletePaths.length > 0) {
      const { error: deleteError } = await supabase
        .from('all_commands')
        .delete()
        .in('path', deletePaths);
      if (deleteError) console.error('❌ all_commands delete error:', deleteError);
    }
    if (metaPayloads.length > 0) {
      const { error: metaUpsertError } = await supabase
        .from('notion_pages_meta')
        .upsert(metaPayloads, { onConflict: ['page_id'] });
      if (metaUpsertError) console.error('❌ meta upsert error:', metaUpsertError);
    }
    console.log('🏁 Notion:Command: 差分同期ジョブ完了');
  } catch (error) {
    console.error('❌ Notion:Command: 差分同期エラー:', error);
  }
});