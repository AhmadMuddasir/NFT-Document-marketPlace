

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
     name:{
          type:String,
          required:[true,"write your name"],
     },
     email:{
         type:String,
         required:[true,"please provide email"],
         unique:true,
         lowercase:true,
     },
     role:{
          type:String,
          enum:["user","admin"],
          default:"user",
     },
     password:{
          type:String,
          required:[true,"please provide password"],

     },
     passwordConfirm:{
          type:String,
          required:[true,"confirm password"],
          validate:{
               validator:function(el){
                    return el === this.password
               },
               message:"incorrect Password",
          }
     }

});

userSchema.pre("save",async function(next){
     //only run this f() if the password was actually modified
     if(!this.isModified("password")) return next();

     //hash the password
     this.password = await bcrypt.hash(this.password,12);

     //delete confirm password
     this.passwordConfirm = undefined;
     next();
});

userSchema.pre("save", function(next){
     if(!this.isModified("password") || this.isNew) return next(); //this.isNew: Checks if the document is new (i.e., being created for the first time).

    

     this.passwordChanged = Date.now() - 1000;
     next();
});

userSchema.pre(/^find/,function(next){
     this.find({active:{$ne:false}});
     next();
});

userSchema.methods.correctPassword  = async function(
     candidatePassword,
     userPassword
){
     return await bcrypt.compare(candidatePassword,userPassword)
}

userSchema.methods.changePasswordAfter = function (JWTTimestamp){
     if(this.passwordChangedAt){
          const changedTimestamp = parseInt(
               this.passwordChanged.getTime() / 1000,
               10
          );
          return JWTTimestamp < changedTimestamp;
     }
     //false means not changed
     return false;
}

const User = mongoose.model("User",userSchema);

module.exports = User;

