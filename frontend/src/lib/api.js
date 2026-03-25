import axios from 'axios'

const apiBaseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'

export const api = axios.create({
  baseURL: apiBaseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

