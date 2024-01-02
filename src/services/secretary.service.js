const db = require('../config/db/db.config.js');

module.exports.getAllSecretaries = async () => {
    const [records] = await db.query(`SELECT * FROM Secretaries;`);
    return records;
}

module.exports.getSecretaryById = async (id) => {
    const [record] = await db.query("SELECT * FROM Secretaries WHERE SecretaryID = ?", [id]);
    return record;
}

module.exports.deleteSecretary = async (id) => {
    const [record] = await db.query("DELETE FROM Secretaries WHERE SecretaryID = ?", [id]);
    return record.affectedRows;
}

module.exports.addOrEditSecretary = async (obj, id = 0) => {
    const [[[{AffectedRows}]]] = await db.query("CALL usp_secretary_add_or_edit(?, ?, ?, ?, ?)",
        [id, obj.FirstName, obj.LastName, obj.PhoneNumber, obj.Email]);
    return AffectedRows;
}