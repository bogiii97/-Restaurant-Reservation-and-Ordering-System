"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const statisticSchema = new mongoose_1.default.Schema({
    restaurant: String,
    waiter: String,
    date: Date,
    guestCount: Number
}, {
    versionKey: false
});
exports.default = mongoose_1.default.model('StatisticModel', statisticSchema, 'statistics');
