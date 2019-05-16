CREATE TABLE Ethnicity(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20)
);

CREATE TABLE Symptoms(
    family INT NOT NULL AUTO_INCREMENT PRIMARY KEY ,
    fever BOOLEAN,
    blue_whelts BOOLEAN
);

CREATE TABLE Patient(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    ethnicity INT,
    symptoms INT,

    FOREIGN KEY(ethnicity) REFERENCES ethnicity(id),
    FOREIGN KEY(symptoms) REFERENCES symptoms(family)
);

CREATE TABLE Gender(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    hello varchar(50)
);



CREATE TABLE Disease(
    name varchar(20) PRIMARY KEY,
    hello varchar(50)
);