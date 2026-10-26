REVOKE INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.hero_slides FROM anon, authenticated;
GRANT SELECT ON public.hero_slides TO anon, authenticated;
GRANT ALL ON public.hero_slides TO service_role;