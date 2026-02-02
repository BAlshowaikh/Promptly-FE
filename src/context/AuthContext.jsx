/* This file use to pass the user object to any 
component that request it, also it handles checing the stored token
in the local storage and setting the logged in user
*/

import { createContext, useState, useEffect } from "react"
import api from "../services/api"
import { jwtDecode } from "jwt-decode"

const AuthContext = createContext()

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // ------ Hook 1: Runs once as soon as the app starts
    // Check if there are any stored access-tokens in the local storage
    // update the user and det them to logged in if found
    useEffect(() => {
        const accessToken = localStorage.getItem("access_token")

        // Decode the token which wil have the user info
        if (accessToken){
            try{
                const decode = jwtDecode(accessToken)
                setUser(decode) // Now it contains user_id, email, username 
            } catch (error) {
                console.error("Invalid token found")
                logoutUser()
            }
        }

        setLoading(false) // This means that React completed looking at the local storage
    }, [])

    // ------ Function 1: Login function
    const loginUser = async (email, password) => {
        try{
            // Send the login info for the BE, BE checks it 
            const response = await api.post("/auth/login/", {email, password})

            // If login success then store the returned tokens (returned by the DRF SimpleJWT library)
            localStorage.setItem("access_token", response.data.access)
            localStorage.setItem("refresh_token", response.data.refresh)
            
            // Decode the received access token so we have the user info
            const decoded = jwtDecode(response.data.access);
            setUser(decoded) // this now conatins email, user_id, username

            return { success: true }
        } catch(error){
            return { success: false, message: "Invalid credentials" }
        }
    }

    // ----------- Function 2: Logout function
    const logoutUser = () => {
        // Remove the tokens from localstorage
        localStorage.removeItem("access_token")
        localStorage.removeItem("refresh_token")
        setUser(null)
    }

    // What context data to be sent
    const contextData = {
        user,
        loginUser,
        logoutUser,
    }

    return (
        <AuthContext.Provider value={contextData}>
            {/* This means wait until react chekcs the local storage for tokens then render the App component in main   */} 
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default AuthContext