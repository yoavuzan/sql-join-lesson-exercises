USE sql_intro;
SELECT 
    symptoms.family AS symptom_family,
    COUNT(patient.symptoms_id) AS patient_count
FROM patient
JOIN symptoms 
    ON patient.symptoms_id = symptoms.id
WHERE patient.disease_name = 'cabbage disease'
GROUP BY symptoms.family



