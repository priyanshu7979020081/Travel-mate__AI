import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI client on server
const aiApiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: aiApiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

console.log(`[TravelMate AI] Server starting. Gemini API Key configured: ${Boolean(aiApiKey)}`);

// Fallback generator for offline/quota edge cases
function generateIntelligentFallbackTrip(params: {
  destination: string;
  startDate: string;
  endDate: string;
  budgetTier: string;
  targetBudgetUsd: number;
  travelers: string;
  pace: string;
  interests: string[];
  specialPreferences?: string;
}) {
  const start = new Date(params.startDate || '2026-11-01');
  const end = new Date(params.endDate || '2026-11-05');
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const calcDays = Math.max(1, Math.min(10, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1));
  const daysCount = isNaN(calcDays) ? 4 : calcDays;

  const dest = params.destination.trim() || 'Scenic Escape';
  const tier = params.budgetTier || 'moderate';
  const multiplier = tier === 'luxury' ? 2.2 : tier === 'budget' ? 0.6 : 1.0;
  const baseCostPerDay = 240 * multiplier;
  const totalCost = Math.round(baseCostPerDay * daysCount);

  const days = [];
  const primaryInterests = params.interests && params.interests.length > 0
    ? params.interests.join(', ')
    : 'Scenic exploration, culture, and dining';

  for (let d = 1; d <= daysCount; d++) {
    const dayDate = new Date(start);
    dayDate.setDate(dayDate.getDate() + (d - 1));
    const dateStr = dayDate.toISOString().split('T')[0];

    days.push({
      dayNumber: d,
      date: dateStr,
      theme: d === 1
        ? `Arrival & Atmospheric Center Orientation`
        : d === daysCount
        ? `Iconic Landmarks & Farewell Golden Hour`
        : `Cultural Treasures, Local Flavors & Scenic Wonders`,
      areaOrNeighborhood: `${dest} Historic Center & Scenic Quarter`,
      activities: [
        {
          id: `act-${d}-1`,
          timeSlot: 'Morning' as const,
          time: '09:00 AM',
          title: d === 1 ? `Historic Promenade & Heritage Square` : `Premier Iconic Landmark & Cultural Discovery`,
          category: 'culture' as const,
          description: `Immerse in the historic heart of ${dest}, taking in architecture, peaceful morning pedestrian streets, and historic significance.`,
          locationName: `${dest} Old Quarter`,
          estimatedDuration: '2 hours',
          estimatedCostUsd: Math.round(15 * multiplier),
          travelTip: 'Start early before midday tour groups arrive to savor tranquil photo opportunities.',
          recommendedHighlight: 'The historic central plaza with morning sun reflections.',
          completed: false,
        },
        {
          id: `act-${d}-2`,
          timeSlot: 'Morning' as const,
          time: '11:30 AM',
          title: `Artisanal Market Walk & Local Delicacy Sampling`,
          category: 'dining' as const,
          description: `Wander through local market stalls discovering regional spices, seasonal produce, and handcrafted snacks.`,
          locationName: `${dest} Central Covered Market`,
          estimatedDuration: '1.5 hours',
          estimatedCostUsd: Math.round(20 * multiplier),
          travelTip: 'Carry small local currency denominations for independent food vendors.',
          recommendedHighlight: 'Freshly baked local regional pastry and specialty roasted coffee.',
          completed: false,
        },
        {
          id: `act-${d}-3`,
          timeSlot: 'Afternoon' as const,
          time: '02:30 PM',
          title: `Scenic Botanical Gardens & Panoramic Viewpoint`,
          category: 'nature' as const,
          description: `Relax with expansive hilltop or waterside views showcasing the skyline and geographic splendor of ${dest}.`,
          locationName: `${dest} Belvedere Overlook`,
          estimatedDuration: '2 hours',
          estimatedCostUsd: Math.round(10 * multiplier),
          travelTip: 'A great resting spot; bring a light cardigan or sun protection.',
          recommendedHighlight: 'Panoramic vista across the entire horizon.',
          completed: false,
        },
        {
          id: `act-${d}-4`,
          timeSlot: 'Evening' as const,
          time: '06:30 PM',
          title: `Golden Hour Twilight Stroll & Riverside Dining`,
          category: 'leisure' as const,
          description: `Wander past illuminated historic bridges, boutique shops, and evening street artists enjoying the lively atmosphere.`,
          locationName: `${dest} Waterfront Promenade`,
          estimatedDuration: '1.5 hours',
          estimatedCostUsd: 0,
          travelTip: 'Book dinner reservations at least one day in advance during peak travel seasons.',
          recommendedHighlight: 'Watching twilight colors reflect across water surfaces.',
          completed: false,
        },
      ],
      diningHighlights: {
        breakfast: {
          name: `Cafe Aurora & Bakery`,
          type: 'Artisanal Cafe',
          specialty: 'Handcrafted pastries and single-origin roast coffee',
          priceRange: tier === 'luxury' ? '$20–$30' : tier === 'budget' ? '$6–$9' : '$10–$15',
          location: `${dest} Historic Center`,
        },
        lunch: {
          name: `Trattoria / Bistro du Marché`,
          type: 'Local Heritage Eatery',
          specialty: 'Signature regional set lunch with seasonal farm produce',
          priceRange: tier === 'luxury' ? '$45–$70' : tier === 'budget' ? '$12–$18' : '$22–$35',
          location: `Market District, ${dest}`,
        },
        dinner: {
          name: `La Terrazza Panorama`,
          type: 'Scenic Evening Restaurant',
          specialty: 'Wood-fired specialties, fresh catch, and regional vintage wine',
          priceRange: tier === 'luxury' ? '$95–$160' : tier === 'budget' ? '$18–$28' : '$40–$65',
          location: `Old Town Waterfront, ${dest}`,
        },
      },
    });
  }

  return {
    id: `trip-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tripTitle: `${daysCount}-Day Curated Journey in ${dest}`,
    destination: dest,
    startDate: params.startDate,
    endDate: params.endDate,
    durationDays: daysCount,
    travelers: params.travelers || 'couple',
    budgetTier: tier,
    targetBudgetUsd: params.targetBudgetUsd || totalCost,
    pace: params.pace || 'balanced',
    interests: params.interests || ['Culture', 'Dining', 'Scenic Walks'],
    specialPreferences: params.specialPreferences || '',
    seasonSummary: `Moderate seasonal temperatures, pleasant daytime walkability, and cool evenings.`,
    summary: `A personalized ${daysCount}-day itinerary crafted around ${primaryInterests}. Designed with a ${params.pace || 'balanced'} pace to balance must-see landmarks with authentic local neighborhood exploration.`,
    budget: {
      totalEstimatedUsd: totalCost,
      targetBudgetUsd: params.targetBudgetUsd || totalCost,
      budgetTier: tier,
      accommodationUsd: Math.round(totalCost * 0.44),
      mealsDiningUsd: Math.round(totalCost * 0.28),
      activitiesTicketsUsd: Math.round(totalCost * 0.14),
      localTransportUsd: Math.round(totalCost * 0.08),
      contingencyUsd: Math.round(totalCost * 0.06),
      moneySavingTips: [
        'Look into city tourist day passes which bundle public transit with major museum admissions.',
        'Opt for the set lunch (menu del día) at local restaurants for identical high quality at half evening prices.',
        'Fill reusable water bottles at certified public drinking fountains when available.',
      ],
    },
    tips: {
      localTransport: `Public transit (metro and light rail) along with walking is the fastest and most cost-effective way to get around ${dest}.`,
      etiquetteAndCulture: `Greeting shopkeepers upon entry is customary. Tipping policies depend on local service charges.`,
      bestTimeToVisit: `Shoulder seasons (spring and autumn) offer optimal weather with milder crowd volumes.`,
      safetyHealth: `Keep valuables close in busy tourist squares and carry a digital photocopy of your passport.`,
    },
    packingList: [
      {
        category: 'Essentials & Documents',
        items: [
          { id: 'f-1', name: 'Passport & government ID with photocopies', packed: true },
          { id: 'f-2', name: 'Travel medical insurance card', packed: false },
          { id: 'f-3', name: 'No-foreign-transaction-fee credit cards & modest cash', packed: true },
        ],
      },
      {
        category: 'Clothing & Comfort',
        items: [
          { id: 'f-4', name: 'Broken-in cushioned walking shoes', packed: true },
          { id: 'f-5', name: 'Light rainproof shell / windbreaker', packed: false },
          { id: 'f-6', name: 'Layerable knitwear and versatile daywear', packed: false },
        ],
      },
      {
        category: 'Electronics',
        items: [
          { id: 'f-7', name: 'Universal wall outlet power adapter', packed: true },
          { id: 'f-8', name: 'Portable battery power bank', packed: false },
          { id: 'f-9', name: 'High-speed charging cables', packed: true },
        ],
      },
    ],
  };
}

// POST /api/generate-itinerary
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      budgetTier = 'moderate',
      targetBudgetUsd = 1500,
      travelers = 'couple',
      pace = 'balanced',
      interests = ['Culture & Heritage', 'Foodie & Culinary'],
      specialPreferences = '',
    } = req.body;

    if (!destination) {
      return res.status(400).json({ error: 'Destination is required.' });
    }

    // Calculate duration in days
    const start = new Date(startDate || '2026-11-01');
    const end = new Date(endDate || '2026-11-05');
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const durationDays = Math.max(1, Math.min(8, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1)) || 4;

    if (!aiApiKey) {
      console.warn('[TravelMate AI] No GEMINI_API_KEY found, returning intelligent fallback trip.');
      const fallback = generateIntelligentFallbackTrip({
        destination,
        startDate: startDate || '2026-11-01',
        endDate: endDate || '2026-11-05',
        budgetTier,
        targetBudgetUsd: Number(targetBudgetUsd) || 1500,
        travelers,
        pace,
        interests,
        specialPreferences,
      });
      return res.json({ itinerary: fallback, source: 'curated_engine' });
    }

    const systemPrompt = `You are TravelMate AI, an elite, worldly travel concierge and itinerary planner.
Create a rich, realistic, culturally immersive day-by-day travel itinerary for "${destination}".
Trip specifications:
- Duration: exactly ${durationDays} days (from ${startDate} to ${endDate})
- Budget tier: ${budgetTier} (approx. $${targetBudgetUsd} USD target)
- Travelers type: ${travelers}
- Pace: ${pace}
- Selected Interests: ${interests.join(', ')}
${specialPreferences ? `- Specific Traveler Notes / Preferences: ${specialPreferences}` : ''}

CRITICAL RULES:
1. Provide REAL, authentic, geographically grouped attractions and dining spots in ${destination}.
2. For each day, create 3 to 4 distinct activities logically sequenced through Morning, Afternoon, Evening.
3. Every activity must have realistic estimated cost in USD, duration, helpful local insider tips, and recommended highlight.
4. Provide genuine dining recommendations for breakfast, lunch, and dinner each day.
5. Provide a realistic budget breakdown that approximates the $${targetBudgetUsd} USD target for ${durationDays} days.
6. Provide smart money saving tips, local transit tips, cultural etiquette tips, and seasonal expectations.
7. Provide a practical packing checklist categorized into Clothing, Electronics, Documents, and Essentials.
8. Output pure JSON matching the requested structure.`;

    const userPrompt = `Generate the complete ${durationDays}-day personalized itinerary for ${destination}. Return JSON strictly adhering to the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: userPrompt }],
        },
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tripTitle: { type: Type.STRING, description: 'Inspiring, editorial trip title' },
            destination: { type: Type.STRING },
            seasonSummary: { type: Type.STRING, description: 'Expected weather and atmospheric conditions' },
            summary: { type: Type.STRING, description: '2-3 sentences summarizing the journey' },
            budget: {
              type: Type.OBJECT,
              properties: {
                totalEstimatedUsd: { type: Type.NUMBER },
                targetBudgetUsd: { type: Type.NUMBER },
                budgetTier: { type: Type.STRING },
                accommodationUsd: { type: Type.NUMBER },
                mealsDiningUsd: { type: Type.NUMBER },
                activitiesTicketsUsd: { type: Type.NUMBER },
                localTransportUsd: { type: Type.NUMBER },
                contingencyUsd: { type: Type.NUMBER },
                moneySavingTips: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: [
                'totalEstimatedUsd',
                'targetBudgetUsd',
                'budgetTier',
                'accommodationUsd',
                'mealsDiningUsd',
                'activitiesTicketsUsd',
                'localTransportUsd',
                'contingencyUsd',
                'moneySavingTips',
              ],
            },
            days: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.INTEGER },
                  date: { type: Type.STRING },
                  theme: { type: Type.STRING },
                  areaOrNeighborhood: { type: Type.STRING },
                  activities: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        timeSlot: { type: Type.STRING },
                        time: { type: Type.STRING },
                        title: { type: Type.STRING },
                        category: { type: Type.STRING },
                        description: { type: Type.STRING },
                        locationName: { type: Type.STRING },
                        estimatedDuration: { type: Type.STRING },
                        estimatedCostUsd: { type: Type.NUMBER },
                        travelTip: { type: Type.STRING },
                        recommendedHighlight: { type: Type.STRING },
                      },
                      required: [
                        'id',
                        'timeSlot',
                        'time',
                        'title',
                        'category',
                        'description',
                        'locationName',
                        'estimatedDuration',
                        'estimatedCostUsd',
                        'travelTip',
                        'recommendedHighlight',
                      ],
                    },
                  },
                  diningHighlights: {
                    type: Type.OBJECT,
                    properties: {
                      breakfast: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          type: { type: Type.STRING },
                          specialty: { type: Type.STRING },
                          priceRange: { type: Type.STRING },
                        },
                        required: ['name', 'type', 'specialty', 'priceRange'],
                      },
                      lunch: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          type: { type: Type.STRING },
                          specialty: { type: Type.STRING },
                          priceRange: { type: Type.STRING },
                        },
                        required: ['name', 'type', 'specialty', 'priceRange'],
                      },
                      dinner: {
                        type: Type.OBJECT,
                        properties: {
                          name: { type: Type.STRING },
                          type: { type: Type.STRING },
                          specialty: { type: Type.STRING },
                          priceRange: { type: Type.STRING },
                        },
                        required: ['name', 'type', 'specialty', 'priceRange'],
                      },
                    },
                    required: ['breakfast', 'lunch', 'dinner'],
                  },
                },
                required: ['dayNumber', 'date', 'theme', 'areaOrNeighborhood', 'activities', 'diningHighlights'],
              },
            },
            tips: {
              type: Type.OBJECT,
              properties: {
                localTransport: { type: Type.STRING },
                etiquetteAndCulture: { type: Type.STRING },
                bestTimeToVisit: { type: Type.STRING },
                safetyHealth: { type: Type.STRING },
              },
              required: ['localTransport', 'etiquetteAndCulture', 'bestTimeToVisit', 'safetyHealth'],
            },
            packingList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING },
                  items: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        name: { type: Type.STRING },
                        packed: { type: Type.BOOLEAN },
                      },
                      required: ['id', 'name', 'packed'],
                    },
                  },
                },
                required: ['category', 'items'],
              },
            },
          },
          required: ['tripTitle', 'destination', 'seasonSummary', 'summary', 'budget', 'days', 'tips', 'packingList'],
        },
      },
    });

    const textOutput = response.text || '';
    let parsedData: any;
    try {
      parsedData = JSON.parse(textOutput);
    } catch (parseErr) {
      console.error('[TravelMate AI] JSON parse error from Gemini output:', parseErr, textOutput);
      parsedData = generateIntelligentFallbackTrip({
        destination,
        startDate,
        endDate,
        budgetTier,
        targetBudgetUsd: Number(targetBudgetUsd) || 1500,
        travelers,
        pace,
        interests,
        specialPreferences,
      });
      return res.json({ itinerary: parsedData, source: 'fallback_parse_error' });
    }

    // Construct final trip object
    const finalTrip = {
      id: `trip-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tripTitle: parsedData.tripTitle || `${durationDays}-Day Trip to ${destination}`,
      destination: parsedData.destination || destination,
      startDate: startDate || '2026-11-01',
      endDate: endDate || '2026-11-05',
      durationDays,
      travelers,
      budgetTier,
      targetBudgetUsd: Number(targetBudgetUsd) || 1500,
      pace,
      interests,
      specialPreferences,
      seasonSummary: parsedData.seasonSummary || 'Mild and pleasant conditions',
      summary: parsedData.summary || '',
      budget: parsedData.budget,
      days: (parsedData.days || []).map((day: any, idx: number) => ({
        ...day,
        dayNumber: day.dayNumber || idx + 1,
        activities: (day.activities || []).map((act: any, aIdx: number) => ({
          ...act,
          id: act.id || `act-${idx + 1}-${aIdx + 1}-${Date.now()}`,
          completed: false,
        })),
      })),
      tips: parsedData.tips,
      packingList: (parsedData.packingList || []).map((cat: any, cIdx: number) => ({
        ...cat,
        items: (cat.items || []).map((it: any, iIdx: number) => ({
          ...it,
          id: it.id || `pack-${cIdx}-${iIdx}`,
          packed: Boolean(it.packed),
        })),
      })),
    };

    return res.json({ itinerary: finalTrip, source: 'gemini' });
  } catch (err: any) {
    console.error('[TravelMate AI] Itinerary Generation Error:', err);
    // Graceful fallback to avoid leaving user hanging
    const fallback = generateIntelligentFallbackTrip({
      destination: req.body?.destination || 'Scenic Escape',
      startDate: req.body?.startDate || '2026-11-01',
      endDate: req.body?.endDate || '2026-11-05',
      budgetTier: req.body?.budgetTier || 'moderate',
      targetBudgetUsd: Number(req.body?.targetBudgetUsd) || 1500,
      travelers: req.body?.travelers || 'couple',
      pace: req.body?.pace || 'balanced',
      interests: req.body?.interests || ['Culture', 'Dining'],
      specialPreferences: req.body?.specialPreferences || '',
    });
    return res.json({
      itinerary: fallback,
      source: 'fallback_error',
      message: err.message || 'Generated via high-fidelity curated planner.',
    });
  }
});

// POST /api/custom-recommendation: suggest alternative activities / dining
app.post('/api/custom-recommendation', async (req, res) => {
  try {
    const {
      destination,
      dayTheme,
      category = 'attraction',
      requestType = 'alternative',
      existingActivityTitle = '',
      budgetTier = 'moderate',
    } = req.body;

    if (!aiApiKey) {
      return res.json({
        recommendations: [
          {
            title: `Hidden Rooftop Terrace Overlook`,
            category: 'leisure',
            timeSlot: 'Afternoon',
            locationName: `${destination || 'City'} Historic Quarter`,
            description: `A peaceful hidden vantage point offering panoramic city views with local refreshments away from tour groups.`,
            estimatedDuration: '1.5 hours',
            estimatedCostUsd: 12,
            travelTip: 'Arrive around golden hour for breathtaking light.',
            recommendedHighlight: '360-degree sunset horizon view',
          },
          {
            title: `Local Artisan Workshop & Gallery`,
            category: 'culture',
            timeSlot: 'Morning',
            locationName: `${destination || 'City'} Crafts Guild`,
            description: `Meet regional master craftsmen practicing traditional glassblowing, ceramics, or textile weaving.`,
            estimatedDuration: '1.5 hours',
            estimatedCostUsd: 8,
            travelTip: 'Pick up an authentic locally made souvenir here instead of tourist gift shops.',
            recommendedHighlight: 'Live demonstration by master artisans',
          },
          {
            title: `Authentic Neighborhood Osteria / Tavern`,
            category: 'dining',
            timeSlot: 'Evening',
            locationName: `${destination || 'City'} Backstreet District`,
            description: `Beloved family-run tavern serving homemade traditional recipes handed down for generations.`,
            estimatedDuration: '2 hours',
            estimatedCostUsd: 25,
            travelTip: 'Ask the waiter for the chalkboard daily special.',
            recommendedHighlight: 'House-special braised seasonal plate',
          },
        ],
      });
    }

    const prompt = `For a trip to "${destination}", suggest 3 exciting, authentic alternatives or additions.
Context:
- Day Theme: ${dayTheme || 'General exploration'}
- Category needed: ${category}
- Request Type: ${requestType} (e.g., replacement for "${existingActivityTitle}" or new hidden gem)
- Budget Tier: ${budgetTier}

Return 3 specific, real places in ${destination}.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              timeSlot: { type: Type.STRING },
              locationName: { type: Type.STRING },
              description: { type: Type.STRING },
              estimatedDuration: { type: Type.STRING },
              estimatedCostUsd: { type: Type.NUMBER },
              travelTip: { type: Type.STRING },
              recommendedHighlight: { type: Type.STRING },
            },
            required: [
              'title',
              'category',
              'timeSlot',
              'locationName',
              'description',
              'estimatedDuration',
              'estimatedCostUsd',
              'travelTip',
              'recommendedHighlight',
            ],
          },
        },
      },
    });

    const recs = JSON.parse(response.text || '[]');
    return res.json({ recommendations: recs });
  } catch (err: any) {
    console.error('[TravelMate AI] Recommendation error:', err);
    return res.json({
      recommendations: [
        {
          title: `Hidden Rooftop Terrace Overlook`,
          category: 'leisure',
          timeSlot: 'Afternoon',
          locationName: `${req.body?.destination || 'Historic'} Panoramic Terrace`,
          description: `A peaceful hidden vantage point offering panoramic city views with local refreshments away from tour groups.`,
          estimatedDuration: '1.5 hours',
          estimatedCostUsd: 12,
          travelTip: 'Arrive around golden hour for breathtaking light.',
          recommendedHighlight: '360-degree sunset horizon view',
        },
        {
          title: `Local Artisan Workshop & Studio`,
          category: 'culture',
          timeSlot: 'Morning',
          locationName: `${req.body?.destination || 'Artisans'} Guild Hall`,
          description: `Meet regional master craftsmen practicing traditional glassblowing, ceramics, or textile weaving.`,
          estimatedDuration: '1.5 hours',
          estimatedCostUsd: 8,
          travelTip: 'Pick up an authentic locally made souvenir here instead of tourist gift shops.',
          recommendedHighlight: 'Live demonstration by master artisans',
        },
        {
          title: `Authentic Neighborhood Osteria / Tavern`,
          category: 'dining',
          timeSlot: 'Evening',
          locationName: `${req.body?.destination || 'Old Town'} Historic Alley`,
          description: `Beloved family-run tavern serving homemade traditional recipes handed down for generations.`,
          estimatedDuration: '2 hours',
          estimatedCostUsd: 25,
          travelTip: 'Ask the waiter for the chalkboard daily special.',
          recommendedHighlight: 'House-special braised seasonal plate',
        },
      ],
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Vite middleware for dev or static serving for prod
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[TravelMate AI] Dev Server listening at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[TravelMate AI] Failed to start server:', err);
});
