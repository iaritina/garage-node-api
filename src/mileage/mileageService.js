const Mileage = require('./mileageModel');

async function create(mileage) {
    try {
        return await Mileage.create(mileage);
    } catch (error) {
        throw new Error("Error: ",error.message);
    }
}

module.exports = {
    create,
}