"use client";
import React from "react";

function TemperatureConverter() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");

  const handleCelsiusChange = (value) => {
    setCelsius(value);
    if (value === "") {
      setFahrenheit("");
      return;
    }
    const f = (parseFloat(value) * 9) / 5 + 32;
    setFahrenheit(f.toFixed(1));
  };

  const handleFahrenheitChange = (value) => {
    setFahrenheit(value);
    if (value === "") {
      setCelsius("");
      return;
    }
    const c = ((parseFloat(value) - 32) * 5) / 9;
    setCelsius(c.toFixed(1));
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 inline-block">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-inter">
        Temperature Converter
      </h3>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-inter text-gray-900 dark:text-white">
            Celsius
          </label>
          <div className="relative">
            <input
              type="number"
              value={celsius}
              onChange={(e) => handleCelsiusChange(e.target.value)}
              className="w-full p-3 pr-8 border border-gray-200 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter temperature"
              name="celsius"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              °C
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <i className="fas fa-exchange-alt text-gray-400 dark:text-gray-600"></i>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-inter text-gray-900 dark:text-white">
            Fahrenheit
          </label>
          <div className="relative">
            <input
              type="number"
              value={fahrenheit}
              onChange={(e) => handleFahrenheitChange(e.target.value)}
              className="w-full p-3 pr-8 border border-gray-200 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter temperature"
              name="fahrenheit"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              °F
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TemperatureConverterStory() {
  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-inter">
        Temperature Converter Demo
      </h2>
      <div className="space-y-8">
        <TemperatureConverter />
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
            Common Baking Temperatures:
          </p>
          <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300 font-inter">
            <li>- Bread baking: 350°F (175°C) to 450°F (230°C)</li>
            <li>- Pizza: 450°F (230°C) to 500°F (260°C)</li>
            <li>- Pastries: 325°F (165°C) to 375°F (190°C)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TemperatureConverter;