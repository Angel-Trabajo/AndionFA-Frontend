import axios from "axios";

const API_URL = import.meta.env.VITE_FAST_API

const FastApi = axios.create({
  baseURL: API_URL,
});

export default FastApi;
