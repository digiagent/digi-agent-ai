import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";

export interface AuthUser {
  privyId: string;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const jwks = createRemoteJWKSet(new URL(process.env.PRIVY_JWKS_URL!));

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const token = header.slice("Bearer ".length);

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: "privy.io",
      audience: process.env.PRIVY_APP_ID!,
    });

    const privyId = payload.sub;
    if (!privyId) {
      return res.status(401).json({ error: "Token missing subject" });
    }

    req.user = {
      privyId,
      email:
        typeof payload.email === "string" ? payload.email : undefined,
    };

    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
