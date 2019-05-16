SELECT p.id, d.survival_rate
FROM patient as p, disease as d
WHERE
  p.disease IS NOT NULL
  AND p.disease = d.name
ORDER BY id