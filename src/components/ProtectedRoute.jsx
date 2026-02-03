import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    // If there is no user, redirect to login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Otherwise, render the component 
    return children
}

export default ProtectedRoute