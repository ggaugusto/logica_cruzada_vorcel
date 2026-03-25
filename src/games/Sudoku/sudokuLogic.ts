export type Difficulty = 'iniciante' | 'facil' | 'medio' | 'dificil' | 'especialista';

const DIFFICULTY_MAP: Record<Difficulty, [number, number]> = {
  iniciante: [50, 60],
  facil: [40, 49],
  medio: [30, 39],
  dificil: [24, 29],
  especialista: [17, 23],
};

function isValid(board: number[][], row: number, col: number, num: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
    if (board[i][col] === num) return false;
    const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
    const boxCol = 3 * Math.floor(col / 3) + (i % 3);
    if (board[boxRow][boxCol] === num) return false;
  }
  return true;
}

function solve(board: number[][]): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) {
        const nums = [1,2,3,4,5,6,7,8,9];
        for (let i = nums.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [nums[i], nums[j]] = [nums[j], nums[i]];
        }
        for (let num of nums) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solve(board)) return true;
            board[row][col] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

export function generateSudoku(difficulty: Difficulty): { solution: number[][], puzzle: number[][] } {
  const solution = Array(9).fill(0).map(() => Array(9).fill(0));
  
  // Fill the center box completely random to kickstart the solving variety
  const nums = [1,2,3,4,5,6,7,8,9].sort(() => Math.random() - 0.5);
  let nIdx = 0;
  for(let i=3; i<6; i++) {
      for(let j=3; j<6; j++) {
          solution[i][j] = nums[nIdx++];
      }
  }

  solve(solution);

  const puzzle = solution.map(row => [...row]);
  
  const [minClues, maxClues] = DIFFICULTY_MAP[difficulty];
  const cluesCount = Math.floor(Math.random() * (maxClues - minClues + 1)) + minClues;
  let cellsToRemove = 81 - cluesCount;

  while (cellsToRemove > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== 0) {
      puzzle[row][col] = 0;
      cellsToRemove--;
    }
  }

  return { solution, puzzle };
}
