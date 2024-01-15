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
exports.getListFriend = exports.updateInformation = exports.addFriend = exports.getUserById = void 0;
const User = require('../models/User');
const Friend = require('../models/Friend');
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const userId = (_a = req.query) === null || _a === void 0 ? void 0 : _a.userId;
        const username = (_b = req.query) === null || _b === void 0 ? void 0 : _b.username;
        const user = userId ? yield User.findById(userId) : yield User.findOne({ username: username });
        const _c = user._doc, { password } = _c, other = __rest(_c, ["password"]);
        res.status(200).json(other);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.getUserById = getUserById;
const getUsersByIdList = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.find({ _id: { $in: ids } }, { password: 0, accessToken: 0 });
    return users;
});
const addFriend = (userId, friendId) => __awaiter(void 0, void 0, void 0, function* () {
    const friend = new Friend({
        userId,
        friendId,
        status: 'success'
    });
    yield friend.save();
});
exports.addFriend = addFriend;
const updateInformation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const userId = (_d = req.query) === null || _d === void 0 ? void 0 : _d.userId;
        const information = req.body;
        const user = yield User.findOneAndUpdate({ _id: userId }, information);
        const _e = user._doc, { password } = _e, other = __rest(_e, ["password"]);
        res.status(201).json(other);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.updateInformation = updateInformation;
const getListFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const userId = (_f = req.query) === null || _f === void 0 ? void 0 : _f.userId;
        const searchValue = ((_g = req.query) === null || _g === void 0 ? void 0 : _g.searchValue) || '';
        const friends = yield Friend.find({
            friendId: {
                $in: yield User.distinct('_id', {
                    username: { $regex: searchValue, $options: 'i' }
                })
            },
            $or: [{ userId: userId }, { friendId: userId }],
            status: 'success'
        });
        const friendIds = friends.map((friend) => {
            if (friend.friendId !== userId) {
                return friend.friendId;
            }
            return friend.userId;
        });
        const friendInformation = yield getUsersByIdList(friendIds);
        res.json(friendInformation);
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.getListFriend = getListFriend;
//# sourceMappingURL=UserControllers.js.map