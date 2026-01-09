'use client';

interface Props {
  categories: string[];
  activeCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categoryLabels: Record<string, string> = {
  appetizers: '🥗 Appetizers',
  mains: '🍽️ Mains',
  desserts: '🍰 Desserts',
  beverages: '🥤 Beverages',
};

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full font-semibold transition-colors ${
          activeCategory === null
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
        }`}
      >
        All Items
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`px-4 py-2 rounded-full font-semibold transition-colors ${
            activeCategory === category
              ? 'bg-primary text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
          }`}
        >
          {categoryLabels[category] || category}
        </button>
      ))}
    </div>
  );
}
