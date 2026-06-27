import { Cargo } from '../../common/enums/cargo.enum';

export class CandidatoEntity {
  id!: string;

  usuarioId!: string;

  usuario?: {
    id: string;
    nome: string;
    email: string;
    role: string;
    ativo: boolean;
  };

  skills!: string[];

  nivel!: string;

  cargoDesejado!: Cargo;

  regiao!: string;

  grupoDiversidade?: string;

  latitude?: number;

  longitude?: number;

  ageGroup?: string;

  incomeCluster?: string;

  mobilityPattern?: string;

  scoreMobilidade?: number;

  ativo!: boolean;

  criadoEm!: Date;

  atualizadoEm!: Date;
}
