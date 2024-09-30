import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username: String,
        password: String,
        securityQuestion: String,
        securityAnswer: String,
        firstname: String,
        lastname: String,
        gender: String,
        address: String,
        phone: String,
        email: String,
        profilePicture: String,
        creditCardNumber: String,
        type: String,
        status: String,
        restaurant: String,
        numberOfNotComing: Number
    },{
      versionKey:false  
    }
);

export default mongoose.model('UserModel', 
userSchema, 'users');