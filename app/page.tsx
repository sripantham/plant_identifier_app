"use client";

import { useState } from "react";
import { Upload, Leaf, Sun, Droplets, Thermometer } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface PlantInfo {
  name: string;
  scientificName: string;
  description: string;
  careInstructions: string;
  details: {
    sunlight: string;
    watering: string;
    temperature: string;
    soil: string;
    humidity: string;
    growthRate: string;
    maxHeight: string;
    toxicity: string;
  };
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsAnalyzing(true);
      setError(null);

      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Initialize Gemini API
      const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);
      const model = genAI.getGenerativeModel({ model: process.env.NEXT_PUBLIC_GEMINI_API_MODEL as string });
      
      const imageBytes = await fileToGenerativePart(file);

      const result = await model.generateContent([
        "Please analyze this plant image and provide the following information in JSON format:\n" +
          "{\n" +
          "  name: string // common name\n" +
          "  scientificName: string\n" +
          "  description: string // detailed description\n" +
          "  careInstructions: string // comprehensive care guide\n" +
          "  details: {\n" +
          "    sunlight: string // light requirements\n" +
          "    watering: string // water needs\n" +
          "    temperature: string // ideal temperature range\n" +
          "    soil: string // soil preferences\n" +
          "    humidity: string // humidity requirements\n" +
          "    growthRate: string // slow/medium/fast\n" +
          "    maxHeight: string // maximum height\n" +
          "    toxicity: string // toxic to pets/humans?\n" +
          "  }\n" +
          "}\n" +
          "Return ONLY valid JSON without any additional text.",
        imageBytes,
      ]);

      const response = await result.response;

      try {
        const plantData = JSON.parse(response.text());
        setPlantInfo(plantData);
      } catch (parseError) {
        throw new Error("Failed to parse plant information from API response");
      }
    } catch (err) {
      console.error("Error details:", err);
      setError(
        err instanceof Error
          ? `Error: ${err.message}`
          : "Error analyzing image. Please try again.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  async function fileToGenerativePart(file: File) {
    const buffer = await file.arrayBuffer();
    return {
      inlineData: {
        data: Buffer.from(buffer).toString("base64"),
        mimeType: file.type,
      },
    };
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
      {/* Hero Section */}
      <div className="bg-green-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex items-center gap-4 mb-6">
            <Leaf size={40} />
            <h1 className="text-5xl font-bold">Plant Identifier</h1>
          </div>
          <p className="text-lg text-green-100 max-w-2xl">
            Upload a photo of any plant and instantly discover its identity,
            care requirements, and detailed information using advanced AI
            technology.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex flex-col items-center justify-center">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-green-800 mb-3">
                Identify Your Plant
              </h2>
              <p className="text-gray-600">
                Take or upload a clear photo of your plant to get started
              </p>
            </div>

            <label
              htmlFor="image-upload"
              className="relative cursor-pointer bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Upload size={20} />
              Upload Plant Image
              <input
                id="image-upload"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isAnalyzing}
              />
            </label>
            {isAnalyzing && (
              <div className="mt-4 text-green-600 animate-pulse flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                Analyzing your plant... Please wait...
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
              {error}
            </div>
          )}
        </div>

        {/* Results Section */}
        {selectedImage && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Display */}
              <div className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={selectedImage}
                    alt="Selected plant"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Plant Information */}
              {plantInfo && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-3xl font-bold text-green-800 mb-2">
                      {plantInfo.name}
                    </h2>
                    <p className="text-xl text-gray-600 italic mb-4">
                      {plantInfo.scientificName}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-green-700 mb-3">
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {plantInfo.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-green-700 mb-3">
                      Care Guide
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {plantInfo.careInstructions}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Detailed Information Table */}
            {plantInfo && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-green-700 mb-6">
                  Plant Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Sunlight */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Sun className="text-green-600" size={24} />
                      <h4 className="font-medium text-green-800">Sunlight</h4>
                    </div>
                    <p className="text-gray-700">
                      {plantInfo.details.sunlight}
                    </p>
                  </div>

                  {/* Watering */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Droplets className="text-green-600" size={24} />
                      <h4 className="font-medium text-green-800">Watering</h4>
                    </div>
                    <p className="text-gray-700">
                      {plantInfo.details.watering}
                    </p>
                  </div>

                  {/* Temperature */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Thermometer className="text-green-600" size={24} />
                      <h4 className="font-medium text-green-800">
                        Temperature
                      </h4>
                    </div>
                    <p className="text-gray-700">
                      {plantInfo.details.temperature}
                    </p>
                  </div>

                  {/* Soil */}
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Leaf className="text-green-600" size={24} />
                      <h4 className="font-medium text-green-800">Soil Type</h4>
                    </div>
                    <p className="text-gray-700">{plantInfo.details.soil}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <table className="min-w-full bg-white rounded-lg overflow-hidden">
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                          Humidity
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {plantInfo.details.humidity}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                          Growth Rate
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {plantInfo.details.growthRate}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                          Maximum Height
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {plantInfo.details.maxHeight}
                        </td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-medium text-gray-900 bg-gray-50">
                          Toxicity
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {plantInfo.details.toxicity}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Easy Upload
            </h3>
            <p className="text-gray-600">
              Simply upload a photo of any plant to get started
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Instant Results
            </h3>
            <p className="text-gray-600">
              Get detailed information about your plant in seconds
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sun className="text-green-600" size={24} />
            </div>
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Care Guide
            </h3>
            <p className="text-gray-600">
              Learn how to properly care for your plants
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
