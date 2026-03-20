import React from 'react';
import * as LucideIcons from 'lucide-react';

export const getIcon = (name: string) => {
  const pascalName = name.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('');
  return (LucideIcons as any)[pascalName] || LucideIcons.HelpCircle;
};

export const IconRenderer = ({ name, className, size = 16 }: { name: string, className?: string, size?: number }) => {
  const Icon = getIcon(name);
  return React.createElement(Icon, { className, size });
};
