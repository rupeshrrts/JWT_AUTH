import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { ENV } from '../config/env.js';
import { AppError } from '../middleware/error.middleware.js';
import { RegisterInput, LoginInput } from '../schemas/auth.schema.js';

const SALT_ROUNDS = 10;

export const authService = {
  // Register a new user
  async register({ name, email, password }: RegisterInput) {
    // 1. Check if user already exists -> 409 Conflict
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new AppError('Email is already registered', 409);
    }

    // 2. Hash password with bcrypt (never store plain password)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 3. Store in PostgreSQL via Prisma
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return user;
  },

  // Login user and generate JWT
  async login({ email, password }: LoginInput) {
    // 1. Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // 2. Verify password with bcrypt.compare()
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // 3. Generate JWT with payload { userId: user.id }
    const token = jwt.sign(
      { userId: user.id },
      ENV.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  },

  // Fetch current authenticated user by userId
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  },
};
