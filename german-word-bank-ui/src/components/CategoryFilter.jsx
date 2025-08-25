import React from 'react';
import { Plus } from 'lucide-react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory, onAddCategory }) => {
  return (
    <div className="category-filter-bar">
      {/* "All" button, selected if no specific category is chosen */}
      <div
        className={`category-pill ${selectedCategory === null ? 'selected' : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </div>

      {/* Map through the categories to create a pill for each one */}
      {categories.map(cat => (
        <div
          key={cat.id}
          className={`category-pill ${selectedCategory === cat.id ? 'selected' : ''}`}
          onClick={() => onSelectCategory(cat.id)}
        >
          {cat.name}
        </div>
      ))}
      {/* Add the new button */}
      <div
        className="category-pill category-pill-add"
        onClick={onAddCategory}
        title="Create New Category"
      >
        <Plus size={18} />
      </div>
    </div>
  );
};

export default CategoryFilter;