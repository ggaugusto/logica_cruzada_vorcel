export interface CrosswordData {
  grid: {
    width: number;
    height: number;
    cells: Array<Array<{ answer: string; number?: number } | null>>;
  };
  words: PlacedWord[];
}

export interface PlacedWord {
  id: number;
  word: string;
  clue: string;
  x: number;
  y: number;
  direction: 'H' | 'V';
}

const STOPWORDS = new Set([
  'PARA', 'COMO', 'ESTE', 'ESTA', 'QUANDO', 'ONDE', 'QUEM', 'AQUELE', 'AQUELA', 
  'SOBRE', 'ENTRE', 'MUITO', 'MAIS', 'QUAL', 'SEUS', 'SUAS', 'PELO', 'PELA', 
  'ISSO', 'AQUI', 'DEPOIS', 'ANTES', 'DURANTE', 'SEGUNDO', 'OUTRO', 'MESMO',
  'ESTES', 'ESTAS', 'AQUELES', 'AQUELAS', 'PELOS', 'PELAS', 'NUMA', 'NUME', 
  'NUM', 'NUNS', 'ESSA', 'ESSE', 'ESSES', 'ESSAS', 'ISSO', 'ISTO', 'AQUILO',
  'VOCE', 'ELES', 'ELAS', 'QUALQUER', 'ALGUM', 'ALGUMA', 'NENHUM', 'NENHUMA',
  'TODOS', 'TODAS', 'CADA', 'OUTRA', 'MAIOR', 'MENOR', 'TUDO', 'NADA', 'POUCO',
  'GRANDE', 'ENTAO', 'ASSIM', 'POIS', 'PORQUE', 'LOGO', 'BEM', 'MAL', 'MUITOS',
  'SUA', 'SEU', 'NAS', 'NOS', 'DAS', 'DOS', 'COM', 'POR', 'QUE', 'QUAIS', 'SÃO',
  'TEM', 'UMA', 'UM', 'AO', 'AOS', 'AS', 'OS', 'OU', 'SE', 'DA', 'DO', 'NA', 'NO',
  'FOI', 'SER', 'ERA', 'PODE', 'SIDO', 'ESTAO', 'ESTAVA', 'TEVE', 'TINHA', 'TEMOS'
]);

export async function fetchWordsFromWikipedia(theme: string): Promise<Array<{word: string; clue: string}>> {
  try {
    const searchRes = await fetch(`https://pt.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(theme)}&utf8=&format=json&origin=*`);
    const searchData = await searchRes.json();
    if (!searchData.query?.search?.length) return [];
    
    const titles = searchData.query.search.slice(0, 3).map((s: any) => s.title);
    
    let allText = '';
    for (const t of titles) {
      const extractRes = await fetch(`https://pt.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=true&explaintext=true&titles=${encodeURIComponent(t)}&format=json&origin=*`);
      const extractData = await extractRes.json();
      const pages = extractData.query?.pages;
      if (pages) {
        Object.values(pages).forEach((p: any) => {
          if (p.extract) allText += p.extract + ' ';
        });
      }
    }

    const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    const sentences = allText.split(/(?<=[.?!])\s+/);
    
    // Embaralha as sentenças para garantir que o mesmo tema gere listas de palavras diferentes a cada rodada
    for (let i = sentences.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sentences[i], sentences[j]] = [sentences[j], sentences[i]];
    }
    
    const results: Array<{word: string; clue: string}> = [];
    const usedWords = new Set<string>();

    for (const st of sentences) {
      if (st.length < 20 || st.length > 150) continue;
      
      const words = st.match(/[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+/g);
      if (!words) continue;

      const candidates = words.filter(w => {
        const norm = normalize(w);
        return norm.length >= 4 && norm.length <= 10 && !STOPWORDS.has(norm);
      });

      if (candidates.length > 0) {
        // Escolhe um candidato aleatório em vez do mais longo sempre
        const chosen = candidates[Math.floor(Math.random() * candidates.length)];
        const normChosen = normalize(chosen);
        
        if (!usedWords.has(normChosen)) {
          usedWords.add(normChosen);
          const clueRegex = new RegExp(`\\b${chosen}\\b`, 'gi');
          const clue = st.replace(clueRegex, '___');
          results.push({ word: normChosen, clue });
        }
      }

      // Traz até 25 palavras para dar mais chance de formar uma grade maior e variada
      if (results.length >= 25) break;
    }

    return results;
  } catch (err) {
    console.error("Erro na busca da wikipedia", err);
    return [];
  }
}

interface InternalCell {
  char: string;
  wordIds: Set<number>;
}

