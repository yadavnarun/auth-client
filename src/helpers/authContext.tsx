import { createContext, SetStateAction, useContext, useState } from "react";
import { User } from "../interfaces/user";

interface userAuth {
  authenticated: boolean;
  user: User;
}

const AuthContext = createContext<userAuth>({
  authenticated: false,
  user: {
    _id: "",
    email: "",
    firstName: "",
    lastName: "",
    createdAt: "",
    updatedAt: "",
    iat: 0,
    exp: 0,
  },
});

const AuthUpdateContext = createContext((newUser: any) => {});

export function useAuth() {
  return useContext(AuthContext);
}

export function useAuthUpdate() {
  return useContext(AuthUpdateContext);
}

export function AuthProvider({ children }: { children: any }) {
  const [user, setUser] = useState<userAuth>({
    authenticated: false,
    user: {
      _id: "",
      email: "",
      firstName: "",
      lastName: "",
      createdAt: "",
      updatedAt: "",
      iat: 0,
      exp: 0,
    },
  });

  function toggleUser(newUser: SetStateAction<userAuth>) {
    setUser(newUser);
  }

  return (
    <AuthContext.Provider value={user}>
      <AuthUpdateContext.Provider value={(newUser) => toggleUser(newUser)}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
}
