import { CategoriaConBeneficios } from "./CategoriaConBeneficios.model";

export interface CatalogoBeneficiosResponse {
  playerId: string;
  systemId: number;
  categorias: CategoriaConBeneficios[];
  totalBeneficios: number;
}