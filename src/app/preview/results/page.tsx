import { BrewerResults } from "@/components/templates/BrewerResults";
import {
  DEMO_BEER, DEMO_REVIEWS, DEMO_HISTORY, DEMO_TALLY, DEMO_FAULT_CARDS, DEMO_SUMMARY,
} from "@/fixtures/demo";

export default async function PreviewResults({
  searchParams,
}: {
  searchParams: Promise<{ few?: string; first?: string }>;
}) {
  const sp = await searchParams;
  const reviews = sp.few === "1" ? DEMO_REVIEWS.slice(0, 2) : DEMO_REVIEWS;

  return (
    <BrewerResults
      beer={{
        name: DEMO_BEER.name,
        style: `${DEMO_BEER.style.id} — ${DEMO_BEER.style.name}`,
        abv: DEMO_BEER.abv,
        batch: DEMO_BEER.batch,
      }}
      reviews={reviews}
      history={sp.first === "1" ? null : DEMO_HISTORY}
      descriptors={DEMO_TALLY}
      faults={sp.few === "1" ? [] : DEMO_FAULT_CARDS}
      summary={sp.few === "1" ? null : DEMO_SUMMARY}
    />
  );
}
