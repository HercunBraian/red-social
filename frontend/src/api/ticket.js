import { ENV } from "../config/config";

export class Ticket {
  baseApi = ENV.BASE_API;

  async createTicket(accessToken, data){
    try {
        const url = `${this.baseApi}/${ENV.API_ROUTES.TicketCreate}`;
        const params = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: accessToken
            },
            body: JSON.stringify(data),
        }; 

        const response = await fetch(url, params)
        const result = await response.json()
        if(response.status !== 200) return result;
        return result;
    } catch (error) {
        throw error;
    }
} 

  async list(token) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.TicketList}`;
      const params = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateTicket(token, idTicket, data){
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.TicketUpdate}/${idTicket}`;
      const params = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify(data)
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if(response.status !== 200) throw result;
      return result;

    } catch (error) {
      console.error(error)
    }
  }

  async deleteTicket(token, idTicket) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.TicketDelete}/${idTicket}`;
      const params = {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      };
  
      const response = await fetch(url, params);
      const result = await response.json();
  
      if (response.status !== 200) {
        throw new Error(`Error deleting ticket: ${result.message}`);
      }
  
      return result;
    } catch (error) {
      throw error;
    }
  }

  async getTicket (token, ticketId) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.TicketPerfil}/${ticketId}`;
      const params = {
        headers: {
          Authorization: token
        }
      }

      const response = await fetch(url, params);
      const result = await response.json();

      if(response.status !== 200) throw result;
      return result;
      
    } catch (error) {
      throw error;
    }
  }

  async getTicketCount (token) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.TicketCount}`;
      const params = {
        headers: {
          Authorization: token
        }
      }

      const response = await fetch(url, params);
      const result = await response.json();

      if(response.status !== 200) throw result;
      return result;
      
    } catch (error) {
      throw error;
    }
  }

  async getTicketCountClose (token) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.TicketCountClose}`;
      const params = {
        headers: {
          Authorization: token
        }
      }

      const response = await fetch(url, params);
      const result = await response.json();

      if(response.status !== 200) throw result;
      return result;
      
    } catch (error) {
      throw error;
    }
  }


  /*  async perfilClient(params) {
    const idClient = params;
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.ClientPerfil}/${idClient}`;
      const params = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response !== 200) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  }
 */
  /* async updateCourse(accessToken, idCourse, data) {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      if (data.file) {
        formData.append("miniature", data.file);
      }

      const url = `${this.baseApi}/${ENV.API_ROUTES.COURSE}/${idCourse}`;

      const params = {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response !== 200) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async deleteCourse(accessToken, idCourse) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.COURSE}/${idCourse}`;
      const params = {
        method: "DELETE",
        headers: {
          Authorization: ` Bearer ${accessToken}`,
        },
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response !== 200) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  } */
}
