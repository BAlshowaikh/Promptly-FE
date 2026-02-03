import React, { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const Login = () => {
    const [formData, setFormData] = useState({email:"", password:""})
    const [error, setError] = useState("")
    const { loginUser } = useContext(AuthContext)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const response = await loginUser(formData.email, formData.password)
        if (response.success) {
            navigate('/learning/languages/');
        } else {
            setError(response.message);
        }
    }

    return (
        <div className="min-h-screen bg-[#11121a] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-[#1a1b26] border border-gray-800 rounded-xl shadow-2xl p-8">
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-2xl mx-auto mb-4">
                        L
                    </div>
                    <h2 className="text-2xl font-bold text-white">Welcome Back</h2>
                    <p className="text-gray-400 mt-2">Login to continue your AI learning journey</p>
                </div>

                {error && (
                    <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="w-full bg-[#11121a] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="name@company.com"
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="w-full bg-[#11121a] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                            placeholder="••••••••"
                            value={formData.password} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                    >
                        Sign In
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-blue-500 hover:text-blue-400 font-medium">
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login