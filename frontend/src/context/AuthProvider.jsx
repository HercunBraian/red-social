import { useState, useEffect, createContext } from "react";
import { User } from "../api/user";
import {hasExpiredToken} from "../config/jwt";

const userController = new User();

export const AuthContext = createContext();

export function AuthProvider(props) {
    const { children } = props;
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            // Comprobar si el usuario esta logueado o no
            const accessToken = userController.getAccessToken();
            const refreshToken = userController.getRefreshToken();
            
            if (!accessToken || !refreshToken) {
                logout();
                setLoading(false)
                return;
            }

            if (hasExpiredToken(accessToken)) {
                //ha caducado
                if (hasExpiredToken(refreshToken)) {
                    logout()
                } else {
                    await reLogin(refreshToken);
                }
            } else {
                await login(accessToken);
                
            }

            setLoading(false)
        })()

    }, []);

    const reLogin = async (refreshToken) =>{
        try {
            const {accessToken} = await userController.refreshAccessToken(refreshToken)
            userController.setAccessToken(accessToken);
            
            await login(accessToken);
        } catch (error) {
            
        }
    }

    const login = async (accessToken, refreshToken) => {
        try {
            const response = await userController.userMe(accessToken)
            setUser(response)
            setToken(accessToken)
            
            
            
        } catch (error) {
            console.log(error)
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null)
        userController.removeTokens();
    }

    const data = {
        token : token,
        user, 
        login,
        logout,
    };

    if (loading) return null;

    return <AuthContext.Provider value={data} >
        {children}
    </AuthContext.Provider>
}

export default AuthContext;