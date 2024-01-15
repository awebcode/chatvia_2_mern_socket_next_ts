"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importStar(require("mongoose"));
const http = require('http');
const cors_1 = __importDefault(require("cors"));
const application = (0, express_1.default)();
const authRouter = require('./routes/Auth');
const conversationRouter = require('./routes/Conversation');
const messageRouter = require('./routes/Message');
const userRouter = require('./routes/User');
const dotenv = require('dotenv');
dotenv.config();
/** Server Handling */
const httpServer = http.createServer(application);
/** Log the request */
application.use((req, res, next) => {
    console.info(`METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);
    res.on('finish', () => {
        console.info(`METHOD: [${req.method}] - URL: [${req.url}] - STATUS: [${res.statusCode}] - IP: [${req.socket.remoteAddress}]`);
    });
    next();
});
/** Parse the body of the request */
application.use(express_1.default.urlencoded({ extended: true }));
application.use(express_1.default.json());
application.use((0, cors_1.default)({ origin: true, credentials: true }));
// Handle preflight requests
application.options('*', (0, cors_1.default)());
application.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Depth, User-Agent, X-File-Size, X-Requested-With, If-Modified-Since, X-File-Name, Cache-Control, Authorization');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Access-Control-Allow-Credentials', 1);
    next();
});
/** Healthcheck */
application.get('/ping', (_, res, next) => {
    return res.status(200).json({ hello: 'world!' });
});
application.use('/auth', authRouter);
application.use('/users', userRouter);
application.use('/conversations', conversationRouter);
application.use('/messages', messageRouter);
/** Error handling */
application.use((_, res) => {
    const error = new mongoose_1.Error('Not found');
    res.status(404).json({
        message: error.message
    });
});
/** Mongoose connect */
mongoose_1.default
    .connect(process.env.MONGODB_URL)
    .then(() => {
    console.log('Database Connected!');
})
    .catch((err) => {
    throw err;
});
/** Listen */
httpServer.listen(4000, () => console.info(`Server is running`));
//# sourceMappingURL=index.js.map