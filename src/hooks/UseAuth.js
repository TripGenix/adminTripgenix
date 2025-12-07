import { useState, useEffect } from "react";

const defaultUser = {
  name: "Guest",
  email: "Sign In Required",
};

export default function useAuth() {
  const getInitialUser = () => {
    const stored = localStorage.getItem("user");
    if (!stored) return defaultUser;

    try {
      const parsed = JSON.parse(stored);
      return parsed?.name && parsed?.email ? parsed : defaultUser;
    } catch {
      return defaultUser;
    }
  };

  const [user, setUser] = useState(getInitialUser);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) return setUser(defaultUser);

    try {
      setUser(JSON.parse(stored));
    } catch {
      setUser(defaultUser);
    }
  }, []);

  const updateUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);
  };

  const clearUser = () => {
    localStorage.removeItem("user");
    setUser(defaultUser);
  };

  return { user, updateUser, clearUser };
}
