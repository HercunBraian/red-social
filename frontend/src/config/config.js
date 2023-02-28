const SERVER_IP = "localhost:3900";

export const ENV = {
  BASE_PATH: `http://${SERVER_IP}`,
  BASE_API: `http://${SERVER_IP}/api`,
  API_ROUTES: {
    REGISTER: "auth/register",
    LOGIN: "auth/login",
    ClientList: "client/list",
    ClientPerfil: "client/profile",
    UserRegister: "user/register",
    UserLogin: "user/login",
    UserList: "user/list",
    UserPerfil: "user/profile",
  },
};
