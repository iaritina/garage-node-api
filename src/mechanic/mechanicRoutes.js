const router = require("express").Router();
const mechanic = require("./mechanicService");


router.get("/:mechanic/:date", async (req, res) => {
    try {
        const response = await mechanic.getAmountOfCommission(req.params.mechanic, req.params.date);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/vehicle-count/:mechanic/:date", async (req, res) => {
    try {
        const response = await mechanic.countRepairedVehicle(req.params.mechanic, req.params.date);
        res.json(response);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get("/:mechanic", async (req, res) => {
    console.log("tonga ato");
    try {
        const response = await mechanic.countSerivceByMechanic(req.params.mechanic);
        res.json(response);
    } catch (error) {
        res.status(500).json({error: error});
    }
});

module.exports = router;