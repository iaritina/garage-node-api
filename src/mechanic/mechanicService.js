const User = require("../users/userModel")
const Appointment = require("../appointment/appointmentModel")
const Service = require("../service/serviceModel")

const getAmountOfCommission = async (mechanic, date) => {
    try {
        const start = new Date(date);
        const end = new Date(date);

        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);

        const appointments = await Appointment.find({
            mechanic: mechanic,
            date: { $gte: start, $lte: end },
            status: true,
            isCanceled: false
        });

        console.log("appointments",appointments);

        let totalCommission = 0;

        for(const appointment of appointments) {
            for(const prestation of appointment.prestations) {
                const service = await Service.findById(prestation.service);
                console.log("service",service);
                if(service && service.commission) {
                    totalCommission += (parseFloat(prestation.price) * service.commission);
                }
            }
        }

        return totalCommission;

    } catch (error) {
        throw new Error("Error: ",error.message);
    }
}


const countRepairedVehicle = async (mechanic, date) => {
    try {
        const start = new Date(date);
        const end = new Date(date);

        start.setHours(0,0,0,0);
        end.setHours(23,59,59,999);

        const appointments = await Appointment.find({
            mechanic: mechanic,
            date: { $gte: start, $lte: end },
            status: true,
            isCanceled: false
        });    

        return appointments.length;

    } catch (error) {
        throw new Error("Error: ",error.message);
    }
    
}

const countSerivceByMechanic = async (mechanic) => {
    console.log("mechanic",mechanic);
    try {
        const appointments = await Appointment.find({
            mechanic: mechanic,
            status: true,
            isCanceled: false
        });
        console.log("appointments",appointments);

        const serviceCount = {};

        for (const appointment of appointments) {
            for (const prestation of appointment.prestations) {
            const service = await Service.findById(prestation.service);
            if (service) {
                serviceCount[service.name] = (serviceCount[service.name] || 0) + 1;
            }
            }
        }

        return serviceCount;
    } catch (error) {
        throw new Error("Error",error.message);
    }
}


module.exports = {
    getAmountOfCommission,
    countRepairedVehicle,
    countSerivceByMechanic
}