const db = require('../config/db/db.config.js');
const relationService = require("../services/doctorSecretary.service");

module.exports.getAllDoctors = async () => {
    const getQuery = `SELECT *
                      FROM Doctors;`;

    const [records] = await db.query(getQuery);
    return records;
}

module.exports.getDoctorById = async (id) => {
    const [record] = await db.query("SELECT * FROM Doctors WHERE DoctorID = ?", [id]);
    return record;
}

module.exports.deleteDoctor = async (id) => {
    const [deletedRelation] = await db.query("DELETE FROM DoctorSecretary WHERE DoctorID = ?", [id]);
    const [record] = await db.query("DELETE FROM Doctors WHERE DoctorID = ?", [id]);
    return [record.affectedRows, deletedRelation.affectedRows];
}

module.exports.addOrEditDoctor = async (obj, doctorId = 0, secretaryIds = []) => {
    let errorMessages = [];
    const connection = await db.getConnection();

    try {
        // First Transaction: Create or update the doctor
        await connection.beginTransaction();
        const [[[record]]] = await connection.query("CALL usp_doctor_add_or_edit(?, ?, ?, ?, ?, ?)",
            [doctorId, obj.FirstName, obj.LastName, obj.Speciality, obj.PhoneNumber, obj.Email]);
        await connection.commit();

        console.log(doctorId)

        if (!doctorId) {
            doctorId = record.InsertId;
        }

        // Second Transaction: Add or update the doctor-secretary relations
        await connection.beginTransaction();
        for (const secretaryId of secretaryIds) {
            const status = await relationService.addDoctorSecretaryRelation(doctorId, secretaryId, connection);
            if (status.status !== 'Success') {
                errorMessages.push(`Error with secretary ID ${secretaryId}: ${status.status}`);
            }
        }

        if (errorMessages.length > 0) {
            throw new Error(errorMessages.join(", "));
        }

        await connection.commit();
        return record.AffectedRows;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
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