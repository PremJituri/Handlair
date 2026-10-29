CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL CHECK (char_length(first_name) BETWEEN 2 AND 100),
  last_name text NOT NULL DEFAULT '' CHECK (char_length(last_name) <= 100),
  company text NOT NULL DEFAULT '' CHECK (char_length(company) <= 150),
  email text NOT NULL CHECK (char_length(email) <= 255),
  mobile text NOT NULL CHECK (char_length(mobile) BETWEEN 7 AND 30),
  city text NOT NULL DEFAULT '' CHECK (char_length(city) <= 100),
  country text NOT NULL DEFAULT '' CHECK (char_length(country) <= 100),
  message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 5000),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE INDEX enquiries_created_at_idx ON public.enquiries (created_at DESC);