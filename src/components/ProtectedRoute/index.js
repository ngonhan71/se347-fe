import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ role, redirectPath = '/' }) {
    if (role < 1 || !role) {
        return  <Navigate to={redirectPath} replace />
    }
    return <Outlet />
}

export default ProtectedRoute