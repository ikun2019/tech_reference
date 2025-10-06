import axiosClient from '@/utils/axiosClient';

export const fetchServerDockerStarterKits = async () => {
  const response = await axiosClient.get('/api/notion/docker-starters');
  return response.data;
};

export const fetchServerDockerStarterKitDetail = async (path) => {
  const response = await axiosClient.get(`/api/notion/docker-starters/${path}`);
  return response.data;
};