"use client";
import React from "react";

function ProofingStepLogger({ onAddStep, initialSteps = [], type }) {
  const [steps, setSteps] = useState(initialSteps);
  const [currentStep, setCurrentStep] = useState({
    timestamp: new Date().toISOString().slice(0, 16),
    notes: "",
    images: [],
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/bakes/proofing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentStep),
      });

      if (!response.ok) {
        throw new Error("Failed to save proofing step");
      }

      const newSteps = [...steps, currentStep];
      setSteps(newSteps);
      onAddStep?.(newSteps);

      setCurrentStep({
        timestamp: new Date().toISOString().slice(0, 16),
        notes: "",
        images: [],
      });
    } catch (err) {
      console.error(err);
      setError("Failed to save step. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!["bread", "pizza"].includes(type?.toLowerCase())) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg">
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-inter">
          Proofing & Folding Log
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-inter text-gray-900 dark:text-white mb-2">
              Timestamp
            </label>
            <input
              type="datetime-local"
              value={currentStep.timestamp}
              onChange={(e) =>
                setCurrentStep({ ...currentStep, timestamp: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
              name="timestamp"
            />
          </div>

          <div>
            <label className="block text-sm font-inter text-gray-900 dark:text-white mb-2">
              Notes
            </label>
            <textarea
              value={currentStep.notes}
              onChange={(e) =>
                setCurrentStep({ ...currentStep, notes: e.target.value })
              }
              className="w-full p-3 border border-gray-200 rounded-lg bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[100px]"
              placeholder="Describe the proofing progress or folding technique..."
              name="notes"
            />
          </div>

          <ImageUploader
            onImagesChange={(images) =>
              setCurrentStep({ ...currentStep, images })
            }
            initialImages={currentStep.images}
          />

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 py-3 rounded-md font-inter hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {loading ? "Saving..." : "Add Step"}
          </button>
        </form>

        <div className="mt-8 space-y-6">
          <h4 className="text-lg font-bold text-gray-900 dark:text-white font-inter">
            Previous Steps
          </h4>
          {steps.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-600 dark:text-gray-400 font-inter">
                No steps recorded yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
                >
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-inter">
                      {new Date(step.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <p className="text-gray-900 dark:text-white font-inter mb-4">
                    {step.notes}
                  </p>
                  {step.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-4">
                      {step.images.map((image, imageIndex) => (
                        <div key={imageIndex}>
                          <img
                            src={image.url}
                            alt={image.notes || "Proofing step photo"}
                            className="rounded-lg w-full h-48 object-cover"
                          />
                          {image.notes && (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 font-inter">
                              {image.notes}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProofingStepLoggerStory() {
  const [allSteps, setAllSteps] = useState([]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 font-inter">
        Proofing Step Logger Demo
      </h2>

      <div className="space-y-8">
        <ProofingStepLogger
          type="bread"
          onAddStep={setAllSteps}
          initialSteps={[
            {
              timestamp: "2025-01-15T09:00",
              notes: "First fold completed. Dough showing good elasticity.",
              images: [
                {
                  url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?ixlib=rb-4.0.3",
                  notes: "After first fold",
                },
              ],
            },
          ]}
        />

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 font-inter">
            Logger Data:
          </h3>
          <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono">
            {JSON.stringify(allSteps, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default ProofingStepLogger;