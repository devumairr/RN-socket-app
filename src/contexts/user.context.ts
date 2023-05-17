import { Dispatch, SetStateAction, createContext } from 'react';

export interface IUserContext {
  user: string | null;
  setUser: Dispatch<SetStateAction<string | null>>;
}

export default createContext<IUserContext>({
  user: null,
  setUser: () => {},
});
