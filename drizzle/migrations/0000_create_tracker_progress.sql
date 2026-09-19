CREATE TABLE public.tracker_progress (
  region TEXT PRIMARY KEY,
  started BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracker_progress TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tracker_progress TO authenticated;
GRANT ALL ON public.tracker_progress TO service_role;

ALTER TABLE public.tracker_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read tracker progress"
  ON public.tracker_progress FOR SELECT USING (true);
CREATE POLICY "Anyone can insert tracker progress"
  ON public.tracker_progress FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update tracker progress"
  ON public.tracker_progress FOR UPDATE USING (true) WITH CHECK (true);
