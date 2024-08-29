import { sign } from 'jsonwebtoken';

export async function generateUserToken(userId: string): Promise<string> {
  const secret = process.env.STREAM_API_SECRET;
  if (!secret) {
    throw new Error('STREAM_API_SECRET is not defined');
  }

  return sign(
    {
      user_id: userId,
    },
    secret,
    { expiresIn: '1h' }
  );
}
