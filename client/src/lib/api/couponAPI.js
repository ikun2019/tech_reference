import axiosServer from "@/utils/axiosServer";

export async function fetchUnlockCategories(accessToken) {
  const response = await axiosServer.get('/api/coupon', {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  return response.data?.categories || [];
};