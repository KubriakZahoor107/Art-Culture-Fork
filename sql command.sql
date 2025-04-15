-- SELECT * FROM Product
-- SELECT * From user
-- SELECT * From ProductImage
-- SELECT * FROM Post
-- SELECT * FROM Exhibition
-- SELECt * FROM ExhibitionArtist


-- DELETE FROM Product WHERE authorId = 5;
-- DELETE FROM Post WHERE author_id = 3;
-- DELETE FROM ExhibitionArtist WHERE artistId = 1;
-- DELETE FROM ProductImage WHERE productId = 6;
-- DELETE FROM user WHERE id = 11;
-- DELETE FROM Exhibition WHERE createdById = 3;


-- UPDATE user
-- SET role = 'CREATOR'
-- WHERE email = 'vavadjan+creator@gmail.com';

-- INSERT INTO user
--   (email, password, role, images, title, bio, createdAt, updatedAt, country,
--    house_number, lat, lon, postcode, state, street, city)
-- VALUES
-- ('artist4010@example.com', '$2b$10$someHash10', 'CREATOR',
--  '/uploads/profileImages/creator4010.jpg',
--  'Аліна Шевчук',
--  '<p>Примітна серія робіт про українські обряди.</p>',
--  '2005-06-25 09:00:00',
--  '2025-02-10 11:22:33',
--  'Україна', NULL, NULL, NULL, NULL, NULL, NULL, 'Полтава')