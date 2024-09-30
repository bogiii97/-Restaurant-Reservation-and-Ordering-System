import mongoose from 'mongoose'

const statisticSchema = new mongoose.Schema(
    {
        restaurant: String,
        waiter: String,
        date: Date,
        guestCount: Number
    },{
      versionKey:false  
    }
);

export default mongoose.model('StatisticModel', 
statisticSchema, 'statistics');