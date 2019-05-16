SELECT p.symptoms_family, COUNT(p.symptoms_family) as count
FROM patient as p, symptoms as s, disease as d
WHERE
    p.symptoms_family = s.family AND
    p.disease = d.name AND
    d.name = "cabagge disease"
GROUP BY p.symptoms_family;