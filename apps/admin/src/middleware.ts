import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	const hasSession = Boolean(request.cookies.get('admin_access')?.value);
	if (!hasSession) {
		const loginUrl = new URL('/login', request.url);
		loginUrl.searchParams.set('next', request.nextUrl.pathname);
		return NextResponse.redirect(loginUrl);
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|login|_next/static|_next/image|.*\\..*).*)'],
};
