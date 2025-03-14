const Product = require("./productModel");
require("dotenv").config();

const getAllProduct = async() => {
    try 
    {
        return await Product.find({isDeleted: false}).populate('service');       
    } 
    catch (error) 
    {
        throw new Error("Error: ",error.message);    
    }
}


const getProductById = async(id) => {
    try {
        return await Product.findById(id);
    } catch (error) {
        throw new Error("Error: ",error.message);
    }
}

const createProduct = async(product) => {
    try {
        return await Product.create(product);
    } catch (error) {
        throw new Error("Error: ",error.message);
    }
}

const getProductByService = async(service) => {
    try {
        return await Product.find({service: service,isDeleted: false});
    } catch (error) {
        throw new Error("Error: ",error.message);
    }
}

const deleteProduct = async(id) => {
    try {
        return await Product.findByIdAndUpdate(
            id,
            {$set: {isDeleted: true}},
            {new: true}
        );
    } catch (error) {
        throw new Error("Error: ",error.message);
    }
}


const updateProduct = async(id, product) => {
    try {
        return await Product.findByIdAndUpdate(id, product, {new: true});
    } catch (error) {
        throw new Error("Error", error.message);
    }
}


module.exports = {
    getAllProduct,
    getProductById,
    createProduct,
    getProductByService,
    deleteProduct,
    updateProduct,
}