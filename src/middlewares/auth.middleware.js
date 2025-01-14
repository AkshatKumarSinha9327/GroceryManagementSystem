// it will check the user is there or not
import { asyncHandler } from '../utils/asyncHandler.js'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'

export const verifyJWT = asyncHandler(async (req, _, next) => { // using _ because res is not used 
    try {
        // console.log(req.cookies.access_token,"verifyJWT")
        const token = req.cookies?.access_token || req.header("Authorization")?.replace("Bearer", "")

        if (!token) {
            throw new ApiError(401, "Unauthorized request")
        }


        const decodedToken = jwt.verify(token, process.env.ACESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken "
        )
        if (!user) {
            // discuss about frontend
            throw new ApiError(401, "Invalid access token")
        }

        req.user = user;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }

})