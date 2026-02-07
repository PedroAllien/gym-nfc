export interface Academia {
  id: string;
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  raio: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAcademia {
  nome: string;
  endereco: string;
  latitude: number;
  longitude: number;
  raio: number;
}

export interface UpdateAcademia {
  nome?: string;
  endereco?: string;
  latitude?: number;
  longitude?: number;
  raio?: number;
}
