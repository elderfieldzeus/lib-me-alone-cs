import axios from "axios";

const API_PATH = 'https://localhost:7208/api';

const API = axios.create({
    withCredentials: true,
    baseURL: API_PATH
});

export default API;