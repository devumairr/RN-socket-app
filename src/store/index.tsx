import React, { PropsWithChildren, useEffect, useState } from 'react';

import AuthContext from '../contexts/auth.context';
import UserContext from '../contexts/user.context';
import { getSession } from '../utils/userSession';

const Store = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<string | null>('');

  useEffect(() => {
    (async () => {
      setLoading(true);

      const sessionID = await getSession();

      if (sessionID) {
        setUser(sessionID);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated,
        setIsAuthenticated,
        setLoading,
      }}>
      <UserContext.Provider
        value={{
          user,
          setUser,
        }}>
        {children}
      </UserContext.Provider>
    </AuthContext.Provider>
  );
};

export default Store;
