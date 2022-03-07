/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */
export interface ProfileSecrets {
  accessToken: string;
  refreshToken: string;
  accessTokenExp: number;
  refreshTokenExp: number;
}

export interface Profile {
  name: string;
  org: string;
  region: region;
}

export interface HTTPResponse {
  body: any;
  statusCode: number | string;
  headers: any;
}

export type region = 'us' | 'eu' | 'au';

export type Choice = string | { name: string; value: any; checked?: boolean };
