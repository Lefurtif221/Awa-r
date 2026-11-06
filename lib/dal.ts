import "server-only";

import { cache } from "react";
import { verifySession } from "@/lib/session";

/**
 * Vérification de session mémoïsée par requête : appelée à la fois par le
 * proxy (optimiste) et par chaque server action (autorisée).
 */
export const requireAdmin = cache(async () => verifySession());
