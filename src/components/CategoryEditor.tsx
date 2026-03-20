import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useGridStore, Category, GridItem } from '../store/useGridStore';
import { Plus, Trash2, Settings, X as CloseIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import { IconRenderer } from '../utils/iconMap';

const INVESTIGATIVE_ICONS = [
  'user', 'users', 'user-circle', 'user-check', 'user-minus', 'user-plus', 'user-x',
  'sword', 'shield', 'shield-alert', 'shield-check', 'shield-off', 'crosshair', 'target',
  'map', 'map-pin', 'compass', 'navigation', 'globe', 'flag', 'bookmark', 'tag',
  'flask-conical', 'flask-round', 'syringe', 'pill', 'microscope', 'test-tube', 'test-tubes',
  'book', 'book-open', 'file-text', 'clipboard', 'clipboard-list', 'file-search', 'archive',
  'search', 'eye', 'eye-off', 'glasses', 'scan', 'scan-line', 'scan-face', 'fingerprint',
  'footprints', 'briefcase', 'camera', 'video', 'mic', 'radio', 'tv', 'laptop', 'monitor',
  'lock', 'unlock', 'key', 'key-round', 'door-closed', 'door-open',
  'clock', 'alarm-clock', 'hourglass', 'timer', 'calendar', 'calendar-days',
  'phone', 'smartphone', 'mail', 'send', 'share', 'share-2', 'link', 'paperclip',
  'scissors', 'hammer', 'wrench', 'axe', 'pen-tool', 'edit-2', 'edit-3', 'type',
  'car', 'truck', 'bus', 'train', 'plane', 'bike', 'anchor', 'ship', 'rocket',
  'wine', 'coffee', 'beer', 'cup-soda', 'apple', 'carrot', 'pizza', 'utensils',
  'bone', 'skull', 'ghost', 'flame', 'droplet', 'moon', 'sun', 'star', 'cloud', 'umbrella',
  'music', 'headphones', 'bell', 'alert-triangle', 'alert-circle', 'info', 'help-circle',
  'check-circle', 'x-circle', 'activity', 'heart-pulse', 'zap', 'power',
  'gift', 'award', 'medal', 'heart', 'gem', 'crown', 'shirt', 'shopping-bag', 'shopping-cart',
  'tent', 'tree-pine', 'tree-deciduous', 'flower', 'mountain', 'building', 'home', 'castle', 'factory',
  'gavel', 'scale', 'magnet', 'battery', 'plug', 'trash', 'trash-2', 'box', 'package',
  'smile', 'frown', 'meh', 'thumbs-up', 'thumbs-down', 'cloud-snow', 'cloud-rain', 'cloud-lightning', 'wind',
  'circle', 'square', 'triangle', 'hexagon', 'octagon', 'pentagon'
];

export const CategoryEditor: React.FC = () => {
  const categories = useGridStore(state => state.categories);
  const addCategory = useGridStore(state => state.addCategory);
  const removeCategory = useGridStore(state => state.removeCategory);
  const updateCategory = useGridStore(state => state.updateCategory);
  const autoFillEnabled = useGridStore(state => state.autoFillEnabled);
  const toggleAutoFill = useGridStore(state => state.toggleAutoFill);
  
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  // Icon Picker State
  const [addingToCategory, setAddingToCategory] = useState<Category | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('user');

  const handleAddCategory = () => {
    const name = prompt(t('add_category') + " (Name):");
    if (name) {
      addCategory({ id: `cat-${Date.now()}`, name, items: [] });
    }
  };

  const removeItem = (category: Category, itemId: string) => {
    updateCategory({
      ...category,
      items: category.items.filter(i => i.id !== itemId)
    });
  };

  const saveNewItem = () => {
    if (!addingToCategory || !newItemName) return;
    
    const newItem: GridItem = { id: `item-${Date.now()}`, name: newItemName, iconName: selectedIcon };
    updateCategory({ ...addingToCategory, items: [...addingToCategory.items, newItem] });
    
    // Reset modal
    setAddingToCategory(null);
    setNewItemName('');
    setSelectedIcon('user');
  };

  const openAddItemModal = (cat: Category) => {
    setAddingToCategory(cat);
    setSelectedIcon('user');
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-zinc-800 hover:bg-zinc-700 border border-zinc-500 p-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-colors text-zinc-200 z-40 flex items-center justify-center group"
        title={t('settings')}
      >
        <Settings size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="fixed inset-y-0 right-0 w-[85vw] sm:w-96 bg-zinc-950 shadow-2xl border-l border-zinc-800 p-4 sm:p-6 overflow-y-auto z-50 flex flex-col">
        <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
          <h2 className="text-xl font-bold tracking-widest text-zinc-200 flex items-center gap-2 uppercase">
            <Settings size={20} className="text-zinc-400" />
            {t('categories')}
          </h2>
          <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white transition-colors bg-zinc-800 p-1.5 rounded">
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="flex-1 space-y-6">
          <div 
            onClick={toggleAutoFill}
            className="bg-zinc-900 border border-zinc-700 p-4 rounded flex items-center justify-between cursor-pointer hover:bg-zinc-800 transition-colors shadow-inner mt-6"
          >
            <div>
              <h3 className="font-bold text-zinc-300">Modo Assistido</h3>
              <p className="text-[10px] sm:text-xs text-zinc-500 mt-1 uppercase tracking-wider">Preenche "X" automaticamente</p>
            </div>
            {autoFillEnabled ? (
              <ToggleRight size={32} className="text-emerald-500" />
            ) : (
              <ToggleLeft size={32} className="text-zinc-600" />
            )}
          </div>

          {categories.map(cat => (
            <div key={cat.id} className="bg-zinc-900 p-4 rounded border border-zinc-700 shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-zinc-300 tracking-wide">{cat.name}</h3>
                <button 
                  onClick={() => removeCategory(cat.id)}
                  className="text-red-500/50 hover:text-red-400 transition-colors p-1"
                  title={t('delete')}
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <ul className="space-y-2 mb-4">
                {cat.items.map(item => (
                  <li key={item.id} className="flex justify-between items-center text-sm text-zinc-400 bg-zinc-950 p-2.5 rounded border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center border border-zinc-700">
                        <IconRenderer name={item.iconName} size={14} className="text-zinc-300" />
                      </div>
                      <span className="font-mono">{item.name}</span>
                    </div>
                    <button 
                      onClick={() => removeItem(cat, item.id)}
                      className="text-zinc-600 hover:text-red-400 p-1"
                      title={t('delete')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => openAddItemModal(cat)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-zinc-800 bg-zinc-950 border border-zinc-800 rounded transition-colors uppercase tracking-wider font-semibold"
              >
                <Plus size={16} />
                {t('add_item')}
              </button>
            </div>
          ))}

          <button 
            onClick={handleAddCategory}
            className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-900/20 hover:bg-emerald-900/40 text-emerald-500 border border-emerald-900/50 rounded transition-colors uppercase tracking-wider font-bold"
          >
            <Plus size={18} />
            {t('add_category')}
          </button>
        </div>
      </div>

      {/* Add Item Modal with Icon Picker */}
      {addingToCategory && (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-lg w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-zinc-200">Adicionar Item em {addingToCategory.name}</h3>
            
            <div>
              <label className="block text-xs uppercase text-zinc-500 mb-1">Nome do Item</label>
              <input 
                autoFocus
                type="text" 
                value={newItemName}
                onChange={e => setNewItemName(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 p-2 rounded text-zinc-200 outline-none focus:border-blue-500 font-mono"
                placeholder="Ex: Biblioteca"
              />
            </div>

            <div>
              <label className="block text-xs uppercase text-zinc-500 mb-1">Selecione um Ícone</label>
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5 h-48 overflow-y-auto p-2 bg-zinc-950 border border-zinc-800 rounded">
                {INVESTIGATIVE_ICONS.map(icon => {
                  const isSelected = selectedIcon === icon;
                  return (
                    <button
                      key={icon}
                      onClick={() => setSelectedIcon(icon)}
                      className={`
                        p-2 rounded flex items-center justify-center transition-colors aspect-square
                        hover:bg-zinc-800 cursor-pointer bg-zinc-900
                        ${isSelected ? '!bg-blue-600 outline outline-1 outline-blue-400 shadow-[0_0_10px_rgba(37,99,235,0.5)]' : ''}
                      `}
                      title={icon}
                    >
                      <IconRenderer name={icon} size={18} />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-2">
              <button 
                onClick={() => setAddingToCategory(null)}
                className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200"
              >
                Cancelar
              </button>
              <button 
                onClick={saveNewItem}
                disabled={!newItemName || !selectedIcon}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-500 text-white rounded disabled:opacity-50 font-bold tracking-wide"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
