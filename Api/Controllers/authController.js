const jwt = require("jsonwebtoken");
const User = require("../Model/userModel");
require("dotenv").config();

const   signToken = (id)=>{
     return jwt.sign({id},process.env.NEXT_PUBLIC_JWT_SECRET,{
          expiresIn:process.env.NEXT_PUBLIC_JWT_EXPIRES_IN,
     });
     
};



const createSendToken = (user,statuscode,req,res)=>{

     const token = signToken(user._id);
     
  // Fix the expires option - convert to milliseconds properly
  const cookieOptions = {
     expires: new Date(
       Date.now() + process.env.NEXT_PUBLIC_JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
     ),
     httpOnly: true,
     secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
   };
 
   res.cookie('jwt', token, cookieOptions);
     //Remove the password
     user.password = undefined;//the password will store in database but the response will undefine
     res.status(statuscode).json({
          status:"success",
          token,
          data:{
               user,
          },
     });

};



exports.signUp = async(req,res,next)=>{
     try {
          
     
          const newUser = await User.create({
               name:req.body.name,
               email:req.body.email,
               password:req.body.password,
               passwordConfirm:req.body.passwordConfirm,
     
          });
          createSendToken(newUser,201,req,res);
     } catch (error) {
          console.log(error)
     }

}



exports.login = async(req,res,next)=>{
     try {
          
     
          const {email,password} = req.body;
     
          //check if email and password exist!
          if(!email || !password){
               res.status(400).json({
                    status:"fail",
                    message:"please provide email and passaword",
               });
          }
          //check if the user exist and the passaowrd is correct
          const user = await User.findOne({email}).select("+password");
     
          if(!user || !(await user.correctPassword(password,user.password))){
               res.status(401).json({
                    status:"fail",
                    message:"Incorrect email or password",
               });
               
          }
          // if every thing is ok send token to the client
     
          createSendToken(user,200,req,res);
     } catch (error) {
          console.log(error);
     }

}


