import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from './db';
import User, { RANKS } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('user_token')?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    
    await dbConnect();
    const user = await User.findById(decoded.userId).select('-password').lean();
    
    if (!user) return null;

    const userData = user as any;
    const rankInfo = RANKS.find(r => r.level === userData.rank) || RANKS[0];

    return {
      ...userData,
      _id: userData._id.toString(),
      rankName: rankInfo.name,
      rankEmoji: rankInfo.emoji,
    };
  } catch (error) {
    return null;
  }
}

export async function verifyUserToken(token: string) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; username: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export { RANKS };
