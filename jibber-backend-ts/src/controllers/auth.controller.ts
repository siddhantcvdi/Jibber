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
import { UserType } from '@/types';
import jwt, { SignOptions } from 'jsonwebtoken';

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
});
