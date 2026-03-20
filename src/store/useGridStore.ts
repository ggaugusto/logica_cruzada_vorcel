import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type MarkType = 'empty' | 'x' | 'check';

export interface GridItem {
  id: string;
  name: string;
  iconName: string;
}

export interface Category {
  id: string;
  name: string;
  items: GridItem[];
}

interface GridState {
  categories: Category[];
  marks: Record<string, MarkType>;
  autoFillEnabled: boolean;
  caseName: string;
  setCaseName: (name: string) => void;
  toggleAutoFill: () => void;
  resetGame: () => void;
  setMark: (rowId: string, colId: string, mark: MarkType) => void;
  clearGrid: () => void;
  addCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
  updateCategory: (category: Category) => void;
}

const defaultCategories: Category[] = [
  {
    id: 'cat-suspects',
    name: 'Suspeitos',
    items: [
      { id: 'susp-1', name: 'Logico', iconName: 'user' },
      { id: 'susp-2', name: 'Irônico', iconName: 'user' },
      { id: 'susp-3', name: 'Dramático', iconName: 'user' },
    ]
  },
  {
    id: 'cat-weapons',
    name: 'Armas',
    items: [
      { id: 'weap-1', name: 'Faca', iconName: 'sword' },
      { id: 'weap-2', name: 'Veneno', iconName: 'flask-conical' },
      { id: 'weap-3', name: 'Corda', iconName: 'spline' },
    ]
  },
  {
    id: 'cat-locations',
    name: 'Locais',
    items: [
      { id: 'loc-1', name: 'Biblioteca', iconName: 'book' },
      { id: 'loc-2', name: 'Cozinha', iconName: 'utensils' },
      { id: 'loc-3', name: 'Jardim', iconName: 'tree-pine' },
    ]
  }
];

export const useGridStore = create<GridState>()(
  persist(
    (set) => ({
      categories: defaultCategories,
      marks: {},
      autoFillEnabled: true,
      caseName: 'Dossiê Confidencial',
      setCaseName: (name) => set({ caseName: name }),
      resetGame: () => set({
        categories: defaultCategories,
        marks: {},
        caseName: 'Dossiê Confidencial'
      }),
      
      toggleAutoFill: () => set((state) => ({ autoFillEnabled: !state.autoFillEnabled })),
      
      setMark: (rowId, colId, mark) => {
        set((state) => {
          const newMarks = { ...state.marks };
          const key = `${rowId}::${colId}`;
          const reverseKey = `${colId}::${rowId}`;
          
          if (mark === 'check' && state.autoFillEnabled) {
            // Auto-exclusion logic (Regra Opcional/Avançada)
            // Encontrar os grupos aos quais pertencem rowId e colId
            const cats = state.categories;
            let rowCat: Category | null = null;
            let colCat: Category | null = null;
            
            for (const cat of cats) {
              if (cat.items.some(i => i.id === rowId)) rowCat = cat;
              if (cat.items.some(i => i.id === colId)) colCat = cat;
            }
            
            // X on the same row for this specific column category block
            if (rowCat && colCat) {
               colCat.items.forEach(cItem => {
                 if (cItem.id !== colId) {
                   newMarks[`${rowId}::${cItem.id}`] = 'x';
                   newMarks[`${cItem.id}::${rowId}`] = 'x';
                 }
               });
               // X on the same column for this specific row category block
               rowCat.items.forEach(rItem => {
                 if (rItem.id !== rowId) {
                   newMarks[`${rItem.id}::${colId}`] = 'x';
                   newMarks[`${colId}::${rItem.id}`] = 'x';
                 }
               });
            }
          }
          
          newMarks[key] = mark;
          newMarks[reverseKey] = mark; // Symmetry
          
          return { marks: newMarks };
        });
      },
      
      clearGrid: () => set({ marks: {} }),
      
      addCategory: (category) => set((state) => ({ categories: [...state.categories, category] })),
      
      removeCategory: (id) => set((state) => ({ 
        categories: state.categories.filter((c) => c.id !== id) 
      })),

      updateCategory: (updatedCategory) => set((state) => ({
        categories: state.categories.map((c) => c.id === updatedCategory.id ? updatedCategory : c)
      }))
    }),
    {
      name: 'logica-cruzada-storage',
    }
  )
);
