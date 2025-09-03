-- Active: 1756732767770@@127.0.0.1@3306@sql_intro
USE sql_intro;
-- Ethnicity table
CREATE TABLE ethnicity (
    id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

-- Gender table
CREATE TABLE gender (
    id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL
);

-- Symptoms table
CREATE TABLE symptoms (
    id INT PRIMARY KEY,
    family BOOLEAN NOT NULL,
    fever BOOLEAN NOT NULL,
    blue_whelts BOOLEAN NOT NULL
);

-- Disease table
CREATE TABLE disease (
    name VARCHAR(50) PRIMARY KEY,
    probability DECIMAL(4,2) NOT NULL
);

-- Patient table
CREATE TABLE patient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ethnicity_id INT NOT NULL,
    gender_id INT NOT NULL,
    symptoms_id INT NOT NULL,
    disease_name VARCHAR(50),

    -- Foreign key constraints
    CONSTRAINT fk_ethnicity FOREIGN KEY (ethnicity_id) REFERENCES ethnicity(id),
    CONSTRAINT fk_gender FOREIGN KEY (gender_id) REFERENCES gender(id),
    CONSTRAINT fk_symptoms FOREIGN KEY (symptoms_id) REFERENCES symptoms(id),
    CONSTRAINT fk_disease FOREIGN KEY (disease_name) REFERENCES disease(name)
);

DROP TABLE IF EXISTS patient;
DROP TABLE IF EXISTS disease;
DROP TABLE IF EXISTS symptoms;
DROP TABLE IF EXISTS ethnicity;
DROP TABLE IF EXISTS gender;

