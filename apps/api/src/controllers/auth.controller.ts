import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsersDb, CreatorsDb } from '../db/supabaseClient';
import { ENV } from '../config/env';
import { AuthRequest } from '../middlewares/rbac';
import { UserRole } from '@naagrik/shared-types';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, role, phone } = req.body;

      const existing = await UsersDb.findByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, error: 'Email already registered' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const userRole = role || UserRole.CREATOR;

      const user = await UsersDb.create({
        name,
        email,
        passwordHash,
        role: userRole,
        phone
      });

      let creatorId: string | undefined = undefined;

      // Auto-create creator profile if registering as CREATOR
      if (userRole === UserRole.CREATOR) {
        const creator = await CreatorsDb.create({ userId: user.id });
        creatorId = creator.id;
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, creatorId },
        ENV.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        success: true,
        token,
        user: {
          id: user.id,
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          creatorId
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UsersDb.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      if (user.status === 'SUSPENDED') {
        return res.status(403).json({ success: false, error: 'Account suspended. Contact support.' });
      }

      const hash = user.passwordHash || user.password_hash;
      const validPassword = await bcrypt.compare(password, hash);
      if (!validPassword) {
        return res.status(401).json({ success: false, error: 'Invalid email or password' });
      }

      let creatorId: string | undefined = undefined;
      if (user.role === UserRole.CREATOR) {
        const creator = await CreatorsDb.findByUserId(user.id);
        if (creator) {
          creatorId = creator.id;
        }
      }

      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, creatorId },
        ENV.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        success: true,
        token,
        user: {
          id: user.id,
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          creatorId,
          location: user.location
        }
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  static async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }
      const user = await UsersDb.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      const { passwordHash, password_hash, ...safeUser } = user;
      return res.json({ success: true, user: safeUser });
    } catch (error: any) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}
