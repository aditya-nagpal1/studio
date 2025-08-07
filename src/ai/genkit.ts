import {genkit, Plugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {googleCloud} from '@genkit-ai/google-cloud';

const googleAIToolkit = googleAI({
    // You can specify your API key here, or leave it blank and set the
    // GOOGLE_API_KEY or GCLOUD_API_KEY environment variable.
    // apiKey: '...',
});

export const ai = genkit({
  plugins: [googleAIToolkit, googleCloud()],
  model: 'googleai/gemini-2.0-flash',
});
