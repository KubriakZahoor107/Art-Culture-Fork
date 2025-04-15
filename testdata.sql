ALTER DATABASE your_database_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- Cleanup existing test data
DELETE FROM ArtTerm
WHERE id < 100;

-- Delete museums
DELETE FROM user
WHERE id >= 100
  AND id < 200;

-- Delete paintings
DELETE FROM ProductImage
WHERE productId >= 100
  AND productId < 200;
DELETE FROM Product
WHERE id >= 100
  AND id < 200;

-- Delete painters
DELETE FROM user
WHERE id >= 200
  AND id < 1200;

-- Insert painters
INSERT INTO user(
    id,
    email,
    `password`,
    `role`,
    images,
    title,
    bio,
    createdAt,
    updatedAt
  )
VALUES (
    200,
    'artists200@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/200.png',
    'Kateryna Bilokur',
    'Drawing inspiration from folk song lyrics, fairy tales, and legends, Bilokur skillfully recreated the enchanting realm of folk art, seamlessly integrating it into her perspective',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    201,
    'artists201@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/201.png',
    'Tetiana Yablonska',
    'One of the most famous Ukrainian artists of the 20th century. She has studied at the Kyiv Art Institute, her mentor was the famous Ukrainian artist Fedir Krychevskyi.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    202,
    'artists202@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/202.png',
    'Maria Prymachenko',
    'Maria Prymachenko was a Ukrainian village folk art painter, representative of naïve art. The artist was involved with drawing, embroidery and painting on ceramics.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    203,
    'artists203@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    NULL,
    'Ааронський Федір Іванович',
    'Фе́дір Іва́нович Ааро́нський (близько 1742, Хитці Синецькі — 24 серпня 1825, Київ) — український живописець, фініфтяр, іконописець. У чернецтві (від 1802 року) — Феодосій.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    204,
    'artists204@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/204.jpg',
    'Абрамов Віктор Прокопович',
    'Ві́ктор Проко́пович Абра́мов (*4 вересня 1940, Львів — †7 травня 2016, Вінниця) — український живописець, графік. Член Національної спілки художників України з 1993 року.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    205,
    'artists205@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/205.jpg',
    'Абрисовський Савин Йосипович',
    'Са́вин Йо́сипович Абрисо́вський — український композитор-аматор, художник з роду Абрисовських.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    206,
    'artists206@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    NULL,
    'Августин, син Бажея',
    'Августин, син Бажея (пом. 1575) — живописець. Працював у Львові. 1557 року виконав і розписав циферблат на ратушній вежі.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    207,
    'artists207@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    NULL,
    'Авдоніна-Шпергль Галина Федорівна',
    'Гали́на Фе́дорівна Авдоніна, у шлюбі Авдо́ніна-Шпергль (нар. 4 вересня 1950 року, місто Станіслав, нині Івано-Франківськ) — українська художниця декоративно-ужиткового мистецтва.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    208,
    'artists208@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    NULL,
    'Аверін Всеволод Григорович',
    'Все́волод Григо́рович Аве́рін (нар. 20 лютого 1889, Чепіль — пом. 3 вересня 1946, Харків) — український радянський графік; член об''єдннаня «Художній цех» у 1918—1919 роках;',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    209,
    'artists209@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/209.jpg',
    'Аверков Павло Петрович',
    'Павло́ Петро́вич Аве́рков (25 червня 1924, Тула — 8 лютого 1986, Київ) — український радянський художник скла; член Спілки радянських художників України.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    210,
    'artists210@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    NULL,
    'Авраменко Василь Кузьмович',
    'Васи́ль Кузьми́ч Авра́менко (нар. 31 січня 1936, Мурманськ) — український графік, член Спілки радянських художників України до 1976 року.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    211,
    'artists211@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/211.jpg',
    'Агніт-Следзевський Казимир Генріхович',
    'Казимир Ге́нріхович А́гніт-Следзе́вський (След-Зевський) (Агніт-Казимир Генріхович Следзевський; 27 травня 1898, Санкт-Петербург — 6 листопада 1973, Київ) — український радянський графік;',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),

  (  212,
    'artists212@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/212.jpg',
    'Бородай Олександр Андрійович',
    'Народився у Дніпропетровську. У 1972 році закінчив Київський державний художній інститут, педагог з фаху Т. Н. Яблонська. Працював в галузі станкового та монументального живопису.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
    (  213,
    'artists213@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/213.jpg',
    'Бутник Степан Данилович',
    'Народився 23 грудня 1873 [4 січня 1874] року в містечку Баришівці (нині селище міського типу у Київській області, Україна).',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
    (  214,
    'artists214@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/214.jpg',
    'Білоку́р Катери́на Васи́лівна',
    'Катерина Білокур народилася 24 листопада (7 грудня) 1900 року[4]. Батько, Василь Йосипович Білокур, був заможною людиною, мав 2,5 десятини орної землі, тримав худобу. Мала братів Григорія та Павла.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
      (  215,
    'artists215@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/215.jpg',
    'Віктор Мусі ',
    'Віктор Мусі народився в СРСР, в місті Кременчук — УРСР. З 1974 по 1978 рік навчався в Кременчуцькій художній школі — акварель, скульптура. ',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),

    (  216,
    'artists216@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/216.jpg',
    'Григо́рій Іва́нович Гавриле́нко ',
    'Народився 7 липня 1927 року у селі Холопковому (нині село Перемога Шосткинського району Сумської області, Україна) у заможній селянській багатодітній сімї. Після розкуркулення 1930 року його сімя втекла до Грузії, де батько працював на копальні поблизу міста Поті.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (  217,
    'artists217@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/217.jpg',
    'Ле́в (Леон) Льво́вич Ґец  ',
    'Народився в багатодітній родині львівського друкаря. По закінченню нормальної школи батьки віддали його на курс декоративного малярства Львівської промислової школи. ',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),

  (  218,
    'artists218@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/218.jpg',
    'Михай́ло І́лькович Діди́шин-Юсипчу́к',
    'У 1970-х роках Михайло Дідишин розшукав хату-зимівник, що за переказами належала Штефану Дзвінчуку, і в якій був вбитий Олекса Довбуш, переніс її на власне подвіря і заснував музей Олекси Довбуша з більш ніж 500 експонатами.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  );


-- Sample for Art terms
DELETE FROM user
WHERE id >= 1500
  AND id < 2000;
INSERT INTO user(
    id,
    email,
    `password`,
    `role`,
    images,
    title,
    bio,
    createdAt,
    updatedAt
  )
VALUES (
    1500,
    'artists1500@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'CREATOR',
    '/Img/testdata/artists/1500.png',
    'Albert Gleizes',
    'Albert Gleizes (8 December 1881 – 23 June 1953) was a French artist, theoretician, philosopher, a self-proclaimed founder of Cubism and an influence on the School of Paris.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  );

-- Insert museums
INSERT INTO user(
    id,
    email,
    `password`,
    `role`,
    images,
    title,
    bio,
    createdAt,
    updatedAt
  )
VALUES (
    100,
    'museum100@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'MUSEUM',
    '/Img/testdata/museums/100.png',
    'Lviv Historical Museum',
    'Lviv Historical Museum is one of the oldest and the richest museums in Ukraine, established in 1893. The museum has rich and glorious traditions.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    101,
    'museum101@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'MUSEUM',
    '/Img/testdata/museums/101.png',
    'National Museum of the History of Ukraine',
    'The National Museum of the History of Ukraine illustrates Ukraine’s history from ancient times till nowadays. It is one of the leading museums in Ukraine.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  ),
  (
    102,
    'museum102@art.playukraine.com',
    '$2b$10$bNg7HS9YSEWEeFs9OZY.sedYY22fb5Lk9dtVPXkfWnt0FoV0CzfEW',
    'MUSEUM',
    '/Img/testdata/museums/102.jpg',
    'The Museum of Theatre, Music and Cinema of Ukraine',
    'The Museum of Theatre, Music and Cinema of Ukraine was founded in 1923 by the artistic union "Berezil" headed by the prominent figure of Ukrainian theater Les'' Kurbas.',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'
  );

-- Insert paintings
INSERT INTO Product(
    id,
    authorId,
    title_en,
    title_uk,
    description_en,
    description_uk,
    specs_en,
    specs_uk,
    createdAt,
    updatedAt
  )
VALUES (
    (100,
    1500,
    'Portrait of Jacques Nayral',
    'Portrait of Jacques Nayral',
    'Portrait of Jacques Nayral (also known as Portrait de Jacques Nayral) is a large oil painting created in 1911 by the French artist, theorist and writer Albert Gleizes (1881–1953).',
    'Portrait of Jacques Nayral (also known as Portrait de Jacques Nayral) is a large oil painting created in 1911 by the French artist, theorist and writer Albert Gleizes (1881–1953).',
    'Year	1911\nMedium	Oil on canvas\nDimensions	162 cm × 114 cm (63.8 in × 44.9 in)',
    'Year	1911\nMedium	Oil on canvas\nDimensions	162 cm × 114 cm (63.8 in × 44.9 in)',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00'),
    (200,
    'Жінка в зеленому корсеті.,Серед. 1920-х.',
    'Збірка Меморіального музею-садиби Катерини Білокур у Богданівці',
    'Year	1911\nMedium	Oil on canvas\nDimensions	162 cm × 114 cm (63.8 in × 44.9 in)',
    'Year	1911\nMedium	Oil on canvas\nDimensions	16cm × 114 cm (63.8 in × 44.9 in)',
    '2024-01-01 00:00:00',
    '2024-01-01 00:00:00')
  );

INSERT INTO ProductImage(
    imageUrl,
    productId
  )
VALUES (
    ('/Img/testdata/artterms/100.jpg',
    100),
    ('/Img/testdata/products/200_1.jpeg', 200)
  );

-- Insert Art terms
INSERT INTO ArtTerm (
    id,
    title_en,
    title_uk,
    description_en,
    description_uk,
    content_en,
    content_uk,
    author_id,
    highlighted_product_id,
    created_at,
    updated_at
  )
VALUES (
    1,
    'Abbaye de Créteil',
    'Абатство Кретей',
    'Established in 1906, the Abbaye de Créteil was a group of French writers, artists and composers who were inspired by the work of Renaissance writer François Rabelais',
    'Абатство Кретей, засноване в 1906 році, було групою французьких письменників, художників і композиторів, які надихалися творчістю письменника епохи Відродження Франсуа Рабле',
    'content_en:text',
    'content_uk:text',
    1,
    100,
    '2024-11-29 00:30:26.699',
    '2024-11-29 00:30:26.699'
  ), 
  (
    2,
    'Abject art',
    'Об\'єктне мистецтво',
    'Abject art is used to describe artworks which explore themes that transgress and threaten our sense of cleanliness and propriety particularly referencing the body and bodily functions',
    'Аб’єктне мистецтво використовується для опису творів мистецтва, які досліджують теми, які виходять за межі нашого почуття чистоти та пристойності та загрожують їм, особливо посилаючись на тіло та функції організму',
    'content_en:text',
    'content_uk:text',
    1,
    1,
    '2024-11-29 00:30:26.699',
    '2024-11-29 00:30:26.699'
  ), 
  (
    3,
    'Abstract art',
    'Абстрактне мистецтво',
    'Abstract art is art that does not attempt to represent an accurate depiction of a visual reality but instead uses shapes, colours, forms and gestural marks to achieve its effect',
    'Абстрактне мистецтво — це мистецтво, яке не намагається представити точне зображення візуальної реальності, а натомість використовує форми, кольори, форми та жестові знаки для досягнення ефекту.',
    'content_en:text',
    'content_uk:text',
    1,
    1,
    '2024-11-29 00:30:26.699',
    '2024-11-29 00:30:26.699'
  ), 
  (
    4,
    'Abstract expressionism',
    'Абстрактний експресіонізм',
    'Abstract expressionism is the term applied to new forms of abstract art developed by American painters such as Jackson Pollock, Mark Rothko and Willem de Kooning in the 1940s and 1950s. It is often characterised by gestural brush-strokes or mark-making, and the impression of spontaneity',
    'Абстрактний експресіонізм — це термін, що застосовується до нових форм абстрактного мистецтва, розроблених американськими художниками, такими як Джексон Поллок, Марк Ротко та Віллем де Кунінг у 1940-х і 1950-х роках. Його часто характеризують жестикуляція мазків пензлем або позначення та враження спонтанності',
    'content_en:text',
    'content_uk:text',
    1,
    1,
    '2024-11-29 00:30:26.699',
    '2024-11-29 00:30:26.699'
  ), 
  (
    5,
    'Baroque',
    'Бароко',
    'Baroque was the dominant style in art and architecture of the seventeenth century, characterized by self-confidence, dynamism and a realistic approach to depiction',
    'Бароко було домінуючим стилем у мистецтві та архітектурі XVII ст., який характеризувався самовпевненістю, динамічністю та реалістичним підходом до зображення.',
    'content_en:text',
    'content_uk:text',
    1,
    1,
    '2024-11-29 00:30:26.699',
    '2024-11-29 00:30:26.699'
  );