const express = require('express'),
    app = express(),
    bodyParser = require('body-parser');
require('express-async-errors');

const db = require('./src/config/db/db.config.js'),
    secretaryRoutes = require('./src/controllers/secretary.controller.js'),
    doctorRoutes = require('./src/controllers/doctor.controller.js'),
    patientRoutes = require('./src/controllers/patient.controller.js'),
    appointmentRoutes = require('./src/controllers/appointment.controller.js'),
    doctorSecretaryRoutes = require("./src/controllers/doctorSecretary.controller.js");


const port = 3000;

//middleware
app.use(bodyParser.json());

app.use('/api/secretaries', secretaryRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use("/api/doctorSecretary", doctorSecretaryRoutes);

app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).send('Something broke! ' + err.message);
})

db.query('SELECT 1')
    .then(() => {
        console.log('db connection succeeded');
        app.listen(port,
            () => console.log(`Server listening on port ${port}`));
    })
    .catch(error => console.error('Error connecting to the database:', error));