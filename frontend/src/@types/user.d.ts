
export interface IUser {
  _id: string;
  email: string;
  name: string;
  bio: string;
  phone: number;
  avatar: string;
  access_token: string;
}

export type UserContextType = {
  user: IUser;
  saveTodo: (todo: ITodo) => void;
  updateTodo: (id: number) => void;
  setUser: () => null
};
