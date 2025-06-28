-- Fix database schema for Soundverse DNA
-- This script will drop and recreate the dna_profiles table with the correct schema

-- Drop the existing dna_profiles table if it exists
DROP TABLE IF EXISTS dna_profiles CASCADE;

-- Create the dna_profiles table with the correct schema
CREATE TABLE dna_profiles (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    profile_name VARCHAR(255) NOT NULL,
    dna_sequence TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on user_id for better performance
CREATE INDEX idx_dna_profiles_user_id ON dna_profiles(user_id);

-- Insert a test record to verify the table works
INSERT INTO dna_profiles (user_id, profile_name, dna_sequence) 
VALUES ('test_user', 'Test Profile', 'ATCGATCGATCG');

-- Verify the table was created correctly
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'dna_profiles' 
ORDER BY ordinal_position;

-- Show the test record
SELECT * FROM dna_profiles; 