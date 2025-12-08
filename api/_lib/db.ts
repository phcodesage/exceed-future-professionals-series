import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

// Define the WaitlistEntry schema
const waitlistEntrySchema = new mongoose.Schema(
    {
        parentName: { type: String, required: true },
        childName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        gradeLevel: { type: String, required: true },
        programInterests: { type: [String], default: [] },
        interests: { type: String },
    },
    { timestamps: true }
);

export const WaitlistEntry =
    mongoose.models.WaitlistEntry || mongoose.model('WaitlistEntry', waitlistEntrySchema);
