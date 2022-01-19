// * entry point

import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { axios, useAuth, useAuthUpdate } from "./helpers";
import { User } from "./interfaces/user";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return new Promise((resolve) => {
      const originalRequest = error.config;
      if (
        error.response &&
        error.response.status === 403 &&
        error.config &&
        !error.config.__isRetryRequest
      ) {
        originalRequest._retry = true;

        const response = axios
          .post("/api/sessions/refresh", null, { withCredentials: true })
          .then((res) => {
            return axios(originalRequest);
          });
        resolve(response);
      }

      return Promise.reject(error);
    });
  }
);

function App() {
  const user = useAuth();
  const userUpdate = useAuthUpdate();

  const [auth, setAuth] = useState(user);

  useEffect(() => {
    setAuth(user);
  }, [user]);

  useEffect(() => {
    axios
      .get("/api/users/me", { withCredentials: true })
      .then((res: AxiosResponse<User, any>) => {
        userUpdate({ authenticated: true, user: { ...res.data } });
      })
      .catch((e) => {
        if (e.response.status === 403) {
          axios
            .post("/api/sessions/refresh", null, { withCredentials: true })
            .then()
            .catch(console.error);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      {auth.authenticated ? <div>dashboard</div> : <div>landing</div>}
    </div>
  );
}

export default App;
