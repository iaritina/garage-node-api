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
    try 
    {
        return await Service.find({isDeleted: false});
    } 
    catch (error) 
    {
        throw new Error("Error: ",error.message);
    }
    
}

const getById = async (id) => {
    try 
    {
        return await Service.findById(id);    
    } 
    catch (error) 
    {
        throw new Error("Error: ",error.message);
    }
}

const update = async (id,data) => {
    try 
    {
        return await Service.findByIdAndUpdate(
            id,
            data,
            {new: true, runValidators: true}
        );
    } 
    catch (error) {
        throw new Error("Error: ",error.message);    
    }

}

const deleteService = async (id) => {
    try 
    {
        return await Service.findByIdAndUpdate(
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
    createService,
    getAll,
    getById,
    update,
    deleteService,
}
