const express = require("express"),
    router = express.Router();

const service = require("../services/patient.service.js");

// http://localhost:3000/api/patients
router.get("/", async (req, res) => {
    const data = await service.getAllPatients()
    res.send(data);
});

router.get("/search/", async (req, res) => {
    const data = await service.searchPatients(req.query)

    if (data.length === 0) {
        res.status(404).json("no record found for these search criteria");
        return;
    }

    res.send(data);
});

router.get("/:id", async (req, res) => {
    const data = await service.getPatientById(req.params.id)

    if (data.length === 0) {
        res.status(404).json("no record found for id " + req.params.id);
        return;
    }
    res.send(data);
});

router.post("/", async (req, res) => {
    await service.addOrEditPatient(req.body)
    res.status(201).json("Patient added successfully");
});

router.put("/:id", async (req, res) => {
    const affectedRows = await service.addOrEditPatient(req.body, req.params.id)
    if (affectedRows === 0) {
        res.status(404).json("no record found for id " + req.params.id);
    }
    res.send(`Patient updated successfully`);
});

router.delete("/:id", async (req, res) => {
    const affectedRows = await service.deletePatient(req.params.id)

    if (affectedRows[0] === 0) {
        res.status(404).json("no record found for id " + req.params.id);
        return;
    }

    if (affectedRows[1] !== 0) {
        res.send(`Patient deleted successfully, along with ${affectedRows[1]} appointments`);
        return;
    }

    res.send(`Patient deleted successfully`);
});

module.exports = router;