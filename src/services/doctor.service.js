const db = require('../config/db/db.config.js');

module.exports.getAllDoctors = async () => {
    const getQuery = `SELECT * FROM Doctors;`;

    const [records] = await db.query(getQuery);
    return records;
}

module.exports.getDoctorById = async (id) => {
    const [record] = await db.query("SELECT * FROM Doctors WHERE DoctorID = ?", [id]);
    return record;
}

module.exports.deleteDoctor = async (id) => {
    const [record] = await db.query("DELETE FROM Doctors WHERE DoctorID = ?", [id]);
    return record.affectedRows;
}

module.exports.addOrEditDoctor = async (obj, id = 0) => {
    const [[[{AffectedRows}]]] = await db.query("CALL usp_doctor_add_or_edit(?, ?, ?, ?, ?, ?)",
        [id, obj.FirstName, obj.LastName,obj.Speciality, obj.PhoneNumber, obj.Email]);
    return AffectedRows;
}

module.exports.searchDoctors = async (obj) => {
    let query = "SELECT * FROM Doctors WHERE 1=1";
    const params = [];

    if (obj.FirstName !== undefined) {
        query += " AND FirstName = ?";
        params.push(obj.FirstName);
    }
    if (obj.LastName !== undefined) {
        query += " AND LastName = ?";
        params.push(obj.LastName);
    }
    if (obj.Speciality !== undefined) {
        query += " AND Speciality = ?";
        params.push(obj.Speciality);
    }

    const [records] = await db.execute(query, params);
    return records;
}