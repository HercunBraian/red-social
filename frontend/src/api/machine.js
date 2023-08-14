import { ENV } from "../config/config";

export class Machine {
  baseApi = ENV.BASE_API;

  async createMachine(accessToken, data) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.MachineCreate}`;
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
      if (response.status !== 200) return result;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async list(token) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.MachineList}}`;
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

  async perfilMachine(token, idMachine) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.MachinePerfil}/${idMachine}`;
      const params = {
        headers: {
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

  // Contador de Reparaciones Totales
  async countRepairTotal(token, id) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.MachineCountTotal}/${id}`;
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
