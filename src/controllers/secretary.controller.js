const express = require("express"),
    router = express.Router();

const service = require("../services/secretary.service.js");

// http://localhost:3000/api/secretaries
router.get("/", async (req, res) => {
    const data = await service.getAllSecretaries()
    res.send(data);
});

router.get("/:id", async (req, res) => {
    const data = await service.getSecretaryById(req.params.id)

    if (data.length === 0) {
        res.status(404).json("no record found for id " + req.params.id);
        return;
    }
    res.send(data);
});

router.post("/", async (req, res) => {
    const doctorIds = req.body.DoctorIds || [];
    try {
        await service.addOrEditSecretary(req.body, req.params.id, doctorIds)
        res.status(201).json("Secretary added successfully");
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.put("/:id", async (req, res) => {
    const affectedRows = await service.addOrEditSecretary(req.body, req.params.id)
    if (affectedRows === 0) {
        res.status(404).json("no record found for id " + req.params.id);
    }
    res.send(`Secretary updated successfully`);
});

router.delete("/:id", async (req, res) => {
    const affectedRows = await service.deleteSecretary(req.params.id)

    if (affectedRows[0] === 0) {
        res.status(404).json("no record found for id " + req.params.id);
        return;
    }

    if (affectedRows[1] !== 0) {
        res.send(`Secretary deleted successfully, along with ${affectedRows[1]} relations`);
        return;
    }

    res.send(`Secretary deleted successfully`);
});

module.exports = router;