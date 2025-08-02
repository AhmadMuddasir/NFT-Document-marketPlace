import React from 'react';


const CheckBox = ({ category, isSelected, setCategory }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer select-none">
      <div className="relative">
        {/* Hidden native checkbox for accessibility */}
        <input 
          type="checkbox"
          checked={isSelected}
          onChange={() => setCategory(category)}
          className="absolute opacity-0 h-0 w-0"
        />
        
        {/* Custom checkbox appearance - only shows border when not selected */}
        <div className={`none
        `}>
          {/* Single checkmark icon - only shown when selected */}
          {isSelected && (
            <svg 
              className="text-white"
              width="14" 
              height="14" 
              viewBox="0 0 24 24"
              fill="none"
            >
              <path 
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-gray-700 dark:text-gray-300">{category}</span>
    </label>
  );
};

export default CheckBox;