import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { SECRET_KEY } from '@config';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';

const authMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

    if (Authorization) {
      const secretKey: string = SECRET_KEY;
      const verificationResponse = (await verify(Authorization, secretKey)) as DataStoredInToken;

      const userId = verificationResponse.id;
      const exp = verificationResponse.exp;

      if (Date.now() >= exp * 1000) {
        next(new HttpException(401, 'Session Timed Out'));
      }

      const prisma = new PrismaClient();
      const findUser = await prisma.user.findUnique({ where: { id: userId.toString() } });

      // await prisma.order.create({
      //   data: {
      //     products: {
      //       connect: [{ id: '4ca52181-95c8-49c5-be71-a48d803dc06e' }, { id: '1a2fdd9c-242b-45b5-93e0-dca80f4a258c' }],
      //     },
      //     user: {
      //       connect: {
      //         id: '020865af-6892-40ec-bf21-fb8b5154ed70',
      //       },
      //     },
      //   },
      // });

      if (findUser) {
        req.user = findUser;
        next();
      } else {
        next(new HttpException(401, 'Wrong authentication token'));
      }
    } else {
      next(new HttpException(404, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(401, `${error?.message}`));
  }
};

export default authMiddleware;
