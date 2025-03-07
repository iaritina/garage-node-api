const Service = require("./serviceModel");
require("dotenv").config();

const createService = async (service) => {
    try 
    {
        return await Service.create(service);
    } 
    catch (error) 
    {
        throw new Error("Error: "+ error.message);    
    }
};


const getAll = async () => {
    const services = await Service.find({});
    return services;
}

const getById = async (id) => {
    const service = await Service.findById(id);
    return service;
}

const update = async (id,data) => {
    const service = await Service.findByIdAndUpdate(
        id,
        data,
        {new: true, runValidators: true}
    );
    if(!service) return {message: "Service not found"};
    return service;
}

const deleteService = async (id) => {
    const service = await Service.findByIdAndDelete(id);
    if(!service) return {message: "Service not found"};
    return "Service supprimer";
}


module.exports = {
    createService,
    getAll,
    getById,
    update,
    deleteService,
}
