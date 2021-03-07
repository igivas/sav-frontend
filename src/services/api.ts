import axios from 'axios';

// eslint-disable-next-line

const api = axios.create({
  baseURL: process.env.REACT_APP_URL_API,
});

export default api;
