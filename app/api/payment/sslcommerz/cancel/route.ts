import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`
  );
}

export async function GET(req: NextRequest) {
  return POST(req);
}
