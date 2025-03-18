    const router = require("express").Router();
    const appointmentService = require("./appointmentService");

    router.get("/", async (req, res) => {
        try {
            const { serviceId, date, time } = req.query;
            const mechanics = await appointmentService.getAvailableMechanics(serviceId,date,time);
            res.json(mechanics);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    module.exports = router;