import { SystemCredentialDTO } from "./SystemCredentialDTO.model";

export interface SendCredentialsResponse {
  email: string;
  total: number;
  sistemas: SystemCredentialDTO[];
}