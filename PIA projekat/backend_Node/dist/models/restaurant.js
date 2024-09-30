"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const restaurantSchema = new mongoose_1.default.Schema({
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
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('RestaurantModel', restaurantSchema, 'restaurants');
