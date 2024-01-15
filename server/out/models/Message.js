"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MessageSchema = new mongoose_1.default.Schema({
    conversationId: { type: String },
    sender: { type: String },
    text: { type: String },
    deletedBy: [
        {
            userId: {
                type: String
            },
            deletedAt: {
                type: Date
            }
        }
    ],
    isPin: {
        type: Boolean,
        default: false
    },
    status: { type: String, default: 'unseen' }
}, { timestamps: true });
module.exports = mongoose_1.default.model('Message', MessageSchema);
//# sourceMappingURL=Message.js.map