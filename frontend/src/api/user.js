import { ENV } from "../config/config";

export class User {
  baseApi = ENV.BASE_API;

  async login(data){
    try{
        const url = `${this.baseApi}/${ENV.API_ROUTES.UserLogin}`
        const params = {
            method: "POST",
            headers:{
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password,
            }),
        };
        
        const response = await fetch(url, params);
        const result = await response.json();

        if(response.status !== 200) throw result;
        return result;
    } catch (error) {
        throw error;
    }
}

  async perfil(data) {
    const id = data.id;
    const token = data.token;
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.UserPerfil}/${id}`;
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

  async register(data) {
    try {
      // Utilizamos formdata para poder subir imagenes.

      const url = `${this.baseApi}/${ENV.API_ROUTES.UserRegister}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;
      return result;
    } catch (error) {
      throw error;
    }
  }

  async list(token) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.UserList}}`;
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

  async userMe(token) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.UserMe}`
      const params = {
        headers: {
          Authorization: token,
        }
      }

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      console.log(error)
    }
  }

  async refreshAccessToken(refreshToken) {
    try {
      const url = `${this.baseApi}/${ENV.API_ROUTES.UserRefreshAccesasToken}`;
      const params = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: refreshToken,
        }),
      };

      const response = await fetch(url, params);
      const result = await response.json();

      if (response.status !== 200) throw result;

      return result;
    } catch (error) {
      throw error;
    }
  }

  setAccessToken(token) {
    localStorage.setItem(ENV.JWT.ACCESS, token)
  }

  getAccessToken() {
    return localStorage.getItem(ENV.JWT.ACCESS);
  }

  setRefreshToken(token) {
    localStorage.setItem(ENV.JWT.REFRESH, token);
  }

  getRefreshToken() {
    return localStorage.getItem(ENV.JWT.REFRESH);
  }

  removeTokens() {
    localStorage.removeItem(ENV.JWT.ACCESS)
    localStorage.removeItem(ENV.JWT.REFRESH)
  }

  // Seteamos la configuracion del Token


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
