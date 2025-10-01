import axiosServer from '@/utils/axiosServer';

export const fetchServerDockerCommands = async () => {
  const response = await axiosServer.get('/api/notion/docker-commands');
  return response.data;
};

export const fetchServerDockerCommandDetail = async (path) => {
  const response = await axiosServer.get(`/api/notion/docker-commands/${path}`);
  return response.data;
}

export const fetchDockerComposeCommands = async () => {
  const response = await axiosServer.get('/api/notion/docker-compose-commands');
  return response.data;
};

export const fetchDockerSwarmCommands = async () => {
  const response = await axiosServer.get('/api/notion/docker-swarm-commands');
  return response.data;
};