const db = require('../config/db/db.config.js');


module.exports.addDoctorSecretaryRelation = async (obj, connection = db) => {
    await connection.query("CALL usp_add_doctor_secretary_relation(?, ?, @status)",
        [obj.DoctorId, obj.SecretaryId]);
    const [[status]] = await connection.query("SELECT @status AS status");
    return status;
}

module.exports.updateDoctorSecretaryRelation = async (obj, connection = db) => {
    await connection.query("CALL usp_update_doctor_secretary_relation(?,?,?, ?, @status)",
        [obj.DoctorId, obj.SecretaryId,obj.NewDoctorId, obj.NewSecretaryId]);
    const [[status]] = await connection.query("SELECT @status AS status");
    return status;
}

module.exports.getAllSecretaryDoctors = async () => {
    const [records] = await db.query(
        "SELECT s.SecretaryID, s.FirstName as SecretaryFirstName, s.LastName as SecretaryLastName, s.PhoneNumber as SecretaryPhoneNumber, s.Email as SecretaryEmail," +
        " d.DoctorID, d.FirstName as DoctorFirstName, d.LastName as DoctorLastName, d.Speciality, d.PhoneNumber as DoctorPhoneNumber, d.Email as DoctorEmail" +
        " FROM DoctorSecretary ds" +
        " JOIN Secretaries s ON ds.SecretaryID = s.SecretaryID" +
        " JOIN Doctors d ON ds.DoctorID = d.DoctorID");
    return records;
}

module.exports.getSecretariesForDoctor = async (id) => {
    const [records] = await db.query("SELECT s.* FROM Secretaries s JOIN DoctorSecretary ds ON s.SecretaryID = ds.SecretaryID WHERE ds.DoctorID = ?", [id]);
    return records;
}

module.exports.getDoctorsForSecretary = async (id) => {
    const [records] = await db.query("SELECT d.* FROM Doctors d JOIN DoctorSecretary ds ON d.DoctorID = ds.DoctorID WHERE ds.SecretaryID = ?", [id]);
    return records;
}

module.exports.deleteDoctorSecretaryRelation = async (doctorId, secretaryId) => {
    const [record] = await db.query("DELETE FROM DoctorSecretary WHERE DoctorID = ? AND SecretaryID = ?", [doctorId, secretaryId]);
    return record.affectedRows;
}