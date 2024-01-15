"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    gender: {
        type: String
    },
    location: {
        type: String
    },
    facebookLink: {
        type: String
    },
    description: {
        type: String
    },
    accessToken: {
        type: String
    },
    avatar: {
        type: String
    }
}, { timestamps: true });
module.exports = mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=User.js.map