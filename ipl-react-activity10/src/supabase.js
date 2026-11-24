import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kuuwbfhefvvegnucbvgs.supabase.co";
const supabaseKey = "sb_publishable_pzkVgfFgpqhw1gnC-Y4VAw_uL1Txpi7";
export const supabase = createClient(supabaseUrl, supabaseKey);
