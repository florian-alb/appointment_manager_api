CREATE TABLE IF NOT EXISTS Secretaries
(
    SecretaryID INT PRIMARY KEY AUTO_INCREMENT,
    FirstName   VARCHAR(255) NOT NULL,
    LastName    VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20)  NOT NULL,
    Email       VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Doctors
(
    DoctorID    INT PRIMARY KEY AUTO_INCREMENT,
    FirstName   VARCHAR(255) NOT NULL,
    LastName    VARCHAR(255) NOT NULL,
    Speciality  VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20)  NOT NULL,
    Email       VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS DoctorSecretary
(
    DoctorID    INT NOT NULL,
    SecretaryID INT NOT NULL,
    PRIMARY KEY (DoctorID, SecretaryID),
    FOREIGN KEY (DoctorID) REFERENCES Doctors (DoctorID),
    FOREIGN KEY (SecretaryID) REFERENCES Secretaries (SecretaryID)
);

CREATE TABLE IF NOT EXISTS Patients
(
    PatientID   INT PRIMARY KEY AUTO_INCREMENT,
    FirstName   VARCHAR(255) NOT NULL,
    LastName    VARCHAR(255) NOT NULL,
    DateOfBirth DATETIME     NOT NULL,
    Address     VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20)  NOT NULL,
    Email       VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Appointments
(
    AppointmentID INT PRIMARY KEY AUTO_INCREMENT,
    Date          DATETIME NOT NULL,
    PatientID     INT      NOT NULL,
    DoctorID      INT      NOT NULL,
    SecretaryID   INT      NOT NULL,
    Notes         TEXT,
    FOREIGN KEY (PatientID) REFERENCES Patients (PatientID),
    FOREIGN KEY (DoctorID) REFERENCES Doctors (DoctorID),
    FOREIGN KEY (SecretaryID) REFERENCES Secretaries (SecretaryID)
);

CREATE PROCEDURE IF NOT EXISTS `SocioDocs`.`usp_secretary_add_or_edit`(
    IN _secretary_id INT,
    IN _first_name VARCHAR(255),
    IN _last_name VARCHAR(255),
    IN _phone_number VARCHAR(20),
    IN _email VARCHAR(255)
)
BEGIN
    IF _secretary_id = 0 THEN
        INSERT INTO Secretaries (FirstName, LastName, PhoneNumber, Email)
        VALUES (_first_name, _last_name, _phone_number, _email);
    ELSE
        UPDATE Secretaries
        SET FirstName   = _first_name,
            LastName    = _last_name,
            PhoneNumber = _phone_number,
            Email       = _email
        WHERE SecretaryID = _secretary_id;
    END IF;

    SELECT ROW_COUNT() AS AffectedRows;
END;

create
    definer = root@localhost procedure usp_doctor_add_or_edit(IN _doctor_id int, IN _first_name varchar(255),
                                                              IN _last_name varchar(255), IN _speciality varchar(255),
                                                              IN _phone_number varchar(20), IN _email varchar(255))
BEGIN
    DECLARE insertId INT;
    DECLARE affectedRows INT;

    IF _doctor_id = 0 THEN
        INSERT INTO Doctors (FirstName, LastName, Speciality, PhoneNumber, Email)
        VALUES (_first_name, _last_name, _speciality, _phone_number, _email);
        SET insertId = LAST_INSERT_ID();
    ELSE
        UPDATE Doctors
        SET FirstName   = _first_name,
            LastName    = _last_name,
            Speciality    = _speciality,
            PhoneNumber = _phone_number,
            Email       = _email
        WHERE _doctor_id = DoctorID;
        SET insertId = _doctor_id;
    END IF;

    SET AffectedRows = ROW_COUNT();

    SELECT insertId AS InsertId, affectedRows AS AffectedRows;
END;

CREATE PROCEDURE IF NOT EXISTS `SocioDocs`.`usp_patient_add_or_edit`(
    IN _patient_id INT,
    IN _first_name VARCHAR(255),
    IN _last_name VARCHAR(255),
    IN _date_of_birth DATE,
    IN _address VARCHAR(255),
    IN _phone_number VARCHAR(20),
    IN _email VARCHAR(255)
)
BEGIN
    IF _patient_id = 0 THEN
        INSERT INTO Patients (FirstName, LastName, DateOfBirth, Address, PhoneNumber, Email)
        VALUES (_first_name, _last_name, _date_of_birth, _address, _phone_number, _email);
    ELSE
        UPDATE Patients
        SET FirstName   = _first_name,
            LastName    = _last_name,
            DateOfBirth = _date_of_birth,
            Address     = _address,
            PhoneNumber = _phone_number,
            Email       = _email
        WHERE _patient_id = PatientID;
    END IF;

    SELECT ROW_COUNT() AS AffectedRows;
END;

CREATE PROCEDURE IF NOT EXISTS usp_appointment_add_or_edit(
    IN _appointment_id int,
    IN _date datetime,
    IN _patient_id int, IN _doctor_id int,
    IN _secretary_id int, IN _notes text,
    OUT _status varchar(255))

BEGIN
    DECLARE patientExists INT;
    DECLARE doctorExists INT;
    DECLARE secretaryExists INT;

    SELECT COUNT(*) INTO patientExists FROM Patients WHERE PatientID = _patient_id;
    SELECT COUNT(*) INTO doctorExists FROM Doctors WHERE DoctorID = _doctor_id;
    SELECT COUNT(*) INTO secretaryExists FROM Secretaries WHERE SecretaryID = _secretary_id;

    IF patientExists = 0 THEN
        SET _status = 'Patient does not exist';
    ELSEIF doctorExists = 0 THEN
        SET _status = 'Doctor does not exist';
    ELSEIF secretaryExists = 0 THEN
        SET _status = 'Secretary does not exist';
    ELSE
        IF _appointment_id = 0 THEN
            INSERT INTO Appointments (Date, PatientID, DoctorID, SecretaryID, Notes)
            VALUES (_date, _patient_id, _doctor_id, _secretary_id, _notes);
        ELSE
            UPDATE Appointments
            SET Date        = _date,
                PatientID   = _patient_id,
                DoctorID    = _doctor_id,
                SecretaryID = _secretary_id,
                Notes       = _notes
            WHERE AppointmentID = _appointment_id;
        END IF;
        SET _status = 'Success';
    END IF;
END;

CREATE PROCEDURE IF NOT EXISTS usp_add_or_update_doctor_secretary_relation(
    IN _doctor_id INT,
    IN _secretary_id INT,
    OUT _status varchar(255))
BEGIN
    DECLARE doctorExists INT;
    DECLARE secretaryExists INT;
    DECLARE existingRelation INT;

    SELECT COUNT(*) INTO doctorExists FROM Doctors WHERE DoctorID = _doctor_id;
    SELECT COUNT(*) INTO secretaryExists FROM Secretaries WHERE SecretaryID = _secretary_id;

    IF doctorExists = 0 THEN
        SET _status = 'Doctor does not exist';
    ELSEIF secretaryExists = 0 THEN
        SET _status = 'Secretary does not exist';
    ELSE
        SELECT COUNT(*)
        INTO existingRelation
        FROM DoctorSecretary
        WHERE DoctorID = _doctor_id AND SecretaryID = _secretary_id;

        IF existingRelation = 0 THEN
            INSERT INTO DoctorSecretary (DoctorID, SecretaryID) VALUES (_doctor_id, _secretary_id);
            SET _status = 'Relation Created';
        ELSE
            SET _status = 'Relation Already Exists';
        END IF;
    END IF;
END;
