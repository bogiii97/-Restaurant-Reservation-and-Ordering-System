"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('OrderModel', orderSchema, 'orders');
