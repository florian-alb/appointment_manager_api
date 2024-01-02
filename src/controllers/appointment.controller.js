const express = require("express"),
    router = express.Router();

const service = require("../services/appointment.service");

// http://localhost:3000/api/appointments
router.get("/", async (req, res) => {
    const data = await service.getAllAppointments()
    res.send(data);
});

router.get("/search/", async (req, res) => {
    const data = await service.searchAppointment(req.query)

    if (data.length === 0) {
        res.status(404).json("no record found for these search criteria");
        return;
    }

    res.send(data);
});

router.get("/:id", async (req, res) => {
    const data = await service.getAppointmentById(req.params.id)

    if (data.length === 0) {
        res.status(404).json("no record found for id " + req.params.id);
        return;
    }
    res.send(data);
});

router.post("/", async (req, res) => {
    const status = await service.addOrEditAppointment(req.body);

    if (status.status !== 'Success') {
        res.status(400).json({error: status});
        return;
    }

    res.status(201).json("Appointment added successfully");
});

router.put("/:id", async (req, res) => {
    const affectedRows = await service.addOrEditAppointment(req.body, req.params.id)
    if (affectedRows === 0) {
        res.status(404).json("no record found for id " + req.params.id);
    }
    res.send(`Appointment updated successfully`);
});

router.delete("/:id", async (req, res) => {
    const affectedRows = await service.deleteAppointment(req.params.id)

    if (affectedRows === 0) {
        res.status(404).json("no record found for id " + req.params.id);
        return;
    }
    res.send(`Appointment deleted successfully`);
});

module.exports = router;