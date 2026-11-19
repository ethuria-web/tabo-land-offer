CREATE TABLE public.offer_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 name text NOT NULL,
 phone text NOT NULL,
 locations text[] NOT NULL DEFAULT '{}',
 request_key uuid NOT NULL UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.offer_requests TO service_role;
ALTER TABLE public.offer_requests ENABLE ROW LEVEL SECURITY;
CREATE INDEX offer_requests_created_at_idx ON public.offer_requests(created_at DESC);