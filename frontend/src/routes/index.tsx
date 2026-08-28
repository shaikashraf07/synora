import { createFileRoute } from "@tanstack/react-router";
import MediCareApp from "../components/MediCareApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediCareAI — Your health record. Your consent. Your safety." },
      {
        name: "description",
        content:
          "Patient-controlled health records, medication interaction checks and adherence alerts for care teams.",
      },
      { property: "og:title", content: "MediCareAI — Patient-controlled health records" },
      {
        property: "og:description",
        content:
          "Consent-based record sharing, medication safety checks and caregiver adherence alerts in one calm interface.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MediCareApp,
});
