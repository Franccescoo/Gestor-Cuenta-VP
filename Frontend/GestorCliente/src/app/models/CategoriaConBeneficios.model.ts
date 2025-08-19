import { BeneficioDTO } from "./BeneficioDTO.model";

export interface CategoriaConBeneficios {
  id: number;
  nombre: string;
  descripcion: string | null;
  nivel: number;                // 1..5 (Silver..Diamante)
  beneficios: BeneficioDTO[];   // ya tienes BeneficioDTO
}