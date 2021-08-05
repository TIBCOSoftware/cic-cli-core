export interface ProfileSecrets {
  accessToken?: string;
  refreshToken?: string;
}

export interface Profile {
  name: string;
  org: string;
  region: region;
  OAuthTokenExpTime: number;
}

export interface UserConfig {
  version: string;
  defaultProfile: string;
  profiles: Profile[];
  clientID: string;
}

export interface HTTPResponse {
  body: any;
  statusCode: number | string;
  headers: any;
}

export type region = 'us' | 'eu' | 'au';