export function generateCrosswordGrid(wordList: Array<{word: string; clue: string}>): CrosswordData | null {
  if (wordList.length === 0) return null;
  
  const sorted = [...wordList].sort((a, b) => b.word.length - a.word.length);
  const gridSize = 60;
  const grid: (InternalCell | null)[][] = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));

  const placedWords: Array<{word: string; clue: string; x: number; y: number; dir: 'H'|'V', id: number}> = [];

  const canPlace = (word: string, startX: number, startY: number, dir: 'H'|'V'): boolean => {
    if (startX < 0 || startY < 0) return false;
    if (dir === 'H' && startX + word.length >= gridSize) return false;
    if (dir === 'V' && startY + word.length >= gridSize) return false;

    let hasIntersection = false;

    for (let i = 0; i < word.length; i++) {
        const x = dir === 'H' ? startX + i : startX;
        const y = dir === 'V' ? startY + i : startY;

        const cell = grid[y][x];
        const char = word[i];

        if (cell && cell.char !== char) return false;
        if (cell && cell.char === char) hasIntersection = true;

        const isStart = i === 0;
        const isEnd = i === word.length - 1;

        if (dir === 'H') {
            if (!cell) {
               if (y > 0 && grid[y-1][x]) return false;
               if (y < gridSize - 1 && grid[y+1][x]) return false;
            }
            if (isStart && x > 0 && grid[y][x-1]) return false;
            if (isEnd && x < gridSize - 1 && grid[y][x+1]) return false;
        } else {
            if (!cell) {
               if (x > 0 && grid[y][x-1]) return false;
               if (x < gridSize - 1 && grid[y][x+1]) return false;
            }
            if (isStart && y > 0 && grid[y-1][x]) return false;
            if (isEnd && y < gridSize - 1 && grid[y+1][x]) return false;
        }
    }
    if (placedWords.length > 0 && !hasIntersection) return false;
    
    return true;
  };

  const place = (word: string, clue: string, startX: number, startY: number, dir: 'H'|'V', id: number) => {
    for (let i = 0; i < word.length; i++) {
      const x = dir === 'H' ? startX + i : startX;
      const y = dir === 'V' ? startY + i : startY;
      if (!grid[y][x]) grid[y][x] = { char: word[i], wordIds: new Set() };
      grid[y][x]!.wordIds.add(id);
    }
    placedWords.push({ word, clue, x: startX, y: startY, dir, id });
  };

  let w0 = sorted.shift()!;
  place(w0.word, w0.clue, Math.floor(gridSize/2) - Math.floor(w0.word.length/2), Math.floor(gridSize/2), 'H', 0);

  let attempts = 0;
  while (sorted.length > 0 && attempts < 100) {
     attempts++;
     let placedThisRound = false;

     for (let i = 0; i < sorted.length; i++) {
         const currentWord = sorted[i];
         let bestPlacement: {x: number, y: number, dir: 'H'|'V', score: number} | null = null;
         
         for (const placed of placedWords) {
            for (let j = 0; j < placed.word.length; j++) {
               const charToMatch = placed.word[j];
               const px = placed.dir === 'H' ? placed.x + j : placed.x;
               const py = placed.dir === 'V' ? placed.y + j : placed.y;

               for (let k = 0; k < currentWord.word.length; k++) {
                   if (currentWord.word[k] === charToMatch) {
                       const tryDir = placed.dir === 'H' ? 'V' : 'H';
                       const tryX = tryDir === 'H' ? px - k : px;
                       const tryY = tryDir === 'V' ? py - k : py;

                       if (canPlace(currentWord.word, tryX, tryY, tryDir)) {
                           const cx = tryX + (tryDir === 'H' ? currentWord.word.length/2 : 0);
                           const cy = tryY + (tryDir === 'V' ? currentWord.word.length/2 : 0);
                           const score = -Math.abs(cx - gridSize/2) - Math.abs(cy - gridSize/2);
                           if (!bestPlacement || score > bestPlacement.score) {
                               bestPlacement = { x: tryX, y: tryY, dir: tryDir, score };
                           }
                       }
                   }
               }
            }
         }
         
         if (bestPlacement) {
            place(currentWord.word, currentWord.clue, bestPlacement.x, bestPlacement.y, bestPlacement.dir, placedWords.length);
            sorted.splice(i, 1);
            placedThisRound = true;
            break; 
         }
     }
     if (!placedThisRound) break; 
  }

  if (placedWords.length < 2) return null; 

  let minX = gridSize, minY = gridSize, maxX = 0, maxY = 0;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
       if (grid[y][x]) {
         if (x < minX) minX = x;
         if (y < minY) minY = y;
         if (x > maxX) maxX = x;
         if (y > maxY) maxY = y;
       }
    }
  }

  const resultWidth = maxX - minX + 1;
  const resultHeight = maxY - minY + 1;

  const resultCells: Array<Array<{ answer: string; number?: number } | null>> = 
      Array(resultHeight).fill(null).map(() => Array(resultWidth).fill(null));

  for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
          if (grid[y][x]) {
              resultCells[y - minY][x - minX] = { answer: grid[y][x]!.char };
          }
      }
  }

  let currentNum = 1;
  const finalWords: PlacedWord[] = [];

  const startMap = new Map<string, typeof placedWords>();
  for (const pw of placedWords) {
      const sx = pw.x - minX;
      const sy = pw.y - minY;
      const key = `${sx},${sy}`;
      if (!startMap.has(key)) startMap.set(key, []);
      startMap.get(key)!.push(pw);
  }

  const keys = Array.from(startMap.keys()).map(k => {
      const [x,y] = k.split(',').map(Number);
      return {x,y, key:k};
  }).sort((a,b) => {
      if (a.y === b.y) return a.x - b.x;
      return a.y - b.y;
  });

  for (const item of keys) {
      const cellWords = startMap.get(item.key)!;
      resultCells[item.y][item.x]!.number = currentNum;
      
      for (const cw of cellWords) {
          finalWords.push({
              id: currentNum,
              word: cw.word,
              clue: cw.clue,
              x: cw.x - minX,
              y: cw.y - minY,
              direction: cw.dir
          });
      }
      currentNum++;
  }

  return {
     grid: { width: resultWidth, height: resultHeight, cells: resultCells },
     words: finalWords
  };
}
