'use server';

import { z } from 'zod';

const CourtInfoSchema = z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string().optional().default('N/A'),
    latitude: z.number(),
    longitude: z.number(),
});

type CourtInfo = z.infer<typeof CourtInfoSchema>;

export async function findCourt(zipCode: string, apiKey: string): Promise<CourtInfo | null> {
    const placesApiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=courthouse%20in%20${zipCode}&key=${apiKey}`;

    try {
        const placesResponse = await fetch(placesApiUrl);
        if (!placesResponse.ok) {
            console.error("Failed to fetch from Google Places API", await placesResponse.text());
            return null;
        }
        const placesData = await placesResponse.json();

        if (placesData.status !== 'OK' || !placesData.results || placesData.results.length === 0) {
            return null;
        }

        const topResult = placesData.results[0];
        const placeId = topResult.place_id;

        const detailsApiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,international_phone_number,geometry&key=${apiKey}`;
        
        const detailsResponse = await fetch(detailsApiUrl);
         if (!detailsResponse.ok) {
            console.error("Failed to fetch from Google Place Details API", await detailsResponse.text());
            return null;
        }
        const detailsData = await detailsResponse.json();

        if (detailsData.status !== 'OK' || !detailsData.result) {
            return null;
        }
        
        const courtDetails = detailsData.result;

        return CourtInfoSchema.parse({
            name: courtDetails.name,
            address: courtDetails.formatted_address,
            phone: courtDetails.international_phone_number,
            latitude: courtDetails.geometry.location.lat,
            longitude: courtDetails.geometry.location.lng,
        });

    } catch (error) {
        console.error("Error finding court:", error);
        return null;
    }
}
