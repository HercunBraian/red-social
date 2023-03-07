import jwtDecode from "jwt-decode";

export const hasExpiredToken = (token) => {
    const { exp} = jwtDecode(token);
    const currenData = new Date().getTime();

    if(exp <= currenData){
        return true;
    }
    
}