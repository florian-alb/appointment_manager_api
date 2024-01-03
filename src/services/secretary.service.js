const db = require('../config/db/db.config.js');
const relationService = require("../services/doctorSecretary.service");

module.exports.getAllSecretaries = async () => {
    const [records] = await db.query(`SELECT * FROM Secretaries;`);
    return records;
}

module.exports.getSecretaryById = async (id) => {
    const [record] = await db.query("SELECT * FROM Secretaries WHERE SecretaryID = ?", [id]);
    return record;
}

module.exports.deleteSecretary = async (id) => {
    const [deletedRelation] = await db.query("DELETE FROM DoctorSecretary WHERE SecretaryID = ?", [id]);
    const [record] = await db.query("DELETE FROM Secretaries WHERE SecretaryID = ?", [id]);
    return [record.affectedRows, deletedRelation.affectedRows]
}

module.exports.addOrEditSecretary = async (obj, secretaryId = 0, doctorIds = []) => {
    let errorMessages = [];
    const connection = await db.getConnection();

    try {
        // First Transaction: Create or update the doctor
        await connection.beginTransaction();
        const [[[record]]] = await connection.query("CALL usp_secretary_add_or_edit(?, ?, ?, ?, ?)",
            [secretaryId, obj.FirstName, obj.LastName, obj.PhoneNumber, obj.Email]);
        await connection.commit();

        if (!secretaryId) {
            secretaryId = record.InsertId;
        }

        // Second Transaction: Add or update the doctor-secretary relations
        await connection.beginTransaction();
        for (const doctorId of doctorIds) {
            const status = await relationService.addDoctorSecretaryRelation(doctorId, secretaryId, connection);
            if (status.status !== 'Success') {
                errorMessages.push(`Error with doctor ID ${doctorId}: ${status.status}`);
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
