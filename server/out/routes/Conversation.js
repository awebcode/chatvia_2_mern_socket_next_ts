"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ConversationControllers_1 = require("../controllers/ConversationControllers");
const router = (0, express_1.default)();
router.post('/', ConversationControllers_1.createConversation);
router.get('/image', ConversationControllers_1.getImage);
router.get('/:userId', ConversationControllers_1.getConversation);
router.post('/delete/:conversationId', ConversationControllers_1.deleteConversation);
router.post('/update/:conversationId', ConversationControllers_1.updateConversation);
router.post('/block/:conversationId', ConversationControllers_1.blockConversation);
router.post('/unblock/:conversationId', ConversationControllers_1.unBlockConversation);
module.exports = router;
//# sourceMappingURL=Conversation.js.map