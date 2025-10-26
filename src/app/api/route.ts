import { NextResponse, NextRequest } from 'next/server';

/**
 * API route that checks if an email exists in a predefined list.
 *
 * @param request
 * @returns
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const email = searchParams.get('email');
  const emails = ['example@example.com', 'test@example.com'];

  return NextResponse.json({ result: emails.includes(email || '') });
}
