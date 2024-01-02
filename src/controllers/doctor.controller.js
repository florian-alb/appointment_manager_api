const express = require("express"),
    router = express.Router();

const service = require("../services/doctor.service.js");

// http://localhost:3000/api/doctors
router.get("/", async (req, res) => {
    const data = await service.getAllDoctors()
    res.send(data);
});

router.get("/search/", async (req, res) => {
    const data = await service.searchDoctors(req.query)

    if (data.length === 0) {
        res.status(404).json("no record found for these search criteria");
        return;
    }

    res.send(data);
});

router.get("/:id", async (req, res) => {
    const data = await service.getDoctorById(req.params.id)

    if (data.length === 0) {
        res.status(404).json("no record found for id " + req.params.id);
        return;
    }
    res.send(data);
});

router.post("/", async (req, res) => {
    await service.addOrEditDoctor(req.body)
    res.status(201).json("Doctor added successfully");
});

router.put("/:id", async (req, res) => {
    const affectedRows = await service.addOrEditDoctor(req.body, req.params.id)
    if (affectedRows === 0) {
        res.status(404).json("no record found for id " + req.params.id);
    }
    res.send(`Doctor updated successfully`);
});

router.delete("/:id", async (req, res) => {
    const affectedRows = await service.deleteDoctor(req.params.id)

    if (affectedRows === 0) {
        res.status(404).json("no record found for id " + req.params.id);
        return;
    }
    res.send(`Doctor deleted successfully`);
});

module.exports = router;