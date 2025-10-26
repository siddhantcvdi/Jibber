import { asyncHandler } from '@/utils/asyncHandler';
import { ResponseUtil } from '@/utils/response';
import { IUser, User } from '@/models/user.model';
import { AuthRequest } from '@/types';

export const findUser = asyncHandler(async (req: AuthRequest, res)=>{
  const query = req.query.query as string; // Parameter name -> query
  if(!query || query.trim().length === 0) {
    return ResponseUtil.error(res, "No search query found.");
  }

  const safeRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const users = await User.find({
    $and: [
      { _id: { $ne: req.user!._id } },
      { $or: [{ username: safeRegex }, { email: safeRegex }] }
    ]  }) // Do not return own account in response.
    .limit(10)
    .select('username email profilePhoto');

  return ResponseUtil.success(res, "User found", users);

});

export const updateImage = asyncHandler(async (req: AuthRequest, res)=>{
  const {url} = req.body;
  const user = req.user?._id;
  if(!url || url.trim().length === 0) {
    return ResponseUtil.error(res, "No valid profile url provided");
  }

  const updatedUser = await User.findByIdAndUpdate(
    user,
    { profilePhoto: url.trim() },
    { new: true, select: 'username email profilePhoto' }
  );

  if(!updatedUser) {
    return ResponseUtil.error(res, "Error updating user: User not found", undefined, 404);
  }

  return ResponseUtil.success(res, "Profile photo updated", updatedUser);
})