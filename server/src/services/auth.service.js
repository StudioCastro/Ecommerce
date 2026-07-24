import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { env } from "../config/env.js";
import { userRepository } from "../repositories/user.repository.js";
import { sessionRepository } from "../repositories/session.repository.js";
import { AppError } from "../middlewares/errorHandler.js";

function signAccessToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

function signRefreshToken(user) {
  // jti garante um token único mesmo se duas sessões forem emitidas no mesmo segundo
  // (register + login em sequência rápida, por ex.) — Session.refreshToken é @unique.
  return jwt.sign({ sub: user.id, jti: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

async function issueSession(user, { userAgent, ip } = {}) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const { exp } = jwt.decode(refreshToken);
  const refreshTokenExpiresAt = new Date(exp * 1000);

  await sessionRepository.create({
    userId: user.id,
    refreshToken,
    userAgent,
    ip,
    expiresAt: refreshTokenExpiresAt,
  });

  return { accessToken, refreshToken, refreshTokenExpiresAt };
}

export const authService = {
  async register({ name, email, password }, meta) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new AppError("Já existe uma conta com este e-mail.", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ name, email, passwordHash });
    const tokens = await issueSession(user, meta);

    return { user: toPublicUser(user), ...tokens };
  },

  async login({ email, password }, meta) {
    const user = await userRepository.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError("E-mail ou senha inválidos.", 401);
    }
    if (!user.isActive) {
      throw new AppError("Conta desativada.", 403);
    }

    const tokens = await issueSession(user, meta);
    return { user: toPublicUser(user), ...tokens };
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError("Refresh token não informado.", 401);
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
    } catch {
      throw new AppError("Refresh token inválido ou expirado.", 401);
    }

    const session = await sessionRepository.findByToken(refreshToken);
    if (!session || session.expiresAt < new Date()) {
      throw new AppError("Sessão expirada. Faça login novamente.", 401);
    }

    const user = await userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 401);
    }

    return { accessToken: signAccessToken(user), user: toPublicUser(user) };
  },

  async logout(refreshToken) {
    if (refreshToken) {
      await sessionRepository.deleteByToken(refreshToken);
    }
  },

  async me(userId) {
    const user = await userRepository.findById(userId);
    if (!user) throw new AppError("Usuário não encontrado.", 404);
    return toPublicUser(user);
  },
};
