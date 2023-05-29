const router=require("express").Router()
const controller=require("../controllers/media")
const auth=require("../middleware/auth")

router.post("/sendmedia/:groupid",auth.authenticate,controller.postmedia)

module.exports=router