CREATE TABLE public.hero_slides (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), image_url text NOT NULL, alt_text text NOT NULL DEFAULT 'Handlair industrial air handling installation', sort_order integer NOT NULL DEFAULT 0, created_at timestamptz NOT NULL DEFAULT now());
GRANT SELECT ON public.hero_slides TO anon, authenticated;
GRANT ALL ON public.hero_slides TO service_role;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
CREATE POLICY hero_slides_public ON public.hero_slides FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX hero_slides_order_idx ON public.hero_slides(sort_order,created_at);
INSERT INTO public.hero_slides(image_url,alt_text,sort_order) SELECT image_url,alt_text,sort_order FROM (VALUES
('/__l5e/assets-v1/fe56d628-2fee-406c-a721-3243915a6c1a/Bag_Filter_Dust_Collectors-2.jpg','Blue bag filter dust collector',0),
('/__l5e/assets-v1/1aca71a2-88b7-4483-8f1a-70a40b93cc0a/Bag_Filter_Dust_Collectors_9.jpg','Green dust collector installed beside an industrial building',1),
('/__l5e/assets-v1/fc909cd1-aa4d-4de4-8aae-770fd2b14f89/Cyclone_Dust_Collectors-2.jpg','Blue cyclone dust collector with ductwork',2),
('/__l5e/assets-v1/1e5d714b-d70a-4ea0-b179-b314b69e1e22/IMG-20261013-WA0014-2.jpg','Blue centrifugal blower',3),
('/__l5e/assets-v1/91830500-f7d4-4fd7-91a0-1745176e2642/IMG-20261022-WA0035.jpg','Centrifugal blower and exhaust duct installation',4),
('/__l5e/assets-v1/bc44a439-0ea3-492e-b60b-041fdee0b2c8/IMG-20261022-WA0043.jpg','Industrial air handling installation inside a factory',5),
('/__l5e/assets-v1/ed20949a-886c-4ee4-833f-4ab7539d774c/Bag_Filter_Dust_Collectors_2.jpg','Green bag filter dust collector',6),
('/__l5e/assets-v1/9d60b2fb-8624-4544-8a72-0c66bef6bcbb/Bag_Filter_Dust_Collectors_3.jpg','Tall blue bag filter dust collector',7),
('/__l5e/assets-v1/c7f976dd-3752-4ecf-91f3-8c6ebde0302d/Bag_Filter_Dust_Collectors_5.jpg','Green dust collector with access ladder and platform',8),
('/__l5e/assets-v1/319082ab-73d5-4e9d-b37e-27852638ad4b/Bag_Filter_Dust_Collectors_8.jpg','Outdoor dust collection equipment and ductwork',9)
) AS seed(image_url,alt_text,sort_order);
CREATE FUNCTION public.append_hero_slide(photo_url text, photo_alt text) RETURNS public.hero_slides LANGUAGE plpgsql SET search_path = public AS $$ DECLARE added public.hero_slides; BEGIN PERFORM pg_advisory_xact_lock(7349201); INSERT INTO public.hero_slides(image_url,alt_text,sort_order) VALUES(photo_url,photo_alt,COALESCE((SELECT MAX(sort_order)+1 FROM public.hero_slides),0)) RETURNING * INTO added; RETURN added; END; $$;
CREATE FUNCTION public.reorder_hero_slides(ordered_ids uuid[]) RETURNS void LANGUAGE plpgsql SET search_path = public AS $$ BEGIN PERFORM pg_advisory_xact_lock(7349201); IF cardinality(ordered_ids) <> (SELECT count(*) FROM public.hero_slides) OR (SELECT count(DISTINCT id) FROM unnest(ordered_ids) id) <> cardinality(ordered_ids) OR EXISTS(SELECT 1 FROM unnest(ordered_ids) id WHERE NOT EXISTS(SELECT 1 FROM public.hero_slides h WHERE h.id=id)) THEN RAISE EXCEPTION 'Photo list changed. Refresh and try again.'; END IF; UPDATE public.hero_slides h SET sort_order = o.ordinality - 1 FROM unnest(ordered_ids) WITH ORDINALITY o(id,ordinality) WHERE h.id=o.id; END; $$;
CREATE FUNCTION public.remove_hero_slide(slide_id uuid) RETURNS text LANGUAGE plpgsql SET search_path = public AS $$ DECLARE photo_url text; BEGIN PERFORM pg_advisory_xact_lock(7349201); IF (SELECT count(*) FROM public.hero_slides) <= 1 THEN RAISE EXCEPTION 'Cannot delete the last photo. Minimum 1 photo required.'; END IF; DELETE FROM public.hero_slides WHERE id=slide_id RETURNING image_url INTO photo_url; IF photo_url IS NULL THEN RAISE EXCEPTION 'Photo not found.'; END IF; RETURN photo_url; END; $$;
REVOKE ALL ON FUNCTION public.append_hero_slide(text,text), public.reorder_hero_slides(uuid[]), public.remove_hero_slide(uuid) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.append_hero_slide(text,text), public.reorder_hero_slides(uuid[]), public.remove_hero_slide(uuid) TO service_role;
CREATE POLICY hero_storage_read ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id='product-images' AND EXISTS(SELECT 1 FROM public.hero_slides h WHERE h.image_url='/api/public/hero-photo/' || storage.objects.name));