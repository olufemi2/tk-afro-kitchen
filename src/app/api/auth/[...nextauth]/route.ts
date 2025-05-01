import NextAuth from 'next-auth';

const handler = NextAuth({
  providers: [],
  secret: process.env.NEXTAUTH_SECRET || 'your-fallback-secret',
});

export { handler as GET, handler as POST }; 