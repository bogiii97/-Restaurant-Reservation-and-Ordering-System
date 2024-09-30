import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        username: String,
        firstname: String,
        lastname: String,
        phoneNumber: String,
        restaurant: String,
        restaurantAddress: String,
        date: Date,
        numberOfPeople: Number,
        rejectReason: String,
        additionalRequest: String,
        status: String,
        table: String,
        waiter: String,
        arrived: String,
        extraHour: Boolean
    },{
      versionKey:false  
    }
);

export default mongoose.model('ReservationModel', 
reservationSchema, 'reservations');