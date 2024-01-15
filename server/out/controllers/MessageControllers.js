"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageByConversationId = exports.unpinMessage = exports.pinMessage = exports.deleteMessage = exports.createMessage = void 0;
const Message = require('../models/Message');
const Conversation = require('../models/Conversation');
const createMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const message = new Message(req.body);
    try {
        const savedMessage = yield message.save();
        try {
            yield Conversation.findOneAndUpdate({ _id: savedMessage.conversationId }, {
                $set: {
                    lastMessage: {
                        id: savedMessage.sender,
                        text: savedMessage.text,
                        createdAt: savedMessage.createdAt
                    }
                }
            });
        }
        catch (error) {
            console.log(error);
        }
        res.status(201).json(savedMessage);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.createMessage = createMessage;
const deleteMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        const { messageId } = req.params;
        yield Message.updateOne({ _id: messageId }, { $push: { deletedBy: { userId, deletedAt: new Date() } } });
        res.status(201).json('OK');
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.deleteMessage = deleteMessage;
const pinMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    const { isPin } = yield Message.findOne({ _id: messageId });
    if (!isPin) {
        yield Message.updateOne({ _id: messageId }, { isPin: true });
    }
    res.status(201).json('OK');
});
exports.pinMessage = pinMessage;
const unpinMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { messageId } = req.params;
    yield Message.updateOne({ _id: messageId }, { isPin: false });
    res.status(201).json('OK');
});
exports.unpinMessage = unpinMessage;
const getMessageByConversationId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _a = req.query, { userId } = _a, filter = __rest(_a, ["userId"]);
        const lastDeletedConversation = yield Conversation.findOne({
            _id: req.params.conversationId
        }).select('deletedBy');
        const result = lastDeletedConversation === null || lastDeletedConversation === void 0 ? void 0 : lastDeletedConversation.deletedBy.find((item) => item.userId === userId);
        const messages = yield Message.find(Object.assign(Object.assign({ conversationId: req.params.conversationId, deletedBy: { $not: { $elemMatch: { userId: userId } } } }, ((result === null || result === void 0 ? void 0 : result.deletedAt) && {
            createdAt: { $gt: result.deletedAt }
        })), (filter && filter))).lean();
        res.status(201).json(messages);
    }
    catch (err) {
        console.error('Error querying messages:', err);
        res.status(500).json(err);
    }
});
exports.getMessageByConversationId = getMessageByConversationId;
//# sourceMappingURL=MessageControllers.js.map