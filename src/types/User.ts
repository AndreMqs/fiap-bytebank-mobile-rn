export interface User {
  id: string;
  uid: string; // ID unido do Firebase Auth
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserData {
  uid: string; // ID unido do Firebase Auth
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
