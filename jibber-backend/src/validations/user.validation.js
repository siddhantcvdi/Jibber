import { z } from 'zod';

const noProtoString = z
  .string()
  .min(1)
  .refine(
    (value) => {
      return !value.includes('__proto__');
    },
    {
      message: 'String must not include "__proto__"',
    }
  );

export const LoginStartParams = z.object({
  usernameOrEmail: noProtoString,
  startLoginRequest: noProtoString,
});

export const LoginFinishParams = z.object({
  usernameOrEmail: noProtoString,
  finishLoginRequest: noProtoString,
});

export const RegisterStartParams = z.object({
  username: noProtoString,
  email: noProtoString,
  registrationRequest: noProtoString,
});

export const RegisterFinishParams = z.object({
  username: noProtoString,
  email: noProtoString,
  encPrivateIdKey: noProtoString,
  publicIdKey: noProtoString,
  encPrivateSigningKey: noProtoString,
  publicSigningKey: noProtoString,
  registrationRecord: noProtoString,
  idKeyNonce: noProtoString, 
  idKeySalt: noProtoString,
  signingKeyNonce: noProtoString, 
  signingKeySalt: noProtoString
});
