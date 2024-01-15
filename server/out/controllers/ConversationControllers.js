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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImage = exports.updateConversation = exports.getConversation = exports.unBlockConversation = exports.blockConversation = exports.deleteConversation = exports.createConversation = void 0;
const UserControllers_1 = require("./UserControllers");
const Conversation = require('../models/Conversation');
const User = require('../models/User');
const Message = require('../models/Message');
const createConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, receiverEmail } = req.body;
        const receiver = yield User.findOne({ email: receiverEmail });
        if (!receiver) {
            res.status(401).json('Not found');
        }
        else {
            const receiverId = receiver._id.toString();
            const conversationCheck = yield Conversation.findOne({ members: { $all: [senderId, receiverId] } });
            if (conversationCheck) {
                res.status(409).json('Conversation co roi');
            }
            else {
                const newConversation = new Conversation({
                    members: [senderId, receiverId],
                    createdBy: senderId
                });
                const savedConversation = yield newConversation.save();
                res.status(200).json(savedConversation);
            }
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.createConversation = createConversation;
const deleteConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.params;
    const { userId } = req.body;
    const conversation = yield Conversation.findOne({ _id: conversationId });
    if (conversation) {
        const deletedByIndex = conversation.deletedBy.findIndex((item) => item.userId === userId);
        if (deletedByIndex !== -1) {
            conversation.deletedBy[deletedByIndex].deletedAt = new Date();
        }
        else {
            conversation.deletedBy.push({ userId, conversationId, deletedAt: new Date() });
        }
        yield conversation.save();
        res.status(201).json('OK');
    }
    else {
        res.status(404).json('Conversation not found');
    }
});
exports.deleteConversation = deleteConversation;
const blockConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.params;
    const { userId } = req.body;
    const conversation = yield Conversation.findOne({ _id: conversationId });
    if (conversation) {
        if (!conversation.blockedByUser) {
            conversation.blockedByUser = userId;
            yield conversation.save();
            res.status(201).json('OK');
        }
    }
    else {
        res.status(404).json('Conversation not found');
    }
});
exports.blockConversation = blockConversation;
const unBlockConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.params;
    const conversation = yield Conversation.findOne({ _id: conversationId });
    if (conversation) {
        conversation.blockedByUser = '';
        yield conversation.save();
        res.status(201).json('OK');
    }
    else {
        res.status(404).json('Conversation not found');
    }
});
exports.unBlockConversation = unBlockConversation;
const getConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const query = ((_a = req.query) === null || _a === void 0 ? void 0 : _a.searchValue) || '';
    const status = (_b = req.query) === null || _b === void 0 ? void 0 : _b.status;
    try {
        const ids = yield User.distinct('_id', {
            $and: [{ username: { $regex: query, $options: 'i' } }, { _id: { $ne: req.params.userId } }]
        });
        const stringIds = ids.map((objectId) => objectId.toString());
        let matchConditions = [
            {
                $and: [{ members: { $in: [req.params.userId] } }, { members: { $in: stringIds } }]
            }
        ];
        if (status === 'pending') {
            matchConditions.push({
                $and: [
                    {
                        status: 'pending'
                    },
                    {
                        createdBy: { $ne: req.params.userId }
                    }
                ]
            });
        }
        else {
            matchConditions.push({
                $or: [{ createdBy: req.params.userId }, { status: 'accept' }]
            });
        }
        if (query) {
            matchConditions.push({
                _id: {
                    $in: yield Message.distinct('conversationId', {
                        text: { $regex: query, $options: 'i' }
                    })
                }
            });
        }
        const conversation = yield Conversation.aggregate([
            {
                $match: {
                    $and: matchConditions
                }
            },
            {
                $addFields: {
                    lastMessageCreatedAt: '$lastMessage.createdAt'
                }
            },
            {
                $match: {
                    $or: [
                        { deletedBy: { $exists: false } },
                        {
                            deletedBy: {
                                $not: {
                                    $elemMatch: { userId: req.params.userId }
                                }
                            }
                        },
                        {
                            $expr: {
                                $anyElementTrue: {
                                    $map: {
                                        input: '$deletedBy',
                                        as: 'deleted',
                                        in: {
                                            $and: [
                                                { $eq: ['$$deleted.userId', req.params.userId] },
                                                { $lt: ['$$deleted.deletedAt', '$lastMessageCreatedAt'] } //less than
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        ]);
        res.status(200).json(conversation);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});
exports.getConversation = getConversation;
const updateConversation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { conversationId } = req.params;
    const fieldToUpdate = req.body;
    if ((fieldToUpdate === null || fieldToUpdate === void 0 ? void 0 : fieldToUpdate.status) === 'accept') {
        const convsersation = yield Conversation.findOne({ _id: conversationId });
        (0, UserControllers_1.addFriend)(convsersation.members[0], convsersation.members[1]);
    }
    try {
        yield Conversation.findOneAndUpdate({ _id: conversationId }, fieldToUpdate);
        res.status(201).json('OK');
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.updateConversation = updateConversation;
const getImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const image_URL = (_d = (_c = process.env.IMAGES) === null || _c === void 0 ? void 0 : _c.split(',')) === null || _d === void 0 ? void 0 : _d.join('|');
    try {
        const messages = yield Message.find({
            conversationId: req.query.conversationId,
            text: {
                $regex: image_URL,
                $options: 'i'
            }
        }).lean();
        const senderIds = messages.map((message) => message.sender);
        const senders = yield User.find({ _id: { $in: senderIds } }).lean();
        const messagesWithUserInfo = messages.map((message) => {
            const senderInfo = senders.find((sender) => sender._id.toString() === message.sender);
            return {
                _id: message._id,
                text: message.text,
                conversationId: message.conversationId,
                createdAt: message.createdAt,
                senderInfo: {
                    _id: senderInfo._id,
                    username: senderInfo.username
                }
            };
        });
        res.status(200).json(messagesWithUserInfo);
    }
    catch (err) {
        res.status(500).json({ error: 'An error occurred' });
    }
});
exports.getImage = getImage;
//# sourceMappingURL=ConversationControllers.js.map