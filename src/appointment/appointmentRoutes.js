const router = require("express").Router();
const appointmentService = require("./appointmentService");

router.post("/", async (req, res) => {
  try {
    const data = await appointmentService.saveAppointmentManually(req.body);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
