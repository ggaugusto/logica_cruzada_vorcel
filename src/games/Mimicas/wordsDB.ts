import { PESSOAS_POP } from './db_pessoas_pop';
import { LUGARES_POP } from './db_lugares_pop';
import { COISAS_POP } from './db_coisas_pop';
import { ACOES_POP } from './db_acoes_pop';
import { FILMES_POP } from './db_filmes_pop';
import { ANIMAIS_POP } from './db_animais_pop';

export interface MimicaItem {
  word: string;
  category: 'Pessoa' | 'Lugar' | 'Coisa' | 'Ação' | 'Filme/Livro' | 'Animal';
}

const allPessoas: MimicaItem[] = PESSOAS_POP.map(word => ({ word, category: 'Pessoa' }));
const allLugares: MimicaItem[] = LUGARES_POP.map(word => ({ word, category: 'Lugar' }));
const allCoisas: MimicaItem[] = COISAS_POP.map(word => ({ word, category: 'Coisa' }));
const allAcoes: MimicaItem[] = ACOES_POP.map(word => ({ word, category: 'Ação' }));
const allFilmes: MimicaItem[] = FILMES_POP.map(word => ({ word, category: 'Filme/Livro' }));
const allAnimais: MimicaItem[] = ANIMAIS_POP.map(word => ({ word, category: 'Animal' }));

export const DATABASE: MimicaItem[] = [
  ...allPessoas,
  ...allLugares,
  ...allCoisas,
  ...allAcoes,
  ...allFilmes,
  ...allAnimais,
];

/**
 * Fisher-Yates Shuffle Algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
