export type Mood = 1 | 2 | 3 | 4 | 5;

export interface Entry {
  id: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  promptId?: string;
  promptText?: string;
  body: string;
  mood?: Mood;
}

export type Category =
  | 'ozet'
  | 'duygu'
  | 'sukran'
  | 'insanlar'
  | 'duyular'
  | 'gelecek'
  | 'gecmis'
  | 'derin';

export type TimeOfDay = 'sabah' | 'aksam' | 'herhangi';

export interface Prompt {
  id: string;
  text: string;
  category: Category;
  timeOfDay: TimeOfDay;
  depth: 1 | 2 | 3; // 1 = hafif, 3 = derin
}
