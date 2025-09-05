// js/supabase-config.js
// Import the Supabase client from their CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Your Supabase project configuration (Replace with your details from the API settings page)
const supabaseUrl = 'https://aerhoeowqbldmgrwsotp.supabase.co' // REPLACE THIS WITH YOUR URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlcmhvZW93cWJsZG1ncndzb3RwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MDM2MzIsImV4cCI6MjA3MjI3OTYzMn0.9jHPdjnipmrUgD8fV9tdlXI-pRTcT22XIYdifdbig4Q' // REPLACE THIS WITH YOUR ANON PUBLIC KEY

// Create a single supabase client for interacting with your database
// This 'supabase' object will be used for all database and authentication operations
const supabase = createClient(supabaseUrl, supabaseKey);

// Make the supabase client available to other JS files
export { supabase };