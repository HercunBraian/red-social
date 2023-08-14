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
    MachineCreate: "machine/save",
    MachineList: "machine/list",
    MachinePerfil: "machine/perfil",
    MachineCountTotal: "machine/count-repair",
    TicketList: "ticket/getTickets",
    TicketCreate: "ticket/save",
    TicketUpdate: "ticket/update",
    TicketDelete: "ticket/delete",
    TicketPerfil: "ticket/perfil",
    TicketCount: "ticket/count",
    TicketCountClose: "ticket/countClose",
    DepartmentList: "department/list",
  },
  JWT: {
    ACCESS: "token",
    REFRESH: "refresh"
  }
};
