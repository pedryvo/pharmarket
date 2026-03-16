"use client"

interface Category {
  id: string;
  label: string;
}

interface CategoryStripProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export const CategoryStrip = ({ categories, activeCategory, onCategoryChange }: CategoryStripProps) => {
  return (
    <div className="cat-strip flex gap-2 p-3 pt-0 overflow-x-auto border-b border-vitalab-border bg-white scrollbar-hide">
      <button
        onClick={() => onCategoryChange('all')}
        className={`cat-pill flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[0.76rem] font-bold cursor-pointer transition-all whitespace-nowrap
          ${activeCategory === 'all' 
            ? 'bg-vitalab-green border-vitalab-green text-white shadow-vitalab-sm' 
            : 'bg-white border-vitalab-border text-vitalab-text-secondary hover:border-vitalab-green hover:text-vitalab-green'}`}
      >
        Todos
      </button>
      
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`cat-pill flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[0.76rem] font-bold cursor-pointer transition-all whitespace-nowrap
            ${activeCategory === cat.id 
              ? 'bg-vitalab-green border-vitalab-green text-white shadow-vitalab-sm' 
              : 'bg-white border-vitalab-border text-vitalab-text-secondary hover:border-vitalab-green hover:text-vitalab-green'}`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};
