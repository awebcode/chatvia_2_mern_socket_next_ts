"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthControllers_1 = require("../controllers/AuthControllers");
const router = require('express').Router();
router.post('/register', AuthControllers_1.register);
router.post('/login', AuthControllers_1.login);
router.post('/me', AuthControllers_1.getUser);
module.exports = router;
//# sourceMappingURL=Auth.js.map