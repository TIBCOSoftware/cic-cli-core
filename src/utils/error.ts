/**
 * Copyright 2022. TIBCO Software Inc.
 * This file is subject to the license terms contained
 * in the license file that is distributed with this file.
 */

import { CLIError } from '@oclif/errors';
/**
 * Extend this class if you want create custom errors
 */
export class CLIBaseError extends CLIError {
  name: string;
  constructor(message: string) {
    super(message);
    this.name = 'CLIBaseError';
  }
}

/**
 * In case you want to throw an HTTP Error
 */
export class HTTPError extends CLIBaseError {
  httpCode?: string | number;
  httpHeaders?: { [index: string]: any };
  httpResponse?: any;
  /**
   *
   * @param message Error message
   * @param httpCode HTTP Code for error
   * @param httpResponse HTTP Response
   * @param httpHeaders HTTP Headers
   */
  constructor(message: string, httpCode?: string | number, httpResponse?: any, httpHeaders?: { [index: string]: any }) {
    super(message);
    this.httpCode = httpCode;
    this.httpHeaders = httpHeaders;
    this.httpResponse = httpResponse;
    this.name = 'HTTPError';
  }
}
