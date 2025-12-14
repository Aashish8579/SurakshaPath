// Service.ts
import { GoogleGenAI, Type } from "@google/genai";
import type { RouteData, TransportMode } from '../types';

// ✅ Access API key from Vite env
const apiKey = (import.meta as any).env.VITE_API_KEY;

if (!apiKey) {
    throw new Error("VITE_API_KEY environment variable not set");
}

// Initialize the AI client
const ai = new GoogleGenAI({ apiKey });

// Schema for latitude/longitude points
const pointSchema = {
    type: Type.OBJECT,
    properties: {
        lat: { type: Type.NUMBER, description: "Latitude" },
        lng: { type: Type.NUMBER, description: "Longitude" }
    },
    required: ["lat", "lng"]
};

// Schema for the route data returned by AI
const routeSchema = {
    type: Type.OBJECT,
    properties: {
        overview: { type: Type.STRING },
        path: { type: Type.ARRAY, items: pointSchema },
        steps: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    instruction: { type: Type.STRING },
                    distance: { type: Type.STRING }
                },
                required: ["instruction", "distance"]
            }
        },
        safetyPoints: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    location: pointSchema,
                    type: { type: Type.STRING, enum: ["police_presence", "well_lit", "low_crime_zone"] },
                    description: { type: Type.STRING },
                    historicalTrend: { type: Type.STRING, enum: ["Improving", "Stable", "Declining"] },
                    userReports: { type: Type.NUMBER }
                },
                required: ["location", "type", "description"]
            }
        },
        roadIssues: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    location: pointSchema,
                    type: { type: Type.STRING, enum: ["pothole", "damaged_road"] },
                    description: { type: Type.STRING },
                    severity: { type: Type.STRING, enum: ["low", "medium", "high"] }
                },
                required: ["location", "type", "description", "severity"]
            }
        },
        bounds: {
            type: Type.OBJECT,
            properties: {
                southWest: pointSchema,
                northEast: pointSchema
            },
            required: ["southWest", "northEast"]
        }
    },
    required: ["overview", "path", "steps", "safetyPoints", "roadIssues", "bounds"]
};

// Function to fetch the safest route
export const fetchSafeRoute = async (start: string, end: string, mode: TransportMode): Promise<RouteData> => {
    const systemInstruction = `
You are an expert route planning AI for India, specializing in user safety and road conditions.
Generate a route plan in JSON matching the schema, prioritizing safety (police presence, good lighting, low crime), and report road issues like potholes.
Include historical safety trends and simulated user-reported incidents.
`;

    const prompt = `Generate the safest route from "${start}" to "${end}" for a user who is ${mode}. Include safety points, historical context, and road conditions.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ type: "text", text: prompt }],
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: routeSchema
            },
        });

        const text = response.text?.trim();

        if (!text) {
            throw new Error("AI model returned empty response");
        }

        // Safely parse JSON
        try {
            return JSON.parse(text) as RouteData;
        } catch (parseError) {
            console.error("Failed to parse AI JSON response:", text);
            throw parseError;
        }

    } catch (error) {
        console.error("Error fetching route data:", error);
        throw new Error("Failed to generate route from AI model.");
    }
};
