const db = require('../config/db/db.config.js');

module.exports.getAllPatients = async () => {
    const [records] = await db.query(`SELECT * FROM Patients;`);
    return records;
}

module.exports.getPatientById = async (id) => {
    const [record] = await db.query("SELECT * FROM Patients WHERE PatientID = ?", [id]);
    return record;
}

module.exports.deletePatient = async (id) => {
    const [deletedAppointments] = await db.query("DELETE FROM Appointments WHERE PatientID = ?", [id]);
    const [record] = await db.query("DELETE FROM Patients WHERE PatientID = ?", [id]);
    return [record.affectedRows, deletedAppointments.affectedRows];
}

module.exports.addOrEditPatient = async (obj, id = 0) => {
    const [[[{AffectedRows}]]] = await db.query("CALL usp_patient_add_or_edit(?, ?, ?, ?, ?, ?, ?)",
        [id, obj.FirstName, obj.LastName, obj.DateOfBirth, obj.Address, obj.PhoneNumber, obj.Email]);
    return AffectedRows;
}

module.exports.searchPatients = async (obj) => {
    let query = "SELECT * FROM Patients WHERE 1=1";
    const params = [];

    if (obj.FirstName !== undefined) {
        query += " AND FirstName = ?";
        params.push(obj.FirstName);
    }
    if (obj.LastName !== undefined) {
        query += " AND LastName = ?";
        params.push(obj.LastName);
    }
    if (obj.DateOfBirth !== undefined) {
        query += " AND DateOfBirth = ?";
        params.push(obj.DateOfBirth);
    }

    const [records] = await db.execute(query, params);
    return records;
}