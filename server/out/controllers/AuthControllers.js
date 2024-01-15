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
exports.getUser = exports.login = exports.register = void 0;
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const generateTokens = (payload) => {
    const { _id, username } = payload;
    const accessToken = jwt.sign({ _id: _id.toString(), name: username }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '48h'
    });
    return { accessToken };
};
const updateToken = (id, accessToken) => __awaiter(void 0, void 0, void 0, function* () {
    yield User.findOneAndUpdate({ _id: id.toString() }, { accessToken: accessToken }, {
        new: true
    });
});
const verify = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        return { valid: true, expired: false, decoded };
    }
    catch (error) {
        let msg;
        if (error instanceof Error) {
            msg = error.message;
        }
        else {
            msg = error;
        }
        return {
            valid: false,
            expired: msg === 'jwt expired',
            msg: msg,
            decoded: null
        };
    }
};
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(req.body);
        const user = yield User.findOne({ email: req.body.email }).lean();
        if (user) {
            res.status(400).json('Already has user');
        }
        else {
            const salt = yield bcrypt.genSalt(10);
            const hashedPassword = yield bcrypt.hash((_a = req.body) === null || _a === void 0 ? void 0 : _a.password, salt);
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
                accessToken: ''
            });
            yield newUser.save();
            res.status(201).json('OK');
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const user = yield User.findOne({ email: (_b = req.body) === null || _b === void 0 ? void 0 : _b.email }).lean();
        if (!user) {
            res.status(401).json('User not found');
        }
        bcrypt.compare(req.body.password, user.password, (err, hash) => {
            if (err || !hash) {
                res.status(403).send('Password does not match');
            }
            else {
                const token = generateTokens(user);
                updateToken(user._id, token.accessToken);
                res.status(200).json({ token, id: user._id.toString(), avatar: (user === null || user === void 0 ? void 0 : user.avatar) || '' });
            }
        });
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.login = login;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.setHeader('Access-Control-Allow-Headers', 'token');
    try {
        const { token } = req.headers;
        if (!token || typeof token !== 'string') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const dataDecode = verify(String(token));
        if (!dataDecode) {
            res.status(500).json('Có lỗi');
        }
        const { _id } = dataDecode === null || dataDecode === void 0 ? void 0 : dataDecode.decoded;
        const user = yield User.findOne({ _id });
        if (!user) {
            res.status(401).json('Not exist');
        }
        else {
            res.status(201).json(user);
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});
exports.getUser = getUser;
//# sourceMappingURL=AuthControllers.js.map