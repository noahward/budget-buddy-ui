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

export interface ApiUserErrors {
  email?: Array<string>;
  firstName?: Array<string>;
  lastName?: Array<string>;
  nonFieldErrors?: Array<string>;
  detail?: string;
}
