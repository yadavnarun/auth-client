// * entry point

import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { axios, useAuth, useAuthUpdate } from "./helpers";
import { User } from "./interfaces/user";

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
      .catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      {auth.authenticated ? <div>homepage</div> : <div>landing</div>}
    </div>
  );
}

export default App;
