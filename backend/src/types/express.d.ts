declare namespace Express {
  export interface Request {
    validated?: {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };
  }
}
