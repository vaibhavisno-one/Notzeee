import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js"
import ApiError from "../utils/ApiError.js"
const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {

        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [
            { username: username.toLowerCase() },
            { email: email.toLowerCase() }
        ]
    });

    if (existedUser) {
        throw new ApiError(400, "User already exists")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        password,
        fullName,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
        throw new ApiError(400, "something went wrong")
    }


    return res.status(201).json({
        success: true,
        data: createdUser,
        message: "User registered successfully"
    });


})

const loginUser = asyncHandler(async(req,res)=>{
    
})

export { registerUser , loginUser}