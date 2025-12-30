import { useState, useEffect } from 'react';

const defaultUser = {
  name: 'Guest',
  email: 'Sign In Required',
};

export const useAuthUser = () => {
  const getInitialUser = () => {
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    
    if (token && name && email) {
      return { name, email};
    }
    return defaultUser;
  };

  const [user, setUser] = useState(getInitialUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");

    if (token && name && email) {
      setUser({
        name: name, 
        email: email
      });
    } else {
     setUser(defaultUser);
    }
  }, []); 

  return user;
};

