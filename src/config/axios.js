import axios from 'axios'

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
})

// Add a request interceptor to add the token to the headers
axiosInstance.interceptors.request.use(
    (config) => {
        config.withCredentials = true
        const token = localStorage.getItem('ticket')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add a response interceptor to handle the token expiration
// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response
//     },
//     async (error) => {
//         const originalRequest = error.config
//         if (error.response.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true
//             try {
//                 const response = await axiosInstance.get('auth/refresh-token')
//                 const data = await response.data
//                 localStorage.setItem('ticket', data.accessToken)
//                 return axiosInstance(originalRequest)
//             } catch (error) {
//                 return Promise.reject(error)
//             }
//         }
//         return Promise.reject(error)
//     }
// )

export default axiosInstance