import axios from "axios"

// Create an instance of the axios with pre-defined configs
const api = axios.create({
    baseURL: "http://localhost:8000/api", // Django server URL
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

export default api