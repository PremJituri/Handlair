DROP POLICY IF EXISTS hero_slides_public ON public.hero_slides;
REVOKE SELECT ON public.hero_slides FROM anon, authenticated;
DROP POLICY IF EXISTS categories_public ON public.categories;
CREATE POLICY categories_public ON public.categories FOR SELECT TO anon, authenticated USING (EXISTS (SELECT 1 FROM public.products p WHERE p.category_id = categories.id AND p.is_published));