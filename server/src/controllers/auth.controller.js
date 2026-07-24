import { env } from "../config/env.js";
import { authService } from "../services/auth.service.js";

const REFRESH_COOKIE = "refreshToken";
const COOKIE_PATH = "/api/v1/auth";

function setRefreshCookie(res, token, expiresAt) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    // "strict" em vez de "lax": front-end e API vivem no mesmo site registrável e não há
    // fluxo de navegação cross-site (ex.: redirect de OAuth) que precise do cookie em GET
    // de terceiros — strict elimina de vez o cookie como vetor de CSRF.
    sameSite: "strict",
    expires: expiresAt,
    path: COOKIE_PATH,
  });
}

function requestMeta(req) {
  return { userAgent: req.headers["user-agent"], ip: req.ip };
}

export const authController = {
  async register(req, res, next) {
    try {
      const { user, accessToken, refreshToken, refreshTokenExpiresAt } = await authService.register(
        req.body,
        requestMeta(req)
      );
      setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
      res.status(201).json({ user, accessToken });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { user, accessToken, refreshToken, refreshTokenExpiresAt } = await authService.login(
        req.body,
        requestMeta(req)
      );
      setRefreshCookie(res, refreshToken, refreshTokenExpiresAt);
      res.json({ user, accessToken });
    } catch (err) {
      next(err);
    }
  },

  async refresh(req, res, next) {
    try {
      const token = req.cookies?.[REFRESH_COOKIE];
      const { accessToken, user } = await authService.refresh(token);
      res.json({ user, accessToken });
    } catch (err) {
      next(err);
    }
  },

  async logout(req, res, next) {
    try {
      const token = req.cookies?.[REFRESH_COOKIE];
      await authService.logout(token);
      res.clearCookie(REFRESH_COOKIE, { path: COOKIE_PATH });
      res.status(204).end();
    } catch (err) {
      next(err);
    }
  },

  async me(req, res, next) {
    try {
      const user = await authService.me(req.user.sub);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
};
