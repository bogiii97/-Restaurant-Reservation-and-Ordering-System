import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
    {
        _id: mongoose.Schema.Types.ObjectId,
        firstname: String,
        lastname: String,
        username: String,
        restaurant: String,
        orderItems: Array,
        totalPrice: Number,
        deliveryAddress: String,
        status: String,
        deliveredDate: Date,
        confirmDate: Date,
        createdDate: Date,
        estimatedTime: String,
        rejectReason: String,
        phoneNumber: String
    },{
      versionKey:false  
    }
);

export default mongoose.model('OrderModel', 
orderSchema, 'orders');