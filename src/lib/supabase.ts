import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://aojlzaofetbtnwjwwbnh.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNlNjkyZjgzLTJkYmQtNDU3Yi04N2E2LTA3NTMyYjkxYWY1YyJ9.eyJwcm9qZWN0SWQiOiJhb2psemFvZmV0YnRud2p3d2JuaCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgwMzMwNDc3LCJleHAiOjIwOTU2OTA0NzcsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.CPEnnM5JywnUSYYGBCguakrfsgeMlrhNIndiXcFgBSU';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };