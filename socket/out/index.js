"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = __importDefault(require("http"));
var express_1 = __importDefault(require("express"));
var socket_io_1 = require("socket.io");
var cors_1 = __importDefault(require("cors"));
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
var server = http_1.default.createServer(app);
var io = new socket_io_1.Server(server);
var users = [];
var handleAddUser = function (id, socketId) {
    if (!users.some(function (user) { return user.userId === id; })) {
        users.push({ userId: id, socketId: socketId });
    }
};
var removeUser = function (socketId) {
    users = users.filter(function (user) { return user.socketId !== socketId; });
};
var getUser = function (id) {
    return users.find(function (user) { return user.userId === id; });
};
io.on("connection", function (socket) {
    socket.on("addUser", function (id) {
        handleAddUser(id, socket.id);
        io.emit("getUsers", users);
        console.log("A user connected! There are ".concat(users.length, " in group chat!"));
    });
    socket.on("sendMessage", function (_a) {
        var senderId = _a.senderId, receiverId = _a.receiverId, text = _a.text, conversationId = _a.conversationId, conversationStatus = _a.conversationStatus;
        console.log("Text sent");
        var user = getUser(receiverId);
        io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("getMessage", {
            conversationId: conversationId,
            senderId: senderId,
            text: text,
            conversationStatus: conversationStatus,
        });
        socket.emit("self_getMessage", {
            conversationId: conversationId,
            senderId: senderId,
            text: text,
            conversationStatus: conversationStatus,
        });
    });
    socket.on("changeIcon", function (_a) {
        var icon = _a.icon, receiverId = _a.receiverId, conversationId = _a.conversationId;
        console.log("Icon change");
        var user = getUser(receiverId);
        io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("getIconChanged", {
            icon: icon,
            conversationId: conversationId,
        });
    });
    socket.on("blockConversation", function (_a) {
        var conversationId = _a.conversationId, senderId = _a.senderId, receiverId = _a.receiverId;
        console.log("Block conversation");
        var user = getUser(receiverId);
        io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("getBlockedConversation", {
            conversationId: conversationId,
            senderId: senderId,
        });
    });
    socket.on("unBlockConversation", function (_a) {
        var conversationId = _a.conversationId, receiverId = _a.receiverId;
        console.log("Unblock conversation");
        var user = getUser(receiverId);
        io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("getBlockedConversation", {
            conversationId: conversationId,
            senderId: "",
        });
    });
    socket.on("createConversation", function (_a) {
        var receiverId = _a.receiverId, remain = __rest(_a, ["receiverId"]);
        var user = getUser(receiverId);
        console.log("Create conversation");
        io.to(user === null || user === void 0 ? void 0 : user.socketId).emit("getConversation", remain);
    });
    socket.on("disconnect", function () {
        console.log("User disconnected x!");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
var port = 5000;
server.listen(port, function () {
    console.log("Socket Server is running on port ".concat(port));
});
app.get("/", function (_, res) {
    res.json("K");
});
