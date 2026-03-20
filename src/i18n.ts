import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  'pt-BR': {
    translation: {
      'app_title': 'Lógica Cruzada',
      'clear_grid': 'Limpar Grade',
      'categories': 'Categorias',
      'suspects': 'Suspeitos',
      'weapons': 'Armas',
      'locations': 'Locais',
      'settings': 'Configurações',
      'add_category': 'Adicionar Categoria',
      'add_item': 'Adicionar Item',
      'delete': 'Excluir',
      'empty_state': 'Nenhuma categoria configurada.'
    }
  },
  'en': {
    translation: {
      'app_title': 'Logic Grid Solver',
      'clear_grid': 'Clear Grid',
      'categories': 'Categories',
      'suspects': 'Suspects',
      'weapons': 'Weapons',
      'locations': 'Locations',
      'settings': 'Settings',
      'add_category': 'Add Category',
      'add_item': 'Add Item',
      'delete': 'Delete',
      'empty_state': 'No categories configured.'
    }
  },
  'es': {
    translation: {
      'app_title': 'Lógica Cruzada',
      'clear_grid': 'Limpiar Cuadrícula',
      'categories': 'Categorías',
      'suspects': 'Sospechosos',
      'weapons': 'Armas',
      'locations': 'Lugares',
      'settings': 'Ajustes',
      'add_category': 'Añadir Categoría',
      'add_item': 'Añadir Ítem',
      'delete': 'Eliminar',
      'empty_state': 'No hay categorías configuradas.'
    }
  }
};

const savedLanguage = localStorage.getItem('app-language') || 'pt-BR';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
