"use client"

interface Category {
  id: string;
  label: string;
  ico: string;
}

interface CategoryStripProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

export const CategoryStrip = ({ categories, activeCategory, onCategoryChange }: CategoryStripProps) => {
  return (
    <div className="cat-strip flex gap-2 p-4 pt-0 overflow-x-auto border-b border-vitalab-border bg-white scrollbar-hide">
      <button
        onClick={() => onCategoryChange('all')}
        className={`cat-pill flex-shrink-0 flex items-center gap-[0.45rem] px-[0.95rem] py-[0.42rem] rounded-[20px] border-[1.5px] text-[0.82rem] font-semibold cursor-pointer transition-all whitespace-nowrap
          ${activeCategory === 'all' 
            ? 'bg-vitalab-green border-vitalab-green text-white' 
            : 'bg-white border-vitalab-border text-vitalab-text-secondary hover:border-vitalab-green hover:text-vitalab-green'}`}
      >
        <span className="cat-ico text-[0.95rem]">✨</span>
        Todos
      </button>
      
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`cat-pill flex-shrink-0 flex items-center gap-[0.45rem] px-[0.95rem] py-[0.42rem] rounded-[20px] border-[1.5px] text-[0.82rem] font-semibold cursor-pointer transition-all whitespace-nowrap
            ${activeCategory === cat.id 
              ? 'bg-vitalab-green border-vitalab-green text-white' 
              : 'bg-white border-vitalab-border text-vitalab-text-secondary hover:border-vitalab-green hover:text-vitalab-green'}`}
        >
          <span className="cat-ico text-[0.95rem]">{cat.ico}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
};
