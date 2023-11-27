const { Router } = require("express")
const router = Router()

const {
  signup,
  getAllUsers,
  deleteInactiveUsers,
  deleteUser,
  changeUserRole,
} = require("../controllers/user.controller")

router.post("/signup", signup)

router.post("/changeRole/:uid", changeUserRole)

router.get("/getAllUsers", getAllUsers)

router.delete("/deleteInactiveUsers", deleteInactiveUsers)

router.delete("/deleteUser/:uid", deleteUser)

module.exports = router
