const { Empty } = require('google-protobuf/google/protobuf/empty_pb');
const notionServiceClient = require('../lib/grpc/notionServiceClient');
const { GetNotionByPathRequest } = require('../../proto/content-api_pb');


// * GET => /api/notion/all-docker-commands
exports.getAllDockerCommands = async (req, res) => {
  try {
    const request = new Empty();

    const notionResponse = await new Promise((resolve, reject) => {
      notionServiceClient.getCommands(request, (err, response) => {
        if (err) return reject(err);
        return resolve(response);
      })
    });

    const notion = notionResponse.toObject().commandsList.map((response) => ({
      level: response.levelsList,
      no: response.no,
      title: response.title,
      description: response.description,
      command: response.command,
      path: response.path,
      tags: response.tagsList,
      detail: response.detail,
      category: response.categoriesList,
    }));

    notion.sort((a, b) => {
      if (a.no == null && b.no == null) return 0;
      if (a.no == null) return 1;
      if (b.no == null) return -1;
      return a.no - b.no;
    });
    res.status(200).json(notion);
  } catch (error) {
    res.status(500).json({ error: 'getAllDockerCommands Error', message: error })
  }
};
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
      level: response.levelsList,
      no: response.no,
      title: response.title,
      description: response.description,
      command: response.command,
      path: response.path,
      tags: response.tagsList,
      detail: response.detail,
      category: response.categoriesList,
    }));
    const dockerCommands = notion.filter(cmd => (cmd.tags || []).includes('Docker'));

    dockerCommands.sort((a, b) => {
      if (a.no == null && b.no == null) return 0;
      if (a.no == null) return 1;
      if (b.no == null) return -1;
      return a.no - b.no;
    });
    res.status(200).json(dockerCommands);
  } catch (error) {
    res.status(500).json({ error: 'getDockerCommands Error', message: error })
  }
};

// * GET => /api/notion/docker-commands/:path Docker&DockerCompose&DockerSwarm
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
    res.status(200).json(dockerStartersDetailResponse.toObject());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// * GET => /api/notion/docker-compose-commands
exports.getDockerComposeCommands = async (req, res) => {
  try {
    const request = new Empty();
    const notionResponse = await new Promise((resolve, reject) => {
      notionServiceClient.getCommands(request, (err, response) => {
        if (err) return reject(err);
        return resolve(response);
      })
    });

    const notion = notionResponse.toObject().commandsList.map((response) => ({
      level: response.levelsList,
      no: response.no,
      title: response.title,
      description: response.description,
      command: response.command,
      path: response.path,
      tags: response.tagsList,
      detail: response.detail,
      category: response.categoriesList,
    }));
    const dockerComposeCommands = notion.filter(cmd => (cmd.tags || []).includes('DockerCompose'));
    res.status(200).json(dockerComposeCommands);
  } catch (error) {
    res.status(500).json({ error: 'getDockerComposeCommand Error', message: error });
  }
};

// * GET => /api/notion/docker-swarm-commands
exports.getDockerSwarmCommands = async (req, res) => {
  try {
    const request = new Empty();
    const notionResponse = await new Promise((resolve, reject) => {
      notionServiceClient.getCommands(request, (err, response) => {
        if (err) return reject(err);
        return resolve(response);
      });
    });
    const notion = notionResponse.toObject().commandsList.map((response) => ({
      level: response.levelsList,
      no: response.no,
      title: response.title,
      description: response.description,
      command: response.command,
      path: response.path,
      tags: response.tagsList,
      detail: response.detail,
      category: response.categoriesList,
    }));
    const dockerSwarmCommands = notion.filter(cmd => (cmd.tags || []).includes('DockerSwarm'));
    res.status(200).json(dockerSwarmCommands);
  } catch (error) {
    res.status(500).json({ error: 'getDockerSwarmCommands Error', message: error });
  }
};