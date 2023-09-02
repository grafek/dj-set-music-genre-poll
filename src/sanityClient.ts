import { createClient } from "@sanity/client";

const sanityClient = createClient({
  dataset: import.meta.env.VITE_SANITY_DATASET,
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION,
  useCdn: false,
});

export default sanityClient;
