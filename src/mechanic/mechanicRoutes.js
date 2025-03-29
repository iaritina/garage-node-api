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


module.exports = router;