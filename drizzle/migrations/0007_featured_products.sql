CREATE TABLE public.featured_products (
  slot_number INT PRIMARY KEY CHECK (slot_number BETWEEN 1 AND 6),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.featured_products TO anon, authenticated;
GRANT ALL ON public.featured_products TO service_role;
ALTER TABLE public.featured_products ENABLE ROW LEVEL SECURITY;
CREATE POLICY featured_public ON public.featured_products FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.products p WHERE p.id = featured_products.product_id AND p.is_published));
INSERT INTO public.featured_products (slot_number, product_id)
SELECT s.n, p.id FROM (VALUES (1,'centrifugal-blowers'),(2,'axial-flow-fans'),(3,'air-cooling-units'),(4,'bag-filter-dust-collectors'),(5,'cyclone-dust-collectors'),(6,'wet-scrubbers')) AS s(n, slug)
JOIN public.products p ON p.slug = s.slug
ON CONFLICT (slot_number) DO NOTHING;