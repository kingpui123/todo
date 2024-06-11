import React, { createContext, useEffect, useState } from 'react';
import { LocalStorageTokenKey } from '../const/const.js'

export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(LocalStorageTokenKey))
  const [initFetched, setInitFetched] = useState(false)

  useEffect(() => {
    localStorage.setItem(LocalStorageTokenKey, token)
  }, [token])

  return (
    <UserContext.Provider value={{ user, setUser, token, setToken, initFetched, setInitFetched }}>
      {children}
    </UserContext.Provider>
  );
};