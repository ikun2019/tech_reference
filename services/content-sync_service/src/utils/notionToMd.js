const { Client } = require('@notionhq/client');
const { NotionToMarkdown } = require('notion-to-md');
const fs = require('fs');

const notionToken = fs.existsSync(process.env.NOTION_TOKEN_FILE) ? fs.readFileSync(process.env.NOTION_TOKEN_FILE, 'utf-8').trim() : process.env.NOTION_TOKEN;

const notion = new Client({ auth: notionToken });
const n2m = new NotionToMarkdown({ notionClient: notion });

const getDatabasePages = async (databaseId) => {
  const response = await notion.databases.query({ database_id: databaseId });
  return response.results;
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