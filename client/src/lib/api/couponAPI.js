import axiosClient from '@/utils/axiosClient';

export async function fetchUnlockCategories(accessToken) {
  const response = await axiosClient.get('/api/coupon', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data?.categories || [];
};