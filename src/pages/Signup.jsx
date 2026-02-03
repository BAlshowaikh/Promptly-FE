import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const Register = () => {
    const [formData, setFormData] = useState({username: '', email: '', password: '', confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    // ---- Change the data on the formData as the user is typing
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    // Handle form submission (Basic password validation and call to the BE endpoint)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        // Passwords must match
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match.")
        }

        try {
            // Call your Django RegisterView
            const response = await api.post("/auth/register/", {
                username: formData.username,
                email: formData.email,
                password: formData.password
            })

            if (response.status === 201 || response.data.success) {
                setSuccess(true);
                // Redirect to login 
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            //  logs the actual object Django sent back (e.g., {email: ["..."]})
            console.log("BE Error:", err.response?.data)

            // Handle DRF validation errors (e.g., email already exists)
            const message = err.response?.data?.message || "Registration failed. Try again."
            setError(message)
        }
    }

    if (success) {
        return (
            <div className="register-container">
                <h2>Registration Successful!</h2>
                <p>Redirecting you to the login page...</p>
            </div>
        )
    }

    return (
        <div className="register-container">
            <h2>Create an Account</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="username" onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" onChange={handleChange} required />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" name="confirmPassword" onChange={handleChange} required />
                </div>
                <button type="submit">Register</button>
            </form>

            <p>
                Already have an account? <Link to="/login">Login here</Link>
            </p>
        </div>
    )
}

export default Register