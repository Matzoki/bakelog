"use client";
import React from "react";

import { useUpload } from "../utilities/runtime-helpers";

function MainComponent() {
  const [selectedTab, setSelectedTab] = useState("new");
  const [bakes, setBakes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [upload, { loading: uploadLoading }] = useUpload();
  const [language, setLanguage] = useState("en");
  const [tempUnit, setTempUnit] = useState("F");
  const [bakeType, setBakeType] = useState("other");
  const [ingredients, setIngredients] = useState([
    { name: "Bread Flour", grams: "1000", percentage: "100", locked: true },
  ]);
  const [images, setImages] = useState([]);
  const [proofingSteps, setProofingSteps] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const updateIngredientPercentages = (ingredients) => {
    const flourWeight =
      ingredients.find((i) => i.name === "Bread Flour")?.grams || 1000;
    return ingredients.map((ing) => ({
      ...ing,
      percentage: ing.locked
        ? ing.percentage
        : ((parseFloat(ing.grams) / parseFloat(flourWeight)) * 100).toFixed(1),
    }));
  };
  const translations = {
    en: {
      title: "Baking Logger",
      newBake: "New Bake",
      history: "Baking History",
      recipeName: "Recipe Name",
      temperature: "Temperature",
      duration: "Duration",
      minutes: "minutes",
      notes: "Notes",
      save: "Save Bake",
      saving: "Saving...",
      loading: "Loading...",
      noBakes: "No bakes recorded yet. Start by adding a new bake!",
      bakeType: "Bake Type",
      breadPizza: "Bread & Pizza",
      other: "Other",
      ingredients: "Ingredients",
      addIngredient: "Add Ingredient",
      images: "Images",
      proofingSteps: "Proofing Steps",
      weight: "Weight",
      percentage: "Baker's %",
      grams: "grams",
      flourRequired: "Flour is required",
      remove: "Remove",
      uploadImage: "Upload Image",
      imageNotes: "Image Notes",
      proofingStep: "Proofing Step",
      addStep: "Add Step",
    },
    he: {
      title: "יומן אפייה",
      newBake: "אפייה חדשה",
      history: "היסטוריית אפייה",
      recipeName: "שם המתכון",
      temperature: "טמפרטורה",
      duration: "משך זמן",
      minutes: "דקות",
      notes: "הערות",
      save: "שמור אפייה",
      saving: "שומר...",
      loading: "טוען...",
      noBakes: "אין אפיות עדיין. התחל על ידי הוספת אפייה חדשה!",
      bakeType: "סוג אפייה",
      breadPizza: "לחם ופיצה",
      other: "אחר",
      ingredients: "מרכיבים",
      addIngredient: "הוסף מרכיב",
      images: "תמונות",
      proofingSteps: "שלבי התפחה",
      weight: "משקל",
      percentage: "אחוז מהקמח",
      grams: "גרם",
      flourRequired: "חובה להוסיף קמח",
      remove: "הסר",
      uploadImage: "העלה תמונה",
      imageNotes: "הערות לתמונה",
      proofingStep: "שלב התפחה",
      addStep: "הוסף שלב",
    },
  };
  const fetchBakes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/get-bakes", { method: "POST" });
      if (!response.ok) {
        throw new Error(`Error fetching bakes: ${response.status}`);
      }
      const data = await response.json();
      setBakes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load bakes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBakes();
    const storedLang = localStorage.getItem("preferredLanguage") || "en";
    const storedUnit = localStorage.getItem("preferredTempUnit") || "F";
    setLanguage(storedLang);
    setTempUnit(storedUnit);
    document.documentElement.dir = storedLang === "he" ? "rtl" : "ltr";

    if (bakeType === "breadPizza") {
      setIngredients([
        { name: "Bread Flour", grams: "1000", percentage: "100", locked: true },
        { name: "Water", grams: "700", percentage: "70" },
        { name: "Salt", grams: "20", percentage: "2" },
      ]);
    }
  }, [bakeType]);

  async function handleNewBake(data) {
    setLoading(true);
    setError(null);
    try {
      let imageUrl = null;
      if (previewImage) {
        const uploadResult = await upload({ file: previewImage });
        if (uploadResult.error) throw new Error(uploadResult.error);
        imageUrl = uploadResult.url;
      }

      const response = await fetch("/api/save-bake", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          image_url: imageUrl,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error saving bake: ${response.status}`);
      }

      await fetchBakes();
      setPreviewImage(null);
      setSelectedTab("history");
    } catch (err) {
      setError("Failed to save bake. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen bg-[#FFF8E7] dark:bg-[#3C2A20] p-4 md:p-8"
      dir={language === "he" ? "rtl" : "ltr"}
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              const newLang = language === "en" ? "he" : "en";
              setLanguage(newLang);
              localStorage.setItem("preferredLanguage", newLang);
              document.documentElement.dir = newLang === "he" ? "rtl" : "ltr";
            }}
            className="px-3 py-1 rounded-md border border-[#D2691E] text-sm text-gray-700 dark:text-white"
          >
            {language === "en" ? "עברית" : "English"}
          </button>
          <button
            onClick={() => {
              const newUnit = tempUnit === "F" ? "C" : "F";
              setTempUnit(newUnit);
              localStorage.setItem("preferredTempUnit", newUnit);
            }}
            className="px-3 py-1 rounded-md border border-[#D2691E] text-sm text-gray-700 dark:text-white"
          >
            °{tempUnit === "F" ? "C" : "F"}
          </button>
        </div>
        <h1 className="text-4xl font-bold text-gray-700 dark:text-white mb-8 font-inter">
          Baking Logger
        </h1>
        <div className="flex gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded-md font-inter text-base transition-colors ${
              selectedTab === "new"
                ? "bg-[#8B4513] text-white dark:bg-white dark:text-[#8B4513]"
                : "border border-[#D2691E] text-gray-700 dark:text-white hover:bg-[#693109] hover:text-white"
            }`}
            onClick={() => setSelectedTab("new")}
          >
            New Bake
          </button>
          <button
            className={`px-4 py-2 rounded-md font-inter text-base transition-colors ${
              selectedTab === "history"
                ? "bg-[#8B4513] text-white dark:bg-white dark:text-[#8B4513]"
                : "border border-[#D2691E] text-gray-700 dark:text-white hover:bg-[#693109] hover:text-white"
            }`}
            onClick={() => setSelectedTab("history")}
          >
            Baking History
          </button>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {selectedTab === "new" ? (
          <div className="bg-[#FFF8DC] dark:bg-[#3C2A20] p-6 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-inter">
              Log New Bake
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const temp = formData.get("temperature");
                const convertedTemp =
                  tempUnit === "C" ? (temp * 9) / 5 + 32 : temp;

                handleNewBake({
                  recipeName: formData.get("recipeName"),
                  temperature: convertedTemp,
                  duration: formData.get("duration"),
                  notes: formData.get("notes"),
                  type: formData.get("bakeType"),
                  ingredients,
                  images,
                  proofingSteps,
                });
              }}
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-inter text-gray-700 dark:text-white mb-2">
                    {translations[language].bakeType}
                  </label>
                  <select
                    name="bakeType"
                    value={bakeType}
                    onChange={(e) => setBakeType(e.target.value)}
                    className="w-full p-3 border border-[#D2691E] rounded-lg bg-white dark:bg-[#3C2A20] dark:border-[#8B4513] dark:text-white"
                  >
                    <option value="other">
                      {translations[language].other}
                    </option>
                    <option value="breadPizza">
                      {translations[language].breadPizza}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-inter text-gray-700 dark:text-white mb-2">
                    {translations[language].recipeName}
                  </label>
                  <input
                    name="recipeName"
                    className="w-full p-3 border border-[#D2691E] rounded-lg bg-white dark:bg-[#3C2A20] dark:border-[#8B4513] dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter text-gray-700 dark:text-white mb-2">
                    {translations[language].ingredients}
                  </label>
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 mb-2 text-sm font-medium text-gray-700 dark:text-white">
                      <div className="col-span-6">
                        {translations[language].recipeName}
                      </div>
                      <div className="col-span-3">
                        {translations[language].weight}
                      </div>
                      <div className="col-span-3">
                        {translations[language].percentage}
                      </div>
                    </div>
                    {ingredients.map((ingredient, index) => (
                      <IngredientRow
                        key={index}
                        ingredient={ingredient}
                        onUpdate={(updated) => {
                          const newIngredients = [...ingredients];
                          newIngredients[index] = updated;
                          setIngredients(
                            updateIngredientPercentages(newIngredients)
                          );
                        }}
                        onRemove={() => {
                          if (!ingredient.locked) {
                            setIngredients(
                              ingredients.filter((_, i) => i !== index)
                            );
                          }
                        }}
                        totalFlourGrams={1000}
                        isFlour={ingredient.locked}
                        isRequired={ingredient.locked}
                      />
                    ))}
                    <button
                      type="button"
                      onClick={() =>
                        setIngredients([
                          ...ingredients,
                          {
                            name: "",
                            grams: "",
                            percentage: "",
                            locked: false,
                          },
                        ])
                      }
                      className="mt-2 w-full py-2 border-2 border-dashed border-[#D2691E] rounded-lg text-gray-700 hover:border-[#8B4513] dark:text-white"
                    >
                      {translations[language].addIngredient}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-inter text-gray-700 dark:text-white mb-2">
                    {translations[language].temperature} (°{tempUnit})
                  </label>
                  <input
                    name="temperature"
                    type="number"
                    className="w-full p-3 border border-[#D2691E] rounded-lg bg-white dark:bg-[#3C2A20] dark:border-[#8B4513] dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter text-gray-700 dark:text-white mb-2">
                    {translations[language].duration} (
                    {translations[language].minutes})
                  </label>
                  <input
                    name="duration"
                    type="number"
                    className="w-full p-3 border border-[#D2691E] rounded-lg bg-white dark:bg-[#3C2A20] dark:border-[#8B4513] dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-inter text-gray-700 dark:text-white mb-2">
                    {translations[language].images}
                  </label>
                  <ImageUploader
                    onImagesChange={setImages}
                    initialImages={images}
                  />
                </div>

                {bakeType === "breadPizza" && (
                  <div>
                    <label className="block text-sm font-inter text-gray-900 dark:text-white mb-2">
                      {translations[language].proofingSteps}
                    </label>
                    <ProofingStepLogger
                      onAddStep={setProofingSteps}
                      initialSteps={proofingSteps}
                      type={bakeType}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-inter text-gray-700 dark:text-white mb-2">
                    {translations[language].notes}
                  </label>
                  <textarea
                    name="notes"
                    className="w-full p-3 border border-[#D2691E] rounded-lg bg-white dark:bg-[#3C2A20] dark:border-[#8B4513] dark:text-white min-h-[100px]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || uploadLoading}
                  className="w-full bg-[#8B4513] text-white dark:bg-[#D2691E] dark:text-white py-3 rounded-md font-inter hover:bg-[#693109] dark:hover:bg-[#8B4513] transition-colors disabled:opacity-50"
                >
                  {loading || uploadLoading
                    ? translations[language].saving
                    : translations[language].save}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-gray-700 dark:text-white mb-6 font-inter">
              {translations[language].history}
            </h2>
            {loading ? (
              <div className="text-center py-12 bg-[#FFF8DC] dark:bg-[#3C2A20] rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 font-inter">
                  {translations[language].loading}
                </p>
              </div>
            ) : bakes.length === 0 ? (
              <div className="text-center py-12 bg-[#FFF8DC] dark:bg-[#3C2A20] rounded-lg">
                <p className="text-gray-700 dark:text-gray-300 font-inter">
                  {translations[language].noBakes}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {bakes.map((bake) => (
                  <div
                    key={bake.id}
                    className="bg-[#FFF8DC] dark:bg-[#3C2A20] p-6 rounded-lg"
                  >
                    <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-4 font-inter">
                      {bake.recipe_name}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {bake.images?.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={image.url}
                            alt={image.notes || bake.recipe_name}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                          {image.notes && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                              {image.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2 text-gray-700 dark:text-gray-300 font-inter text-sm">
                      <p>
                        {translations[language].temperature}:{" "}
                        {tempUnit === "C"
                          ? (((bake.temperature - 32) * 5) / 9).toFixed(1)
                          : bake.temperature}
                        °{tempUnit}
                      </p>
                      <p>
                        {translations[language].duration}: {bake.duration}{" "}
                        {translations[language].minutes}
                      </p>
                      <p>
                        {new Date(bake.created_at).toLocaleDateString(
                          language === "he" ? "he-IL" : "en-US"
                        )}
                      </p>
                      {bake.ingredients?.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-bold mb-2">
                            {translations[language].ingredients}:
                          </h4>
                          <ul className="list-disc list-inside">
                            {bake.ingredients.map((ing, index) => (
                              <li key={index}>
                                {ing.name}: {ing.quantity_grams}g (
                                {ing.bakers_percentage}%)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {bake.proofingSteps?.length > 0 && (
                        <div className="mt-4">
                          <h4 className="font-bold mb-2">
                            {translations[language].proofingSteps}:
                          </h4>
                          {bake.proofingSteps.map((step, index) => (
                            <div key={index} className="mb-2">
                              <p>
                                {new Date(step.created_at).toLocaleTimeString()}
                                : {step.notes}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      {bake.notes && (
                        <p className="mt-4">
                          {translations[language].notes}: {bake.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MainComponent;