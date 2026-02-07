export interface Academia {
  id: string;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  raio: number;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAcademia {
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  raio: number;
  logoUrl?: string | null;
}

export interface UpdateAcademia {
  nome?: string;
  endereco?: string;
  latitude?: number;
  longitude?: number;
  raio?: number;
  logoUrl?: string | null;
}
