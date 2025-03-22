const router = require("express").Router();
const interventionService = require("./intervetionService");

router.post("/", async (req, res) => {
    try 
    {
        const interventionData = req.body;
        const intervention  = await interventionService.createIntervention(interventionData);
        res.status(201).json(intervention);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

module.exports = router;