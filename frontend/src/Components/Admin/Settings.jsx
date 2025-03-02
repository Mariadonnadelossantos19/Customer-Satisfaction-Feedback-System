import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [brightness, setBrightness] = useState(100); // Default brightness to 100%

  useEffect(() => {
    // Apply dark mode class to html element
    const htmlElement = document.documentElement; // Get the <html> element
    htmlElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleDarkModeToggle = () => {
    setDarkMode(prevMode => !prevMode);
  };

  const handleBrightnessChange = (e) => {
    setBrightness(e.target.value);
    document.body.style.filter = `brightness(${e.target.value}%)`; // Adjust brightness
  };

  return (
    <div className={`settings-container ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6`}>
      <h2 className="text-2xl font-bold mb-4">Settings</h2>
      
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={handleDarkModeToggle}
            className="mr-2"
          />
          <span>Enable Dark Mode</span>
        </label>
      </div>

      <div>
        <label className="block mb-2">Adjust Brightness:</label>
        <input
          type="range"
          min="0"
          max="200"
          value={brightness}
          onChange={handleBrightnessChange}
          className="w-full"
        />
        <span>{brightness}%</span>
      </div>
    </div>
  );
};

export default Settings;