const { Router } = require("express");
const router = Router();

const currentUser = require("../controllers/sessions.controller");

//GET api/sessions/current
router.get("/sessions/current", currentUser);

module.exports = router;
