import { ConfigService as Service } from "./service";
import { IConfigAdapter } from "./adapter";

export * from "./types";
export * from "./adapter";
export const ConfigService: IConfigAdapter = new Service()