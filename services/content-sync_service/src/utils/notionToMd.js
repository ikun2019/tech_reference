const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const fs = require('fs');

const notionToken = fs.existsSync(process.env.NOTION_TOKEN_FILE) ? fs.readFileSync(process.env.NOTION_TOKEN_FILE, 'utf-8').trim() : process.env.NOTION_TOKEN;

const notion = new Client({ auth: notionToken });
const n2m = new NotionToMarkdown({ notionClient: notion });

const escAttr = (str = '') =>
  String(str)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"');

n2m.setCustomTransformer('code', async (block) => {
  const langRaw = block.code?.language || '';
  const lang = langRaw.toLowerCase() === 'plain text' ? '' : langRaw;
  const content = (block.code?.rich_text || [])
    .map(t => t.plain_text || '')
    .join('');
  const caption = (block.code?.caption?.[0]?.plain_text || '').trim();
  const meta = caption ? `caption="${escAttr(caption)}"` : '';

  return `\n\`\`\`${lang}${meta}\n${content}\n\`\`\`\n`;
});

const getDatabasePages = async (databaseId, query = {}) => {
  let results = [];
  let cursor;
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: cursor,
      page_size: 100,
      ...query
    });
    if (response?.results?.length) {
      results = results.concat(response.results);
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
  return results;
};

const notionToMarkdown = async (pageId) => {
  const mdBlocks = await n2m.pageToMarkdown(pageId);
  const mdObj = n2m.toMarkdownString(mdBlocks);
  const md = [mdObj.parent, ...(mdObj.children?.map(c => c.parent) || [])].join('\n\n');
  return md;
};

const blocksArrayToMarkdown = async (blocks) => {
  const mdBlocks = await n2m.blocksToMarkdown(blocks);
  return n2m.toMarkdownString(mdBlocks);
};

module.exports = { notionToMarkdown, getDatabasePages, blocksArrayToMarkdown, notion };