"use client";
import React from "react";

function IngredientRow({
  ingredient,
  onUpdate,
  onRemove,
  totalFlourGrams = 1000,
  isFlour = false,
  isRequired = false,
}) {
  const [localIngredient, setLocalIngredient] = useState({
    name: ingredient?.name || "",
    grams: ingredient?.grams || "",
    percentage: isFlour ? "100" : ingredient?.percentage || "",
  });

  const [error, setError] = useState("");

  const translations = {
    flourRequired: "* Flour (required)",
    grams: "g",
    percentage: "%",
    remove: "Remove ingredient",
  };

  const updateValues = useCallback(
    (field, value) => {
      const newIngredient = { ...localIngredient };
      setError("");

      if (field === "grams") {
        newIngredient.grams = value;
        if (!isFlour) {
          newIngredient.percentage = value
            ? ((value / totalFlourGrams) * 100).toFixed(1)
            : "";
        }
      } else if (field === "percentage" && !isFlour) {
        newIngredient.percentage = value;
        newIngredient.grams = value
          ? ((value * totalFlourGrams) / 100).toFixed(0)
          : "";
      } else {
        newIngredient[field] = value;
      }

      if (isRequired && !newIngredient.name) {
        setError("Name is required");
      }

      setLocalIngredient(newIngredient);
      onUpdate(newIngredient);
    },
    [totalFlourGrams, onUpdate, localIngredient, isFlour, isRequired]
  );

  return (
    <div className="flex flex-col w-full">
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="grid grid-cols-12 gap-2 items-center">
          <div className="col-span-6">
            <div className="relative">
              <input
                type="text"
                value={localIngredient.name}
                onChange={(e) => updateValues("name", e.target.value)}
                placeholder={
                  isFlour
                    ? translations.flourRequired
                    : `${isRequired ? "* " : ""}Ingredient name`
                }
                className={`w-full p-2 border ${
                  error ? "border-red-500" : "border-gray-200"
                } rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                  isRequired ? "pr-8" : ""
                }`}
                name="ingredientName"
              />
              {isRequired && !isFlour && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500">
                  *
                </span>
              )}
            </div>
          </div>

          <div className="col-span-3 relative">
            <input
              type="number"
              value={localIngredient.grams}
              onChange={(e) => updateValues("grams", e.target.value)}
              placeholder="0"
              className="w-full p-2 pr-6 border border-gray-200 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              name="grams"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              {translations.grams}
            </span>
          </div>

          <div className="col-span-2 relative">
            <input
              type="number"
              value={localIngredient.percentage}
              onChange={(e) => updateValues("percentage", e.target.value)}
              placeholder="0"
              className="w-full p-2 pr-6 border border-gray-200 rounded-md bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              disabled={isFlour}
              name="percentage"
            />
            <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              {translations.percentage}
            </span>
            {isFlour && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <i className="fas fa-lock text-gray-400"></i>
              </div>
            )}
          </div>

          <div className="col-span-1 flex justify-center">
            {!isRequired && (
              <button
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title={translations.remove}
              >
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mt-1 px-4">{error}</p>}
    </div>
  );
}

function IngredientRowStory() {
  const [ingredients, setIngredients] = useState([
    { name: "Bread Flour", grams: "1000", percentage: "100" },
    { name: "Water", grams: "700", percentage: "70" },
    { name: "Salt", grams: "20", percentage: "2" },
    { name: "Yeast", grams: "10", percentage: "1" },
  ]);

  const handleUpdate = (index, updatedIngredient) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = updatedIngredient;
    setIngredients(newIngredients);
  };

  const handleRemove = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-inter">
        Ingredient Calculator
      </h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-inter">
          Required Ingredients (Flour)
        </h3>
        <IngredientRow
          ingredient={ingredients[0]}
          onUpdate={(updated) => handleUpdate(0, updated)}
          onRemove={() => handleRemove(0)}
          totalFlourGrams={1000}
          isFlour={true}
          isRequired={true}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-inter">
          Required Ingredients
        </h3>
        <IngredientRow
          ingredient={ingredients[1]}
          onUpdate={(updated) => handleUpdate(1, updated)}
          onRemove={() => handleRemove(1)}
          totalFlourGrams={1000}
          isRequired={true}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white font-inter">
          Optional Ingredients
        </h3>
        {ingredients.slice(2).map((ingredient, index) => (
          <IngredientRow
            key={index + 2}
            ingredient={ingredient}
            onUpdate={(updated) => handleUpdate(index + 2, updated)}
            onRemove={() => handleRemove(index + 2)}
            totalFlourGrams={1000}
          />
        ))}
      </div>
    </div>
  );
}

export default IngredientRow;