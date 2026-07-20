const SUPABASE_URL = 
"https://fmoqrotwibtychkcpekn.supabase.co";


const SUPABASE_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtb3Fyb3R3aWJ0eWNoa2NwZWtuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzMzM5MzAsImV4cCI6MjA5OTkwOTkzMH0.bA2GL_8Sfo5QWr1TzXxwF7bgFZ1wuDeuZg72H-uIuq4";


const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);