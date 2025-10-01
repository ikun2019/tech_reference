import axiosServer from "@/utils/axiosServer";

export const fetchServerDockerStarterKits = async () => {
  const response = await axiosServer.get('/api/notion/docker-starters');
  return response.data;
};

export const fetchServerDockerStarterKitDetail = async (path) => {
  const response = await axiosServer.get(`/api/notion/docker-starters/${path}`);
  return response.data;
};