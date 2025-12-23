import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Logout successful' });

    // Clear the authentication cookie
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      expires: new Date(0), // Set expiry to the past
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}
