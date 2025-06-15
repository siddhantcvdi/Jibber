import { errorResponse, successResponse } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';
import {
  LoginFinishParams,
  LoginStartParams,
  RegisterFinishParams,
  RegisterStartParams,
} from '../validations/user.validation.js';
import User from '../models/user.model.js';
import * as opaque from '@serenity-kit/opaque';
import { LoginState } from '../models/loginstate.model.js';
import jwt from 'jsonwebtoken';

const generateJwtTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};

const registerStart = asyncHandler(async (req, res) => {
  // Fetch userId and registration request
  // Check for existing user
  // create registration response
  // send registration response
  let username, email, registrationRequest;
  try {
    const values = RegisterStartParams.parse(req.body);
    username = values.username;
    email = values.email;
    registrationRequest = values.registrationRequest;
  } catch (err) {
    return errorResponse(res, {
      message: 'Invalid Input Values',
      statusCode: 400,
    });
  }
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return errorResponse(res, {
      message: 'Email already registered',
      statusCode: 400,
    });
  }
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    return errorResponse(res, {
      message: 'Username already registered',
      statusCode: 400,
    });
  }
  const serverSetup = process.env.SERVER_SETUP;
  const { registrationResponse } = opaque.server.createRegistrationResponse({
    serverSetup,
    userIdentifier: email,
    registrationRequest,
  });
  successResponse(res, {
    message: 'Registration response created',
    data: registrationResponse,
  });
});

const registerFinish = asyncHandler(async (req, res) => {

  // Verify the body using zod schema
  console.log(req.body);
  let values;
  try {
    values = RegisterFinishParams.parse(req.body);
  } catch (err) {
    return errorResponse(res, {
      message: 'Invalid Input Values',
      statusCode: 400,
    });
  }
  const {username, email, registrationRecord ,encPrivateIdKey, encPrivateSigningKey, publicIdKey, publicSigningKey, idKeyNonce, idKeySalt, signingKeyNonce, signingKeySalt} = values

  // Create a user
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
    signingKeySalt
  });

  const returnUser = await User.findOne({ username }).select(
    '-registrationRecord'
  );
  return successResponse(res, {
    message: 'Registration finished',
    data: returnUser,
  });
});

const loginStart = asyncHandler(async (req, res) => {
  let usernameOrEmail, startLoginRequest;
  try {
    const values = LoginStartParams.parse(req.body);
    usernameOrEmail = values.usernameOrEmail;
    startLoginRequest = values.startLoginRequest;
  } catch {
    return errorResponse(res, {
      message: 'Invalid Input Values',
      statusCode: 400,
    });
  }

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user) {
    return errorResponse(res, {
      message: 'User does not exist',
      statusCode: 400,
    });
  }

  const existingLoginState = await LoginState.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (existingLoginState) {
    return errorResponse(res, {
      message: 'Last Login in progress. Please try again in a few seconds.',
      statusCode: 400,
    });
  }

  const { serverLoginState, loginResponse } = opaque.server.startLogin({
    serverSetup: process.env.SERVER_SETUP,
    userIdentifier: user.email,
    registrationRecord: user.registrationRecord,
    startLoginRequest,
  });

  await LoginState.create({
    username: user.username,
    email: user.email,
    serverLoginState,
  });

  return successResponse(res, {
    message: 'Login Started',
    data: loginResponse,
  });
});

const loginFinish = asyncHandler(async (req, res) => {
  let usernameOrEmail, finishLoginRequest;
  try {
    const values = LoginFinishParams.parse(req.body);
    usernameOrEmail = values.usernameOrEmail;
    finishLoginRequest = values.finishLoginRequest;
  } catch {
    return errorResponse(res, {
      message: 'Invalid Input Values',
      statusCode: 400,
    });
  }

  const loginState = await LoginState.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!loginState) {
    return errorResponse(res, {
      message: 'Login has not started',
      statusCode: 400,
    });
  }

  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  }).select('-registrationRecord');
  if (!user) {
    return errorResponse(res, {
      message: 'User does not exist',
      statusCode: 400,
    });
  }
  try {
    const { sessionKey } = opaque.server.finishLogin({
      finishLoginRequest,
      serverLoginState: loginState.serverLoginState,
    });
  } catch {
    return errorResponse(res, { message: 'Invalid Password', statusCode: 400 });
  }

  const { refreshToken, accessToken } = generateJwtTokens(user);

  await LoginState.deleteOne({ email: loginState.email });

  const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  };

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  return successResponse(res, {
    message: 'Login Finished',
    data: { user, accessToken },
  });
});

const refresh = asyncHandler(async (req, res) => {
  console.log('Refresh Hit');
  const token = req.cookies?.refreshToken;

  if (!token) {
    return errorResponse(res, {
      message: 'Refresh token missing',
      statusCode: 401,
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return errorResponse(res, {
      message: 'Invalid or expired refresh token',
      statusCode: 403,
    });
  }

  const user = await User.findById(decoded.userId).select(
    '-registrationRecord'
  );
  if (!user) {
    return errorResponse(res, { message: 'User not found', statusCode: 404 });
  }

  const { accessToken, refreshToken } = generateJwtTokens(user);

  const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: '/',
  };

  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);

  return successResponse(res, {
    message: 'Token refreshed',
    data: { accessToken },
  });
});

const logout = asyncHandler(async (req, res) => {
  // Clear cookies
  res.clearCookie('accessToken', {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return successResponse(res, {
    message: 'Logout successful',
  });
});

const whoami = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select(
      '-registrationRecord'
    );
    if (!user) {
      return errorResponse(res, {
        message: 'User not found',
        statusCode: 404,
      });
    }

    return successResponse(res, {
      message: 'User retrieved successfully',
      data: { user },
    });
  } catch (err) {
    return errorResponse(res, {
      message: 'Failed to retrieve user information',
      statusCode: 500,
    });
  }
});

export {
  registerStart,
  registerFinish,
  loginStart,
  loginFinish,
  whoami,
  refresh,
  logout,
};
