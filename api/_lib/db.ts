import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}

// Type for mongoose caching
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

// Extend global type for mongoose caching
declare global {
    // eslint-disable-next-line no-var
    var mongoose: MongooseCache | undefined;
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
const cached: MongooseCache = global.mongoose ?? (global.mongoose = { conn: null, promise: null });

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts);
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

// Define the ExperienceRegistration schema for free experience day signups
const experienceRegistrationSchema = new mongoose.Schema(
    {
        fullName: { type: String, required: true },
        emailOrContact: { type: String, required: true },
        selectedDate: { type: String, required: true },
        selectedTime: { type: String, required: true },
    },
    { timestamps: true }
);

export const ExperienceRegistration =
    mongoose.models.ExperienceRegistration || mongoose.model('ExperienceRegistration', experienceRegistrationSchema);
