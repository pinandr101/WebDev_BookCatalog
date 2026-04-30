import axios from "axios";

const API_URL = "http://158.160.203.172:8080";
const AUTH = {
    username: 'admin',
    password: '6812363'
}

const api = axios.create({
    baseURL: API_URL,
})

api.interceptors.request.use((config) =>{
    if (config.method !== 'GET' && !config.url?.startsWith('/image/')){
        config.auth = AUTH;
    }
    return config;
})

export default api;
