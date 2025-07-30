import React from 'react';

const CheckBox = ({ category, isSelected, setCategory }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer select-none">
      <div className="relative">
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={() => setCategory(category)}
          className="absolute opacity-0 h-0 w-0"
        />
        <span className={`absolute top-0 left-0 h-5 w-5 border-2 rounded 
          ${isSelected ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}
        >
          {isSelected && (
            <svg 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
              width="12" 
              height="12" 
              viewBox="0 0 24 24"
            >
              <path 
                fill="currentColor" 
                d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"
              />
            </svg>
          )}
        </span>
      </div>
      <span className="text-gray-700 dark:text-gray-300">{category}</span>
    </label>
  );
};

export default CheckBox;