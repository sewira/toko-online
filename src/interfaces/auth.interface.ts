import { Request } from 'express';
import { User } from '@prisma/client';

export interface DataStoredInToken {
  id: string;
  iat?: number;
  exp?: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
