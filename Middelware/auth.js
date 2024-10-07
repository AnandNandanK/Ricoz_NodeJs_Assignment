import jwt from "jsonwebtoken";

export const isAuthenticated=async(req,res,next)=>{
    try {

        const token = req.cookies.token;
        // console.log("PRINTING TOKEN...",token);

        if (!token) {
            return res.status(400).json({
                message:"user is not authenticated",
                success:false
            })
        }

        //verifying token is matching or not
        const decodeToken=await jwt.verify(token,process.env.SECRET_KEY);

        if (!decodeToken) {
            return res.status(400).json({
                message:"invalid Token",
                success:false
            })
        }

        console.log("PRINTING DECODE TOKEN......", decodeToken)

        //storing user id in reqest so that we can access logged in user globally
        req.id=decodeToken.id;

        //calling next() function for calling next api in route 
        next();
        
    } catch (error) {
        console.log(error)
    }
}