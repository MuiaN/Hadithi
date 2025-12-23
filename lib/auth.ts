import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { User } from '@prisma/client';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in the environment variables.');
}

const secretKey = new TextEncoder().encode(JWT_SECRET);
const alg = 'HS256';

type UserForToken = Omit<User, 'password'>;

interface UserJwtPayload extends JWTPayload {
  id: string;
  role: 'USER' | 'CREATOR' | 'EDITOR' | 'ADMIN';
}

export async function generateToken(user: UserForToken): Promise<string> {
  const token = await new SignJWT({
    sub: user.id,
    role: user.role,
  })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secretKey);

  return token;
}

/**
 * Verifies the JWT from the request's cookie and returns the full user object from the database.
 * @param request - The NextRequest object.
 * @returns A promise that resolves to the user object or null if unauthorized.
 */
export const getAuth = async (request: NextRequest): Promise<User | null> => {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const user = await prisma.user.findUnique({ where: { id: payload.sub as string } });
    return user || null;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
};