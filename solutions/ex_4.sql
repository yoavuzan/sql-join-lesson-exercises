USE sql_intro;

SELECT 
    patient.id,
    disease.probability AS survival_rate
FROM patient
JOIN disease 
    ON patient.disease_name = disease.name 
ORDER BY patient.id;
