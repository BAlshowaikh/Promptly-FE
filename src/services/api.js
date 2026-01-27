import axios from "axios"

// Create an instance of the axios with pre-defined configs
const api = axios.create({
    baseURL: "http://localhost:8000", // Django server URL
    timeout: 5000, // Time allowed to wait for respond from the BE server
    headers: {
        "Content-Type": "application/json", // Tells BE server what kind on data the Client is sending (for POST/PUT requests)
        "Accept": "application/json", // Tells the server what kind of data the Client wants to receive
    }
})

export default api