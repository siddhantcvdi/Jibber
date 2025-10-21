import {ResponseUtil} from "@/utils/response";
import {asyncHandler} from "@/utils/asyncHandler";
import {LoginStartParams, LoginFinishParams, RegisterFinishParams, RegisterStartParams} from "@/validations/user.validations";
import * as opaque from '@serenity-kit/opaque';
import crypto from 'crypto'
import {User} from "@/models/user.model";
import config from "@/config";

const registerStart = asyncHandler(async (req, res) => {
    let username, email, registrationRequest;
    // Parameter extraction and validation
    try{
        const values = RegisterStartParams.parse(req.body);
        username = values.username;
        email = values.email;
        registrationRequest = values.registrationRequest;
    }catch (e){
        return ResponseUtil.error(res, "Input Validation Failed while Starting Registration");
    }

    // Check if same email exists
    const existingEmail = await User.findOne({ email });
    if(existingEmail){
        return ResponseUtil.error(res, "Email already exists", undefined, 400);
    }

    // Check if same username exists
    const existingUsername = await User.findOne({ username });
    if(existingUsername){
        return ResponseUtil.error(res, "Username already exists", undefined, 400);
    }

    // Return OPAQUE registration response
    const serverSetup = config.serverSetup;
    const { registrationResponse } = opaque.server.createRegistrationResponse({
        serverSetup,
        userIdentifier: email,
        registrationRequest,
    });

    return ResponseUtil.success(res, "Registration started successfully", registrationResponse);

})
