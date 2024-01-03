const db = require('../config/db/db.config.js');

module.exports.addOrUpdateDoctorSecretaryRelation = async (doctorId, secretaryId, connection) => {
    await connection.query("CALL usp_add_or_update_doctor_secretary_relation(?, ?, @status)",
        [doctorId, secretaryId]);
    const [[status]] = await connection.query("SELECT @status AS status");
    return status;
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