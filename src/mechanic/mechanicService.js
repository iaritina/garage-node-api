const User = require("../users/userModel")
const Appointment = require("../appointment/appointmentModel")
const Service = require("../service/serviceModel")

const getAmountOfCommission = async (mechanic, date) => {
    console.log("mechanic",mechanic);
    console.log("date",date);
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


module.exports = {
    getAmountOfCommission
}