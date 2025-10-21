import { ResponseUtil } from '@/utils/response';
import { asyncHandler } from '@/utils/asyncHandler';
import {
  LoginStartParams,
  LoginFinishParams,
  RegisterFinishParams,
  RegisterStartParams,
} from '@/validations/user.validations';
import * as opaque from '@serenity-kit/opaque';
import crypto from 'crypto';
import { User } from '@/models/user.model';
import config from '@/config';
import { LoginState } from '@/models/loginState.model';
import { RefreshJwtPayload, UserType } from '@/types';
import jwt, { SignOptions } from 'jsonwebtoken';

const hashRefreshToken = (token: string) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

const generateJwtTokens = (user: UserType) => {
  const accessToken = jwt.sign(
    { _id: user._id, email: user.email },
    config.jwtAccessSecret,
    { expiresIn: config.accessJwtExpiresIn! }
  );

  const refreshToken = jwt.sign({ _id: user._id }, config.jwtRefreshSecret, {
    expiresIn: config.refreshJwtExpiresIn!,
  });

  return { accessToken, refreshToken };
};

const registerStart = asyncHandler(async (req, res) => {
  let username, email, registrationRequest;
  // Parameter extraction and validation
  try {
    const values = RegisterStartParams.parse(req.body);
    username = values.username;
    email = values.email;
    registrationRequest = values.registrationRequest;
  } catch (e) {
    return ResponseUtil.error(
      res,
      'Input Validation Failed while Starting Registration'
    );
  }

  // Check if same email exists
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return ResponseUtil.error(res, 'Email already exists', undefined, 400);
  }

  // Check if same username exists
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return ResponseUtil.error(res, 'Username already exists', undefined, 400);
  }

  // Return OPAQUE registration response
  const serverSetup = config.serverSetup;
  const { registrationResponse } = opaque.server.createRegistrationResponse({
    serverSetup,
    userIdentifier: email,
    registrationRequest,
  });

  return ResponseUtil.success(
    res,
    'Registration started successfully',
    registrationResponse
  );
});

const registerFinish = asyncHandler(async (req, res) => {
  let values;
  try {
    values = RegisterFinishParams.parse(req.body);
  } catch (err) {
    return ResponseUtil.error(
      res,
      'Input Validation Failed while Finishing Registration'
    );
  }

  const {
    username,
    email,
    registrationRecord,
    encPrivateIdKey,
    encPrivateSigningKey,
    publicIdKey,
    publicSigningKey,
    idKeyNonce,
    idKeySalt,
    signingKeyNonce,
    signingKeySalt,
  } = values;

  await User.create({
    username,
    email,
    registrationRecord,
    encPrivateIdKey,
    encPrivateSigningKey,
    publicIdKey,
    publicSigningKey,
    idKeyNonce,
    signingKeyNonce,
    idKeySalt,
    signingKeySalt,
  });

  const returnUser = await User.findOne({ username }).select(
    '-registrationRecord'
  );

  return ResponseUtil.success(res, 'Registration finished', returnUser);
});

const loginStart = asyncHandler(async (req, res) => {
  // Input Validation
  let values;
  try {
    values = LoginStartParams.parse(req.body);
  } catch (e) {
    return ResponseUtil.error(
      res,
      'Input Validation Failed while Starting Login'
    );
  }

  const { usernameOrEmail, startLoginRequest } = values;

  // Check if user already exists
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user) {
    return ResponseUtil.error(res, 'User not found', undefined, 404);
  }

  const existingLoginState = await LoginState.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (existingLoginState) {
    return ResponseUtil.error(
      res,
      'Last Login in progress. Please try again in a few seconds.',
      undefined,
      400
    );
  }

  const { serverLoginState, loginResponse } = opaque.server.startLogin({
    serverSetup: config.serverSetup,
    userIdentifier: user.email,
    registrationRecord: user.registrationRecord,
    startLoginRequest,
  });

  // Create a temporary login state for 30s
  await LoginState.create({
    username: user.username,
    email: user.email,
    serverLoginState,
  });

  return ResponseUtil.success(res, 'Login started successfully', loginResponse);
});

const loginFinish = asyncHandler(async (req, res) => {
  let values;
  try {
    values = LoginFinishParams.parse(req.body);
  } catch (e) {
    return ResponseUtil.error(
      res,
      'Input Validation Failed while Login Finish',
      undefined,
      400
    );
  }

  const { usernameOrEmail, finishLoginRequest } = values;

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  }).select('-registrationRecord');
  if (!user) {
    return ResponseUtil.error(res, 'User not found', undefined, 404);
  }

  const loginState = await LoginState.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!loginState) {
    return ResponseUtil.error(
      res,
      'No LoginState found! Please start login first.',
      undefined,
      404
    );
  }

  try {
    opaque.server.finishLogin({
      finishLoginRequest,
      serverLoginState: loginState.serverLoginState,
    });
  } catch (e) {
    return ResponseUtil.error(
      res,
      'Login finish failed due to OPAQUE error',
      e,
      404
    );
  }

  const { refreshToken, accessToken } = generateJwtTokens(user);
  // Hash and store the refresh token
  const refreshTokenHash = hashRefreshToken(refreshToken);
  await User.findByIdAndUpdate(user._id, { refreshTokenHash });

  // Remove any existing login state
  await LoginState.deleteOne({ email: loginState.email });

  const COOKIE_OPTIONS = config.cookieOptions;

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

  const responseData = {
    user,
    accessToken,
  }

  return ResponseUtil.success(res, 'Login finished', responseData);
});

const getNewRefreshToken = asyncHandler(async (req, res) => {
  const token: string = req.cookies.refreshToken;

  if(!token){
    return ResponseUtil.error(res, 'No Refresh Token found', undefined, 401);
  }

  let decoded: RefreshJwtPayload;
  try {
    decoded = jwt.verify(token, config.jwtRefreshSecret) as RefreshJwtPayload;
  }catch (e) {
    return ResponseUtil.error(res, 'Refresh token validation failed while refreshing.', e);
  }

  const user = await User.findById(decoded._id).select(
    '-registrationRecord'
  );

  // Verify the refresh token hash
  const providedTokenHash = hashRefreshToken(token);
  if (!user || !user.refreshTokenHash || user.refreshTokenHash !== providedTokenHash) {
    return ResponseUtil.error(res, 'Refresh token validation failed while refreshing.', undefined, 401);
  }

  // Generate new pair
  const { accessToken, refreshToken } = generateJwtTokens(user);

  // Update the stored refresh token hash
  const newRefreshTokenHash = hashRefreshToken(refreshToken);
  await User.findByIdAndUpdate(user._id, { refreshTokenHash: newRefreshTokenHash });

  const COOKIE_OPTIONS = config.cookieOptions;

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

  return ResponseUtil.success(res, "Token refreshed successfully");

});

const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;

  if(!token){
    return ResponseUtil.error(res, 'No Refresh Token found', undefined, 401);
  }

  try{
    const decoded = jwt.verify(token, config.jwtRefreshSecret) as RefreshJwtPayload;
    await User.findByIdAndUpdate(decoded._id, { refreshTokenHash: null });
  }catch (e) {
    // Token might be invalid, but we still clear cookies
    console.log('Invalid token during logout, clearing cookies anyway');
  }

  res.clearCookie('refreshToken', config.cookieOptions);

  return ResponseUtil.success(res, 'Logout successful');
});