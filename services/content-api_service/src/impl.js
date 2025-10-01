const grpc = require('@grpc/grpc-js');

const redis = require('./lib/redisClient');
const supabase = require('./lib/supabaseAPI');

const { ListCommandsResponse, CommandResponse, CommandDetailResponse, ListStarterResponse, StarterResponse, StarterKitDetailResponse } = require('../proto/content-api_pb');

// * Commandsデータを取得
exports.getCommands = async (call, callback) => {
  console.log('✅ gRPC getCommands action');
  const cacheKey = 'list:commands';
  try {
    // キャッシュがあればキャッシュを返す
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const response = new ListCommandsResponse();
      parsed.map((command) => {
        const item = new CommandResponse();
        item.setTitle(command.title);
        item.setDescription(command.description);
        item.setCommand(command.command);
        item.setPath(command.path);
        item.setNo(command.no);
        const level = Array.isArray(command.levelsList)
          ? command.levelsList
          : typeof command.levelsList === 'string'
            ? [command.levelsList]
            : []
        item.setLevelsList(level);
        const tags = Array.isArray(command.tagsList)
          ? command.tagsList
          : typeof command.tagsList === 'string'
            ? [command.tagsList]
            : [];
        item.setTagsList(tags);
        const categories = Array.isArray(command.categoriesList)
          ? command.categoriesList
          : typeof command.categoriesList === 'string'
            ? [command.categoriesList]
            : [];
        item.setCategoriesList(categories);
        item.setDetail(command.detail);
        response.addCommands(item);
      });
      return callback(null, response);
    };

    // Supabaseからデータを取得
    const { data, error } = await supabase.from('all_commands').select('*');
    if (error) throw error;
    const response = new ListCommandsResponse();
    data.forEach((command) => {
      const item = new CommandResponse();
      item.setTitle(command.title);
      item.setDescription(command.description);
      item.setCommand(command.command);
      item.setPath(command.path);
      item.setNo(command.number);
      item.setLevelsList(
        Array.isArray(command.level)
          ? command.level
          : typeof command.level === 'string'
            ? [command.level]
            : []
      )
      item.setTagsList(
        Array.isArray(command.tags)
          ? command.tags
          : typeof command.tags === 'string'
            ? [command.tags]
            : []
      );
      item.setCategoriesList(
        Array.isArray(command.category)
          ? command.category
          : typeof command.category === 'string'
            ? [command.category]
            : []
      );
      const hasDetail = command.markdown && command.markdown.trim() !== '' ? true : false;
      item.setDetail(hasDetail);
      response.addCommands(item);
    });

    // キャッシュを保存
    await redis.set(
      cacheKey,
      JSON.stringify(response.toObject().commandsList),
      'EX',
      1000
    );

    callback(null, response);
  } catch (error) {
    console.error(error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

// * CommandDetailデータを取得
exports.getCommandDetail = async (call, callback) => {
  console.log('✅ gRPC getCommandDetail action');
  const { path } = call.request.toObject();
  const cacheKey = `command-markdown:${path}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const response = new CommandDetailResponse();
      response.setMarkdown(parsed);
      return callback(null, response);
    }
    // pathをキーにmarkdownを取得
    const { data, error } = await supabase
      .from('all_commands')
      .select('markdown')
      .eq('path', path)
      .single();
    if (error) throw error;
    const response = new CommandDetailResponse();
    response.setMarkdown(data.markdown);

    await redis.set(
      cacheKey,
      JSON.stringify(response.toObject().markdown),
      'EX',
      1000
    );
    callback(null, response);
  } catch (error) {
    console.error(error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

// * StarterKitsデータを取得
exports.getStarterKits = async (call, callback) => {
  console.log('✅ gRPC getStarterKits action');
  const cacheKey = 'list:starterkits';
  try {
    // キャッシュがあればキャッシュを返す
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const response = new ListStarterResponse();
      parsed.map((starter) => {
        const item = new StarterResponse();
        item.setTitle(starter.title);
        item.setDescription(starter.description);
        item.setPath(starter.path);
        const tags = Array.isArray(starter.tagsList)
          ? starter.tagsList
          : typeof starter.tagsList === 'string'
            ? [starter.tagsList]
            : [];
        item.setTagsList(tags);
        item.setDetail(starter.detail);
        response.addStarters(item);
      });
      return callback(null, response);
    };

    // Supabaseからデータを取得
    const { data, error } = await supabase
      .from('all_starterkits')
      .select('*')
    if (error) throw error;
    const response = new ListStarterResponse();
    data.forEach((starter) => {
      const item = new StarterResponse();
      item.setTitle(starter.title);
      item.setDescription(starter.description);
      item.setPath(starter.path);
      item.setTagsList(
        Array.isArray(starter.tags)
          ? starter.tags
          : typeof starter.tags === 'string'
            ? [starter.tags]
            : []
      );
      const hasDetail = starter.markdown && starter.markdown.trim() !== '' ? true : false;
      item.setDetail(hasDetail);
      response.addStarters(item);
    });

    // キャッシュを保存
    await redis.set(
      cacheKey,
      JSON.stringify(response.toObject().startersList),
      'EX',
      1000
    );

    callback(null, response);
  } catch (error) {
    console.error(error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};

// * StarterKitDetailデータを取得
exports.getStarterKitDetail = async (call, callback) => {
  console.log('✅ gRPC getStarterKitDetail action');
  const { path } = call.request.toObject();
  const cacheKey = `starter-markdown:${path}`;
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      const response = new StarterKitDetailResponse();
      response.setMarkdown(parsed);
      return callback(null, response);
    }

    // pathをキーにmarkdownを取得
    const { data, error } = await supabase
      .from('all_starterkits')
      .select('markdown')
      .eq('path', path)
      .single();
    if (error) throw error;
    const response = new StarterKitDetailResponse();
    response.setMarkdown(data.markdown);

    await redis.set(
      cacheKey,
      JSON.stringify(response.toObject().markdown),
      'EX',
      1000
    );

    callback(null, response);
  } catch (error) {
    console.error(error);
    callback({
      code: grpc.status.INTERNAL,
      message: error.message
    });
  }
};