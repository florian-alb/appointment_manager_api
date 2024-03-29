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
    const secretaryIds = req.body.SecretaryIds || [];
    try {
        await service.addOrEditDoctor(req.body, req.params.id, secretaryIds);
        res.status(201).json({message: "Doctor added"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.put("/:id", async (req, res) => {
    const secretaryIds = req.body.SecretaryIds || [];
    const affectedRows = await service.addOrEditDoctor(req.body, req.params.id, secretaryIds)
    if (affectedRows === 0) {
        res.status(404).json("no record found for id " + req.params.id);
    }
    res.send(`Doctor updated successfully`);
});

router.delete("/:id", async (req, res) => {
    const affectedRows = await service.deleteDoctor(req.params.id)

    if (affectedRows[0] === 0) {
        res.status(404).json("no record found for id " + req.params.id);
        return;
    }

    if (affectedRows[1] !== 0) {
        res.send(`Doctor deleted successfully, along with ${affectedRows[1]} relations`);
        return;
    }

    res.send(`Doctor deleted successfully`);
});

module.exports = router;