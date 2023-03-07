import {Navigate, Outlet} from "react-router-dom";

export const ProtectedRoutePrivate = ({user, children, redirecTo = "/"}) => {
    if(!user) {
        return <Navigate to={redirecTo} />
    }

    return children ? children : <Outlet />
}