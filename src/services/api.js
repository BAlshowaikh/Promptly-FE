import axios from "axios"

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api"

// Create an instance of the axios with pre-defined configs
const api = axios.create({
    baseURL: BASE_URL, // Django server URL
    timeout: 5000, // Time allowed to wait for respond from the BE server
    withCredentials: true,
    headers: {
        "Content-Type": "application/json", // Tells BE server what kind on data the Client is sending (for POST/PUT requests)
        "Accept": "application/json", // Tells the server what kind of data the Client wants to receive
    }
})

// For each request attach the access token so the BE validate it
api.interceptors.request.use((config) => {
        const token = localStorage.getItem("access_token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },(error) => {
        return Promise.reject(error);
    }
)

// Function to handle the refresh endpoint automatically
// Once the access token is expired any request the suer sends BE will return 401
// This function catches the 401 error before it goes to the UI and send a refresh request to the BE
// If successful the new access token will be stored, if faild the user will have to login again
api.interceptors.response.use((response) => response, // If the request succeeds, just pass it through
    async (error) => {
        const originalRequest = error.config

        // If the error is 401 and we haven't tried retrying yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true

            try {
                const refreshToken = localStorage.getItem("refresh_token");
                
                // Call the Refresh endpoint
                const response = await axios.post(`${BASE_URL}/token/refresh/`, {
                    refresh: refreshToken
                })

                if (response.status === 200) {
                    const newAccessToken = response.data.access
                    
                    // Save the new key
                    localStorage.setItem("access_token", newAccessToken)
                    
                    // Update the original request's header and retry it
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest)
                }
            } catch (refreshError) {
                // If refresh fails, the user must log in again
                localStorage.removeItem("access_token")
                localStorage.removeItem("refresh_token")
                window.location.href = "/login"
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)

export default api