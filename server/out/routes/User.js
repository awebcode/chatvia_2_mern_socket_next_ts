"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserControllers_1 = require("../controllers/UserControllers");
const router = require('express').Router();
router.get('/', UserControllers_1.getUserById);
router.get('/friendList', UserControllers_1.getListFriend);
router.post('/updateInformation', UserControllers_1.updateInformation);
module.exports = router;
//# sourceMappingURL=User.js.map