USE sql_intro;

SELECT e.name, COUNT(p.ethnicity_id) AS ethnicity_count
FROM patient p
    JOIN ethnicity e ON p.ethnicity_id = e.id
WHERE
    p.disease_name = 'lettuce disease'
GROUP BY
    e.name;