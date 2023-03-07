import {Navigate, Outlet} from "react-router-dom";

export const ProtectedRoute = ({user, children, redirecTo = "/admin"}) => {
    if(user) {
        return <Navigate to={redirecTo} />
    } 
    return children ? children : <Outlet />
}