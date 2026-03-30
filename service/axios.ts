import axios from "axios";

const api = axios.create({
  baseURL: "https://cannaconsult-backend.onrender.com",
});

export default api;
