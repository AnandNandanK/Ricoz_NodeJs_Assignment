import express from "express";
import {createUser,updateUser,loginUser,getLoggedInUser,deleteLoggedInUser,deleteUserByEmail} from "../Controller/userController.js"
import { isAuthenticated } from "../Middelware/auth.js";


//creating new express router
const router=express.Router();


router.post("/register",createUser);
router.get("/login",loginUser);
router.get("/get",getLoggedInUser);
router.delete("/delete",isAuthenticated,deleteLoggedInUser);
router.delete("/deletebyemail",isAuthenticated,deleteUserByEmail);
router.put("/update",isAuthenticated,updateUser);

export default router;