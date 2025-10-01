const { Empty } = require('google-protobuf/google/protobuf/empty_pb');
const notionServiceClient = require('../lib/grpc/notionServiceClient');
const { GetNotionByPathRequest } = require('../../proto/content-api_pb');

// * GET => /api/notion/docker-commands
exports.getDockerCommands = async (req, res) => {
  try {
    const request = new Empty();

    const notionResponse = await new Promise((resolve, reject) => {
      notionServiceClient.getCommands(request, (err, response) => {
        if (err) return reject(err);
        return resolve(response);
      })
    });

    const notion = notionResponse.toObject().commandsList.map((response) => ({
      title: response.title,
      description: response.description,
      command: response.command,
      path: response.path,
      tags: response.tagsList,
      detail: response.detail,
    }));
    const dockerCommands = notion.filter(cmd => (cmd.tags || []).includes('Docker'));
    res.status(200).json(dockerCommands);
  } catch (error) {
    res.status(500).json({ error: 'getDockerCommands Error', message: error })
  }
};

// * GET => /api/notion/docker-commands/:path
exports.getDockerCommandsDetail = async (req, res) => {
  const { path } = req.params;
  try {
    const request = new GetNotionByPathRequest();
    request.setPath(path);
    const commandDetailResponse = await new Promise((resolve, reject) => {
      notionServiceClient.getCommandDetail(request, (err, response) => {
        if (err) return reject(err);
        return resolve(response);
      });
    });
    res.status(200).json(commandDetailResponse.toObject());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// * GET => /api/notion/docker-starters
exports.getDockerStarters = async (req, res) => {
  try {
    const request = new Empty();
    const notionResponse = await new Promise((resolve, reject) => {
      notionServiceClient.getStarterKits(request, (err, response) => {
        if (err) return reject(err);
        return resolve(response);
      });
    });

    const notion = notionResponse.toObject().startersList.map((starter) => ({
      title: starter.title,
      description: starter.description,
      path: starter.path,
      tags: starter.tagsList,
      detail: starter.detail
    }));
    const dockerStarters = notion.filter(cmd => (cmd.tags || []).includes('DockerCompose'));
    res.status(200).json(dockerStarters);
  } catch (error) {
    res.status(500).json({ error: 'getDockerStarters Error', message: error });
  }
};

// * GET => /api/notion/docker-starters/:path
exports.getDockerStartersDetail = async (req, res) => {
  const { path } = req.params;
  try {
    const request = new GetNotionByPathRequest();
    request.setPath(path);
    const dockerStartersDetailResponse = await new Promise((resolve, reject) => {
      notionServiceClient.getStarterKitDetail(request, (err, response) => {
        if (err) return reject(err);
        return resolve(response);
      });
    });
    console.log('dockerStartersDetailResponse =>', dockerStartersDetailResponse.toObject());
    res.status(200).json(dockerStartersDetailResponse.toObject());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};