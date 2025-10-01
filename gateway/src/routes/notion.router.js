const router = require('express').Router();

const { getDockerCommands, getDockerCommandsDetail, getDockerStarters, getDockerStartersDetail, getDockerComposeCommands, getDockerSwarmCommands } = require('../controllers/notion.controller');

// * GET => /api/notion/docker-commands
router.get('/docker-commands', getDockerCommands);

// * GET => /api/notion/docker-commands/:path
router.get('/docker-commands/:path', getDockerCommandsDetail);

// * GET => /api/notion/docker-starters
router.get('/docker-starters', getDockerStarters);

// * GET => /api/notion/docker-starters/:path
router.get('/docker-starters/:path', getDockerStartersDetail);

// * GET => /api/notion/docker-compose-commands
router.get('/docker-compose-commands', getDockerComposeCommands);

// * GET => /api/notion/docker-swarm-commands
router.get('/docker-swarm-commands', getDockerSwarmCommands);

module.exports = router;