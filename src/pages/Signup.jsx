import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

const Register = () => {
    const [formData, setFormData] = useState({username: '', email: '', password: '', confirmPassword: ''})
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (formData.password !== formData.confirmPassword) {
            return setError("Passwords do not match.")
        }

        try {
            const response = await api.post("/auth/register/", {
                username: formData.username,
                email: formData.email,
                password: formData.password
            })

            if (response.status === 201 || response.data.success) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            const message = err.response?.data?.message || "Registration failed. Try again."
            setError(message)
        }
    }

    return (
        <div className="min-h-screen bg-[#11121a] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full bg-[#1a1b26] border border-gray-800 rounded-xl shadow-2xl p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-white">Get Started</h2>
                    <p className="text-gray-400 mt-2">Join the Promptly AI community</p>
                </div>

                {success ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-white">Account Created!</h3>
                        <p className="text-gray-400 mt-2">Redirecting you to login...</p>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded text-red-500 text-sm text-center">
                                {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Username</label>
                                <input type="text" name="username" onChange={handleChange} className="w-full bg-[#11121a] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:border-blue-500 focus:outline-none" placeholder="johndoe" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                                <input type="email" name="email" onChange={handleChange} className="w-full bg-[#11121a] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:border-blue-500 focus:outline-none" placeholder="john@example.com" required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Password</label>
                                    <input type="password" name="password" onChange={handleChange} className="w-full bg-[#11121a] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:border-blue-500 focus:outline-none" placeholder="••••••••" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm</label>
                                    <input type="password" name="confirmPassword" onChange={handleChange} className="w-full bg-[#11121a] border border-gray-700 rounded-lg px-4 py-2 text-gray-200 focus:border-blue-500 focus:outline-none" placeholder="••••••••" required />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all mt-4">
                                Create Account
                            </button>
                        </form>
                    </>
                )}

                {!success && (
                    <p className="mt-8 text-center text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                            Sign In
                        </Link>
                    </p>
                )}
            </div>
        </div>
    )
}

export default Register