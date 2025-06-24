import {User} from '../models/user.model.js';
import asyncHandler from '../utils/asyncHandler.js';
import { successResponse, errorResponse } from '../utils/response.js';

const findUsers = asyncHandler(async (req, res) => {
  const query = req.query.query;

  if (!query || query.trim().length === 0) {
    return successResponse(res, {
      message: 'No search query provided',
      data: [],
    });
  }
  const safeRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const users = await User.find({
    $or: [{ username: safeRegex }, { email: safeRegex }],
  })
    .limit(10)
    .select('username email profilePhoto');
  return successResponse(res, {
    message: 'Users found',
    data: users,
  });
});

export const updateImage = asyncHandler(async(req, res)=> {
  const {url} = req.body;
  const user = req.user.userId;
  
  if (!url) {
    return errorResponse(res, 'URL is required', 400);
  }
  
  const updatedUser = await User.findByIdAndUpdate(
    user, 
    { profilePhoto: url }, 
    { new: true, select: 'username email profilePhoto' }
  );
  
  if (!updatedUser) {
    return errorResponse(res, 'User not found', 404);
  }
  
  return successResponse(res, {
    message: "Profile Photo Updated Successfully", 
    data: updatedUser
  });
})

export { findUsers };
