import React from 'react';
import { X } from 'lucide-react';

const levelColors = {
  BEGINNER: {
    badge: 'bg-slate-100 text-slate-700 border-slate-200',
    indicator: 'bg-slate-400',
    label: 'Beginner',
  },
  INTERMEDIATE: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    indicator: 'bg-blue-500',
    label: 'Intermediate',
  },
  ADVANCED: {
    badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    indicator: 'bg-indigo-600',
    label: 'Advanced',
  },
};

export const SkillBadge = ({ name, level = 'INTERMEDIATE', onRemove, size = 'normal' }) => {
  const normalizedLevel = (level || 'INTERMEDIATE').toUpperCase();
  const config = levelColors[normalizedLevel] || levelColors.INTERMEDIATE;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border font-medium transition-all hover:shadow-sm ${
        config.badge
      } ${size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-xs sm:text-sm'}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.indicator}`} />
      <span className="font-semibold text-slate-900">{name}</span>
      <span className="text-[11px] opacity-75 font-normal">({config.label})</span>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10 text-slate-500 hover:text-slate-800 transition"
          aria-label={`Remove ${name}`}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
