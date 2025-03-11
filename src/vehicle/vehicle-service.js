const vehicleModel = require("./vehicle-model");

const getAllVehicle = async() => {
    try 
    {
        return await vehicleModel.find({})
            .populate("user")
            .populate({
                path: "model",
                populate: {
                    path: "brand",
                }
            });     
    } 
    catch (error) 
    {
        throw new Error("Error: ",error.message);    
    }
}

const getVehicleByUser = async (id) => {
    try {
        return await vehicleModel.find({ user: id })
            .populate("user") 
            .populate({
                path: "model",
                populate: {
                    path: "brand", 
                }
            });
    } catch (error) {
        throw new Error(`Error: ${error.message}`);    
    }
};


const getVehicleById = async (id) => {
    try 
    {
        return await vehicleModel.findById(id).populate("user") 
        .populate({
            path: "model",
            populate: {
                path: "brand", 
            }
        });
    } 
    catch (error) 
    {
        throw new Error("Error: ",error.message);    
    }
}

const createVehicle = async (vehicle) => {
    try 
    {
        return await vehicleModel.create(vehicle);
    } 
    catch (error) 
    {
        throw new Error("Error: ",error.message);    
    }
}

const updateVehicle = async (id,vehicle) => {
    try 
    {
        return await vehicleModel.findByIdAndUpdate(id,vehicle, {new: true});
    } 
    catch (error) 
    {
        throw new Error("Error: ",error.message);
    }
}


const deleteVehicle = async (id) => {
    try 
    {
        return await vehicleModel.findByIdAndUpdate(
            id,
            {$set: {isDeleted: true}},
            {new: true}
        );
    } 
    catch (error) 
    {
        throw new Error("Error: ",error.message);    
    }
}

module.exports = {
    getAllVehicle,
    getVehicleByUser,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
}