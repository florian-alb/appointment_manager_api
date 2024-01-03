const express = require("express"),
    router = express.Router();

// http://localhost:3000/api/doctorSecretary
const service = require("../services/doctorSecretary.service.js");

// Add a doctor-secretary relationship
router.post("/", async (req, res) => {
    const status = await service.addDoctorSecretaryRelation(req.body.DoctorId, req.body.SecretaryId);

    if (status.status !== "Success"){
        res.status(400).json(status.status);
        return;
    }
    res.status(201).json("Relation added successfully");
});

// Get all secretaries_doctors records
router.get("/", async (req, res) => {
    const records = await service.getAllSecretaryDoctors(req.params.DoctorId);
    res.json(records);
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

// Update a doctor-secretary relationship
router.put("/", async (req, res) => {
    const status = await service.updateDoctorSecretaryRelation(req.body);
    res.json(status);
});

// Delete a doctor-secretary relationship
router.delete("/secretary/:SecretaryId/doctor/:DoctorId", async (req, res) => {
    const affectedRows = await service.deleteDoctorSecretaryRelation(req.params.DoctorId, req.params.SecretaryId);
    if (affectedRows === 0) {
        res.status(404).json("No record found for this relation");
        return;
    }
    res.json("Relation deleted successfully");
});

module.exports = router;
