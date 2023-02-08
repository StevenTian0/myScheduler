
export interface BaseNote {
  title: string;
  description: string;
}

export interface Note extends BaseNote {
  id: number;
}