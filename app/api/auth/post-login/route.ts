import { createClient } from "../../../lib/supabaseServer";
import { createPostLoginHandler, enforceEmailChangeGuard } from "../../../lib/auth/postLogin";

export const POST = createPostLoginHandler(createClient, enforceEmailChangeGuard);
