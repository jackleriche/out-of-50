-- ---------------------------------------------------------------------------
-- Constraints Prisma can't express. Add as a raw migration after the initial
-- `prisma migrate dev`. These are the rules that must not live only in app code.
-- ---------------------------------------------------------------------------

-- 1. BJCP score ranges. A malformed sheet should never reach the database.
ALTER TABLE reviews
  ADD CONSTRAINT reviews_aroma_range      CHECK (aroma      BETWEEN 0 AND 12),
  ADD CONSTRAINT reviews_appearance_range CHECK (appearance BETWEEN 0 AND 3),
  ADD CONSTRAINT reviews_flavour_range    CHECK (flavour    BETWEEN 0 AND 20),
  ADD CONSTRAINT reviews_mouthfeel_range  CHECK (mouthfeel  BETWEEN 0 AND 5),
  ADD CONSTRAINT reviews_overall_range    CHECK (overall    BETWEEN 0 AND 10);

-- 2. True-to-style is an unscored 1–5 diagnostic.
ALTER TABLE reviews
  ADD CONSTRAINT reviews_tts_range CHECK (true_to_style IS NULL OR true_to_style BETWEEN 1 AND 5);

-- 3. Anonymity is immutable once a link exists. Reviewers are shown the promise
--    before they score; the brewer must not be able to flip it after reading.
CREATE OR REPLACE FUNCTION share_links_anonymous_is_immutable()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.anonymous IS DISTINCT FROM OLD.anonymous THEN
    RAISE EXCEPTION 'share_links.anonymous is immutable (link %). Create a new link instead.', OLD.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER share_links_anonymous_immutable
  BEFORE UPDATE ON share_links
  FOR EACH ROW EXECUTE FUNCTION share_links_anonymous_is_immutable();

-- 4. Blind mode is immutable too, for the same reason — a reviewer who guessed
--    the style did so under rules that can't be retro-applied to the others.
CREATE OR REPLACE FUNCTION share_links_blind_is_immutable()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."blindMode" IS DISTINCT FROM OLD."blindMode" THEN
    RAISE EXCEPTION 'share_links.blindMode is immutable (link %).', OLD.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER share_links_blind_immutable
  BEFORE UPDATE ON share_links
  FOR EACH ROW EXECUTE FUNCTION share_links_blind_is_immutable();

-- 5. One submitted scoresheet per invite. Drafts are allowed to be replaced.
CREATE UNIQUE INDEX reviews_one_submitted_per_invite
  ON reviews ("inviteId")
  WHERE "inviteId" IS NOT NULL AND status = 'submitted';

-- 6. Soft guard against a single device spamming an open link. Not security —
--    cookies are clearable — but it stops the honest accident of a double submit.
CREATE UNIQUE INDEX reviews_one_per_device_per_link
  ON reviews ("shareLinkId", "deviceId")
  WHERE "deviceId" IS NOT NULL AND status = 'submitted';

-- 7. Useful covering index for the results page aggregations.
CREATE INDEX reviews_beer_submitted_scored_at
  ON reviews ("beerId", "scoredAt")
  WHERE status = 'submitted';
