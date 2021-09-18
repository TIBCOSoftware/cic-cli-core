export class CLIBaseError extends Error {
  name: string;
  constructor(message: string) {
    super(message);
    this.name = 'CLIError';
  }
}

export class HTTPError extends CLIBaseError {
  httpCode?: string | number;
  httpHeaders?: { [index: string]: any };
  httpResponse?: any;
  constructor(message: string, httpCode?: string | number, httpResponse?: any, httpHeaders?: { [index: string]: any }) {
    super(message);
    this.httpCode = httpCode;
    this.httpHeaders = httpHeaders;
    this.httpResponse = httpResponse;
    this.name = 'HTTPError';
  }
}
