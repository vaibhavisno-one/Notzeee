import mongoose, {Schema} from "mongoose";


const userSchema = new Schema({


    username:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        index:true,
        lowercase:true,
        
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,

    },
    fullname:{
        type:String,
        required:true,
        trim:true,
    },
    isStudent:{
        type:Boolean,
        default:true,
        required:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        min:"8",
        max:"32",
    },

    refreshToken:{
        type:String,
    }
},
{
    timestamps:true
}
)

export const User = mongoose.model("User",userSchema)




userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password,10)
    next()
})


userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}