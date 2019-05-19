SELECT e.name, COUNT(p.ethnicity)
FROM patient as p, ethnicity as e, disease as d
WHERE
        p.ethnicity = e.id AND
        p.disease = d.name AND
        d.name = "lettuce disease"
GROUP BY p.ethnicity;
