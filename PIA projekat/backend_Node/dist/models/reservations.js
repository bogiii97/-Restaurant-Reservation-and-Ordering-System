"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reservationSchema = new mongoose_1.default.Schema({
    _id: mongoose_1.default.Schema.Types.ObjectId,
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
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('ReservationModel', reservationSchema, 'reservations');
