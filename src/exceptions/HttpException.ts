export class HttpException extends Error {
  public status: number;
  public message: string;
  public path: string;

  constructor(status: number, message: string, path?: string) {
    super(message);
    this.status = status;
    this.message = message;
    this.path = path;
  }
}
