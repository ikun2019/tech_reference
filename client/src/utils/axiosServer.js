import axios from "axios";

const axiosServer = axios.create({
  baseURL: process.env.SERVER_GATEWAY_URL
});

export default axiosServer;