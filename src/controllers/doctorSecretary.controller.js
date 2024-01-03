const express = require("express"),
    router = express.Router();

// http://localhost:3000/api/doctorSecretary
const service = require("../services/doctorSecretary.service.js");

// Add a doctor-secretary relationship
router.post("/", async (req, res) => {
    await service.addDoctorSecretaryRelation(req.body.DoctorId, req.body.SecretaryId);
    res.status(201).json("Relation added successfully");
});

// Get secretaries for a doctor
router.get("/doctor/:DoctorId/secretaries", async (req, res) => {
    const records = await service.getSecretariesForDoctor(req.params.DoctorId);
    res.json(records);
});

// Get doctors for a secretary
router.get("/secretary/:SecretaryId/doctors", async (req, res) => {
    const records = await service.getDoctorsForSecretary(req.params.SecretaryId);
    res.json(records);
});

// Delete a doctor-secretary relationship
router.delete("/", async (req, res) => {
    const affectedRows = await service.deleteDoctorSecretaryRelation(req.body.DoctorId, req.body.SecretaryId);
    if (affectedRows === 0) {
        res.status(404).json("No record found for this relation");
        return;
    }
    res.json("Relation deleted successfully");
});

module.exports = router;