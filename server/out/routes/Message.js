"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const MessageControllers_1 = require("../controllers/MessageControllers");
const router = (0, express_1.default)();
router.post('/', MessageControllers_1.createMessage);
router.get('/:conversationId', MessageControllers_1.getMessageByConversationId);
router.post('/delete/:messageId', MessageControllers_1.deleteMessage);
router.post('/pin/:messageId', MessageControllers_1.pinMessage);
router.post('/unpin/:messageId', MessageControllers_1.unpinMessage);
module.exports = router;
//# sourceMappingURL=Message.js.map