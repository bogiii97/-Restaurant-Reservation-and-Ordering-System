import mongoose from 'mongoose'

const restaurantSchema = new mongoose.Schema(
    {
        name: String,
        type: String,
        address: String,
        description: String,
        contactPerson: String,
        picture: String,
        workingHours: Array,
        layout: Object,
        menu: Array,
        waiters: Array
    },{
      versionKey:false  
    }
);

export default mongoose.model('RestaurantModel', 
restaurantSchema, 'restaurants');