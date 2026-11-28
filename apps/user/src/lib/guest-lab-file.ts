export const guestLabFileLimitMb = () => (process.env.VERCEL === '1' ? 4 : 10);
export const guestLabTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
