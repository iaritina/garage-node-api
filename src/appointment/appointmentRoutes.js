const router = require("express").Router();
const appointmentService = require("./appointmentService");

router.post("/", async (req, res) => {
  const data = await appointmentService.saveAppointment(req.body);
  res.status(200).json(data);
});

module.exports = router;
