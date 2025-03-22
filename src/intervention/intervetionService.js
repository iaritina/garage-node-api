const Intervention = require("./interventionModel");


async function createIntervention(data) {
    try {
        const intervention = new Intervention(data);
        await intervention.save();
        return intervention;
    } catch (error) {
        console.error("Erreur lors de la creation de l intervention: ",error);
        throw new Error("Impossible de creer l intervention");
    }
}

module.exports = { createIntervention };