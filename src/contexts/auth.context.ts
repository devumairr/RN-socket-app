import { Dispatch, SetStateAction, createContext } from 'react';

export interface IUserContext {
  isAuthenticated: boolean;
  loading: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

export default createContext<IUserContext>({
  isAuthenticated: false,
  loading: false,
  setIsAuthenticated: () => {},
  setLoading: () => {},
});
