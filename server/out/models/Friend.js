"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FriendSchema = new mongoose_1.default.Schema({
    userId: { type: String },
    friendId: { type: String },
    status: { type: String }
});
module.exports = mongoose_1.default.model('Friend', FriendSchema);
//# sourceMappingURL=Friend.js.map