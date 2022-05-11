/**
 * Types of the request
 */
export type RequestType = {
  command: string;
  arguments: string;
}

/**
 * Types of the response
 */
export type ResponseType = {
    success: boolean;
    output: string;
}