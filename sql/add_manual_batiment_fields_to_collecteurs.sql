-- Add manual batiment fields to collecteurs table
ALTER TABLE collecteurs 
ADD COLUMN IF NOT EXISTS batiments_total INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS batiments_validee INTEGER DEFAULT 0;
