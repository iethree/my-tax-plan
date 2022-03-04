// setup supabase api
import { createClient } from "@supabase/supabase-js";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const apiKey = process.env.NEXT_PUBLIC_API_KEY || "";

export const supabase = createClient(BASE_URL, apiKey);
