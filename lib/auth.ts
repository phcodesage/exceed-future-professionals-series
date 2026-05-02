import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export function verifyToken(authHeader: string | undefined): { username: string } | null {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    if (!authHeader) {
        return null;
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return null;
    }

    const token = parts[1];

    try {
        const payload = jwt.verify(token, JWT_SECRET) as { username: string };
        return payload;
    } catch {
        return null;
    }
}
