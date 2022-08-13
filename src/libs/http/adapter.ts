export interface IHttpAdapter<T> {
  instance(config?: unknown): T;
}
