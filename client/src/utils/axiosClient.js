import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_CLIENT_URL || 'http://localhost:8000'
});

export default axiosClient;