export interface UserData {
  id: number;
  email: string;
  firstName: string;
  lastName:string;
}

export interface TokenData {
  key: string;
  expiry: string;
}

export interface User {
  profile: UserData;
  token: TokenData;
}
