const SERVER_IP = "localhost:3900";

export const ENV = {
  BASE_PATH: `http://${SERVER_IP}`,
  BASE_API: `http://${SERVER_IP}/api`,
  API_ROUTES: {
    REGISTER: "auth/register",
    LOGIN: "auth/login",
    ClientCreate: "client/register",
    ClientList: "client/list",
    ClientPerfil: "client/profile",
    ClientListTicket: "client/listTicket",
    ClientListMachine: "client/listMachine",
    UserRegister: "user/register",
    UserLogin: "user/login",
    UserList: "user/list",
    UserPerfil: "user/profile",
    UserMe: "user/userMe",
    UserRefreshAccesasToken: "user/refresh-token",
    MachineList: "machine/list",
    MachinePerfil: "machine/perfil",
    TicketList: "ticket/getTickets",
    TicketCreate: "ticket/save"
  },
  JWT: {
    ACCESS: "token",
    REFRESH: "refresh"
  }
};
