import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext'

const Login = () => {
    const [formData, setFormData] = useState({email:"", password:""})
    const [error, setError] = useState("")

    // Access the Context to get the data
    const {loginUser} = useContext(AuthContext)
    const navigate = useNavigate() // Navigate the user to another page

    // ----- Handle form change
    const handleChange = (e) => {
        // Below will append the new data into the exisiting data -if there are any-
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    // Handle the form submission (Check user credintials)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("") // clear any exisitng errors

        // Call the auth context function that will reach the BE and check the user credintials
        const response = await loginUser(formData.email, formData.password)

        if (response.success) {
            // Redirect to the learning area or home
            navigate('/learning/languages/');
        } else {
            setError(response.message);
        }
    }

    return (
        <div className="login-container">
            <h2>Login to AI Vision Learning</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <button type="submit">Login</button>
            </form>

            <p>
                Don't have an account? <Link to="/signup">Register here</Link>
            </p>
        </div>
    )

}

export default Login