const db = require('../config/db/db.config.js');

module.exports.getAllAppointments = async () => {
    const getQuery = `SELECT * FROM Appointments;`;
    const [records] = await db.query(getQuery);
    return records;
}

module.exports.getAppointmentById = async (id) => {
    const [record] = await db.query("SELECT * FROM Appointments WHERE SecretaryID = ?", [id]);
    return record;
}

module.exports.deleteAppointment = async (id) => {
    const [record] = await db.query("DELETE FROM Appointments WHERE SecretaryID = ?", [id]);
    return record.affectedRows;
}

module.exports.addOrEditAppointment = async (obj, id = 0) => {
    await db.query("CALL usp_appointment_add_or_edit(?, ?, ?, ?, ?, ?, @status)",
        [id, obj.Date, obj.PatientID, obj.DoctorID, obj.SecretaryID, obj.Notes]);

    const [[status]] = await db.query("SELECT @status AS status");
    return status;
};

module.exports.searchAppointment = async (obj) => {
    let query = "SELECT * FROM Appointments WHERE 1=1";
    const params = [];

    if (obj.Date !== undefined) {
        query += " AND DATE(Date) = ?";
        params.push(obj.Date);
    }
    if (obj.PatientID !== undefined) {
        query += " AND PatientID = ?";
        params.push(obj.PatientID);
    }
    if (obj.DoctorID !== undefined) {
        query += " AND DoctorID = ?";
        params.push(obj.DoctorID);
    }
    if (obj.SecretaryID !== undefined) {
        query += " AND SecretaryID = ?";
        params.push(obj.SecretaryID);
    }

    const [records] = await db.execute(query, params);
    return records;
}