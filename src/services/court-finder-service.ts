'use server';

import { z } from 'zod';

const CourtInfoSchema = z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    latitude: z.number(),
    longitude: z.number(),
});

type CourtInfo = z.infer<typeof CourtInfoSchema>;

const MOCK_COURTS: Record<string, CourtInfo> = {
  "90210": { name: "Beverly Hills Courthouse", address: "9355 Burton Way, Beverly Hills, CA 90210", phone: "(310) 281-2499", latitude: 34.0689, longitude: -118.4039 },
  "10001": { name: "New York County Civil Court", address: "111 Centre Street, New York, NY 10013", phone: "(646) 386-5700", latitude: 40.7143, longitude: -74.0022 },
  "60611": { name: "Richard J. Daley Center", address: "50 W Washington St, Chicago, IL 60602", phone: "(312) 603-5030", latitude: 41.8837, longitude: -87.6304 },
  "33131": { name: "Miami-Dade County Courthouse", address: "73 W Flagler St, Miami, FL 33130", phone: "(305) 275-1155", latitude: 25.7743, longitude: -80.1937 },
  "77002": { name: "Harris County Civil Courthouse", address: "201 Caroline St, Houston, TX 77002", phone: "(713) 755-6758", latitude: 29.7589, longitude: -95.3678 },
  "94102": { name: "San Francisco Superior Court", address: "400 McAllister St, San Francisco, CA 94102", phone: "(415) 551-4000", latitude: 37.7806, longitude: -122.4194 },
  "02108": { name: "Suffolk Superior Courthouse", address: "3 Pemberton Square, Boston, MA 02108", phone: "(617) 788-8400", latitude: 42.3584, longitude: -71.0598 },
  "98104": { name: "King County Superior Court", address: "516 3rd Ave, Seattle, WA 98104", phone: "(206) 296-9300", latitude: 47.6032, longitude: -122.3301 },
  "80202": { name: "Denver County Court", address: "1437 Bannock St, Denver, CO 80202", phone: "(720) 865-7800", latitude: 39.7392, longitude: -104.9903 },
  "20001": { name: "Superior Court of D.C.", address: "500 Indiana Ave NW, Washington, DC 20001", phone: "(202) 879-1010", latitude: 38.8977, longitude: -77.0264 },
};

export async function findCourt(zipCode: string): Promise<CourtInfo | null> {
    // In a real application, you would use an API like the Google Places API
    // to find the courthouse. For this example, we'll use a mock database.
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    const court = MOCK_COURTS[zipCode];
    if (court) {
        return CourtInfoSchema.parse(court);
    }
    return null;
}
