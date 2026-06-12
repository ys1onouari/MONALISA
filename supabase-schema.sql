-- =====================================
-- 1. Tables
-- =====================================

CREATE TABLE categories (
  id        BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name      TEXT NOT NULL UNIQUE,
  icon_svg  TEXT DEFAULT '',
  sort_order INT DEFAULT 0
);

CREATE TABLE menu_items (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT NOT NULL,
  price       NUMERIC(6,1) NOT NULL,
  description TEXT DEFAULT '',
  tags        TEXT[] DEFAULT '{}',
  available   BOOLEAN DEFAULT TRUE,
  popular     BOOLEAN DEFAULT FALSE,
  image_url   TEXT DEFAULT ''
);

CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

-- =====================================
-- 2. Storage bucket
-- =====================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('dish-images', 'dish-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Allow public read
CREATE POLICY "Public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'dish-images');

-- Allow authenticated users to upload
CREATE POLICY "Auth upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'dish-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Auth delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'dish-images' AND auth.role() = 'authenticated');

-- =====================================
-- 3. Row Level Security
-- =====================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings   ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read" ON categories FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON menu_items  FOR SELECT USING (TRUE);
CREATE POLICY "Public read" ON settings   FOR SELECT USING (TRUE);

-- Admin write (authenticated)
CREATE POLICY "Auth write" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth write" ON menu_items
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON menu_items
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON menu_items
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Auth write" ON settings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON settings
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth write" ON settings
  FOR DELETE USING (auth.role() = 'authenticated');

-- =====================================
-- 4. Seed data
-- =====================================

INSERT INTO categories (name, icon_svg, sort_order) VALUES
  ('Entrées',         '<svg viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>', 1),
  ('Salades',         '<svg viewBox="0 0 24 24"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M8 12h8"/><path d="M12 8v8"/></svg>', 2),
  ('Plats Principaux','<svg viewBox="0 0 24 24"><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7"/><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"/><line x1="12" y1="5" x2="12" y2="19"/></svg>', 3),
  ('Fruits de Mer',   '<svg viewBox="0 0 24 24"><path d="M2 16s3-7 10-7 10 7 10 7"/><circle cx="12" cy="9" r="3"/><path d="M12 12v10"/><path d="M8 22h8"/></svg>', 4),
  ('Grillades',       '<svg viewBox="0 0 24 24"><path d="M12 2v4"/><path d="M8 6h8"/><path d="M6 10c0-3 2.7-5 6-5s6 2 6 5"/><path d="M7 22l2-6h6l2 6"/><path d="M12 16v6"/><path d="M10 10v2"/><path d="M14 10v2"/></svg>', 5),
  ('Desserts',        '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 0 0-10 10h20A10 10 0 0 0 12 2z"/><path d="M5 14c2 4 5 6 7 6s5-2 7-6"/><path d="M8 9h8"/></svg>', 6),
  ('Boissons',        '<svg viewBox="0 0 24 24"><path d="M18 8h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-1.5"/><path d="M6 2L4 18c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4L18 2"/><path d="M12 22v-8"/><path d="M8 10h8"/></svg>', 7);

INSERT INTO menu_items (name, category, price, description, available, popular) VALUES
  ('Tartre de Thon',            'Entrées',          18, 'Thon frais à l''avocat, sauce yuzu et sésame torréfié.',                                                                                    TRUE,  TRUE),
  ('Foie Gras Maison',           'Entrées',          24, 'Foie gras de canard mi-cuit, chutney de figues et brioche toastée.',                                                                       TRUE,  FALSE),
  ('Velouté de Homard',          'Entrées',          19, 'Crème de homard au cognac, quenelle de mascarpone et ciboulette.',                                                                            TRUE,  FALSE),
  ('Saint-Jacques Poêlées',      'Entrées',          22, 'Noix de Saint-Jacques, purée de chou-fleur et huile de truffe blanche.',                                                                     TRUE,  TRUE),
  ('Salade Burrata',             'Salades',          16, 'Burrata crémeuse, tomates heritage, basilic et huile d''olive extra-vierge.',                                                                    TRUE,  FALSE),
  ('César Royal',                'Salades',          17, 'Romaine croquante, parmesan affiné, anchois et croûtons dorés.',                                                                              TRUE,  TRUE),
  ('Salade Niçoise Gastronomique', 'Salades',        19, 'Thon mi-cuit, œuf mollet, olives taggiasche et vinaigrette aux herbes.',                                                                      TRUE,  FALSE),
  ('Wagyu Beef Steak',           'Plats Principaux', 49, 'Wagyu japonais grillé à la perfection, sauce truffe noire, légumes de saison.',                                                                TRUE,  TRUE),
  ('Agneau Rôti aux Herbes',     'Plats Principaux', 38, 'Carré d''agneau en croûte de pistache, jus de viande réduit au thym.',                                                                         TRUE,  FALSE),
  ('Canard à l''Orange Moderne', 'Plats Principaux', 36, 'Magret de canard confit, émulsion à l''orange sanguine, patate douce rôtie.',                                                                   TRUE,  FALSE),
  ('Filet de Bœuf Wellington',   'Plats Principaux', 54, 'Filet de bœuf enrobé de duxelles aux champignons, feuilletage doré.',                                                                        TRUE,  TRUE),
  ('Homard Breton',              'Fruits de Mer',    72, 'Demi-homard breton grillé au beurre à la fleur de sel, mayonnaise citronnée.',                                                                 TRUE,  TRUE),
  ('Sole Meunière',              'Fruits de Mer',    42, 'Sole entière sautée au beurre noisette, câpres et citron confit.',                                                                             TRUE,  FALSE),
  ('Crevettes Royales Flambées', 'Fruits de Mer',    35, 'Grosses crevettes flambées au pastis, ail et persillade provençale.',                                                                          TRUE,  FALSE),
  ('Plateau de Fruits de Mer',   'Fruits de Mer',    95, 'Sélection du marché : huîtres, langoustines, crevettes, palourdes.',                                                                          FALSE, FALSE),
  ('Entrecôte Maturée 45j',      'Grillades',        46, 'Entrecôte maturée 45 jours, sauce béarnaise, frites maison et salade.',                                                                      TRUE,  TRUE),
  ('Côtelettes d''Agneau',       'Grillades',        44, 'Double côtelette d''agneau marinée au romarin, légumes grillés.',                                                                             TRUE,  FALSE),
  ('Mixed Grill Luxora',         'Grillades',        58, 'Sélection de viandes grillées : bœuf, agneau, poulet, merguez maison.',                                                                     TRUE,  TRUE),
  ('Fondant au Chocolat',        'Desserts',         12, 'Coulant au chocolat Valrhona 70%, glace vanille bourbon et caramel beurre salé.',                                                              TRUE,  TRUE),
  ('Crème Brûlée à la Rose',     'Desserts',         11, 'Crème brûlée infusée à l''eau de rose, sucre caramélisé à la torche.',                                                                        TRUE,  FALSE),
  ('Mille-Feuille Revisité',     'Desserts',         14, 'Feuilletage croustillant, crème diplomate à la vanille de Madagascar.',                                                                       TRUE,  FALSE),
  ('Sorbets Maison',             'Desserts',          9, 'Trilogie de sorbets faits maison : mangue, framboise, passion.',                                                                              TRUE,  FALSE),
  ('Jus de Fruits Pressés',      'Boissons',          7, 'Orange, citron ou grenadine — pressés à la commande.',                                                                                       TRUE,  FALSE),
  ('Eau Minérale Premium',       'Boissons',          5, 'Eau plate ou pétillante, Evian ou San Pellegrino.',                                                                                         TRUE,  FALSE),
  ('Cocktail Sans Alcool',       'Boissons',         10, 'Création du bartender : mocktail fruité aux herbes fraîches du jardin.',                                                                     TRUE,  TRUE),
  ('Thé à la Menthe Royale',     'Boissons',          6, 'Thé vert infusé à la menthe fraîche, servi dans notre théière en argent.',                                                                    TRUE,  FALSE);

INSERT INTO settings (key, value) VALUES
  ('restaurant_name',     'LUXORA'),
  ('restaurant_subtitle', 'Restaurant Gastronomique'),
  ('address',             'Av. Mohammed VI, Marrakech 40000, Maroc'),
  ('hours',               'Lun–Dim 19h–00h<br/>Bar & Lounge 18h–02h'),
  ('phone',               '+212 524 43 21 00'),
  ('phone_raw',           '+212524432100'),
  ('email',               'contact@luxora.ma'),
  ('instagram',           '@luxora.marrakech'),
  ('wa_number',           '212661234567');
