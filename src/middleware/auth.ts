import express, { RequestHandler } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import HttpError from '../model/http-error';

import { IUser, UserDB } from '../model/user.model';
import generateAccessToken from '../utils/generateAccessToken';

interface IAuthMiddlewareRequest extends express.Request {
  userId?: string;
  user?: any;
  accessToken?: string;
}

interface IVerify {
  readonly _id: string;
  readonly iat: number;
  readonly exp: number;
}

let data: IVerify;
const auth: RequestHandler = async (req: IAuthMiddlewareRequest, res, next) => {
  let userDocument: Readonly<Omit<mongoose.Document, '_id'>> | null;

  try {
    const token = (req.header('Authorization') as string).replace(
      'Bearer ',
      ''
    );

    data = jwt.verify(token, 'secret') as IVerify;

    userDocument = await UserDB.findById(data._id, { _id: 0 });

    req.user = userDocument as IUser;

    if (!userDocument) {
      return next(new HttpError('unable to auth', 401));
    }

    next();
  } catch (e: any) {
    // user failes auth and now checking for validity of refresh token

    const refreshToken = (req.header('AuthorizationRefresh') as string).replace(
      'Bearer ',
      ''
    );

    if (refreshToken == null) {
      return next(
        new HttpError('refresh token not valid, please log in again', 401)
      );
    }

    data = jwt.verify(refreshToken, 'secret') as IVerify;

    const user = await UserDB.findById(data._id, { _id: 0 });

    req.user = user;

    if (user) {
      let userTokens: string[] = [];

      user.tokens.map((token) => {
        userTokens.push(token.token);
      });

      if (!userTokens.includes(refreshToken)) {
        return next(new HttpError('refresh token too old, login again', 401));
      }
    }

    const verifiedUserId = jwt.verify(refreshToken, 'secret') as IVerify;

    const accessToken = generateAccessToken(verifiedUserId._id);

    req.accessToken = accessToken;

    next();
  }
};

const adminAuth: RequestHandler = (req: IAuthMiddlewareRequest, res, next) => {
  const user = req.user as IUser;

  if (user.role !== 'admin') {
    return next(new HttpError('User is not admin', 401));
  }

  next()
};


// const adminAuth = async (
//   req: IAdminAuthM_iddlewareRequest,
//   res: IAdminAuthM_iddlewareResponse,
//   next: express.NextFunction
// ) => {
//   ServerGlobal.getInstance().logger.info(
//     '[admin auth m_iddleware]: Start processing request'
//   );

//   try {
//     const token = (req.header('Authorization') as string).replace(
//       'Bearer ',
//       ''
//     );

//     const data = jwt.verify(token, process.env.JWT_PWD) as IVerify;

//     const adminDocument: Readonly<
//       Pick<IUserDocument, keyof mongoose.Document | 'email'>
//     > | null = await UserDB.findBy_id(data._id, { email: 1 });

//     if (!adminDocument || adminDocument.email !== process.env.ADMIN_EMAIL) {
//       ServerGlobal.getInstance().logger.error(
//         `[admin auth m_iddleware]: Failed to authenticate administrator for _id: ${data._id}`
//       );

//       res.status(401).send({
//         success: false,
//         message: 'Unable to authenticate',
//       });
//       return;
//     }

//     ServerGlobal.getInstance().logger.info(
//       `[admin auth m_iddleware]: Successfully authenticated administrator with _id ${data._id}`
//     );

//     next();
//   } catch (e) {
//     ServerGlobal.getInstance().logger.error(
//       `[admin auth m_iddleware]: Failed to authenticate administrator because of error: ${e}`
//     );

//     if ((e.message = 'jwt malformed')) {
//       res.status(401).send({
//         success: false,
//         message: 'Unable to authenticate',
//       });
//       return;
//     }

//     res.status(500).send({
//       success: false,
//       message: 'Server error',
//     });
//     return;
//   }
// };

export {
  auth,
  adminAuth
};
