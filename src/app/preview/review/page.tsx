import { PreviewReviewClient } from "./PreviewReviewClient";

export default async function PreviewReview({
  searchParams,
}: {
  searchParams: Promise<{ blind?: string; anon?: string }>;
}) {
  const sp = await searchParams;
  return <PreviewReviewClient blind={sp.blind === "1"} anonymous={sp.anon === "1"} />;
}
