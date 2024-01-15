"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ConversationSchema = new mongoose_1.default.Schema({
    createdBy: {
        type: String
    },
    members: {
        type: Array
    },
    lastMessage: {
        id: { type: String },
        text: { type: String },
        createdAt: { type: Date }
    },
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
    emoji: {
        type: String,
        default: '❤️'
    },
    status: {
        type: String,
        default: 'pending'
    },
    blockedByUser: String
}, { timestamps: true });
module.exports = mongoose_1.default.model('Conversation', ConversationSchema);
//# sourceMappingURL=Conversation.js.map