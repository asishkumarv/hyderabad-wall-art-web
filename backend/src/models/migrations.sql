-- Migration script to add missing columns to existing tables

-- Fix activities table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='activities' AND column_name='created_at') THEN
    ALTER TABLE activities RENAME COLUMN timestamp TO created_at;
  END IF;
END $$;

-- Add updated_at to various tables if missing
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN SELECT table_name FROM information_schema.tables 
             WHERE table_schema = 'public' 
             AND table_name IN ('gallery', 'leads', 'blogs', 'categories', 'videos', 'testimonials', 'activities', 'contacts', 'services', 'pages', 'settings', 'users')
    LOOP
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = t AND column_name = 'updated_at') THEN
            EXECUTE format('ALTER TABLE %I ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP', t);
        END IF;
    END LOOP;
END $$;

-- Add gallery_images to blogs if missing
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='blogs' AND column_name='gallery_images') THEN
    ALTER TABLE blogs ADD COLUMN gallery_images TEXT[];
  END IF;
END $$;
