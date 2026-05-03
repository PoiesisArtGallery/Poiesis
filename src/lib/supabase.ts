import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  "https://eodjhqlydbdqopganynm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvZGpocWx5ZGJkcW9wZ2FueW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzgwMTIsImV4cCI6MjA4OTMxNDAxMn0.Hzh8uwk2xlokWK0oD8bk1zcfUDn9obwbw3oSzlYHKy8"
)