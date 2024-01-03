const db = require('../config/db/db.config.js');

//TODO: refactor this
module.exports.addOrUpdateDoctorSecretaryRelation = async (doctorId, secretaryId, connection=db) => {
    await connection.query("CALL usp_add_or_update_doctor_secretary_relation(?, ?, @status)",
        [doctorId, secretaryId]);
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

//TODO: refactor this
module.exports.getSecretariesForDoctor = async (id) => {
    const [records] = await db.query("SELECT s.* FROM Secretaries s JOIN DoctorSecretary ds ON s.SecretaryID = ds.SecretaryID WHERE ds.DoctorID = ?", [id]);
    return records;
}

//TODO: refactor this
module.exports.getDoctorsForSecretary = async (id) => {
    const [records] = await db.query("SELECT d.* FROM Doctors d JOIN DoctorSecretary ds ON d.DoctorID = ds.DoctorID WHERE ds.SecretaryID = ?", [id]);
    return records;
}

//TODO: refactor this
module.exports.deleteDoctorSecretaryRelation = async (doctorId, secretaryId) => {
    const [record] = await db.query("DELETE FROM DoctorSecretary WHERE DoctorID = ? AND SecretaryID = ?", [doctorId, secretaryId]);
    return record.affectedRows;
}