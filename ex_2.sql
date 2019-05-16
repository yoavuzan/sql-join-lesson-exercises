SELECT COUNT(p.id) AS count
FROM patient as p
WHERE p.disease IS NOT NULL