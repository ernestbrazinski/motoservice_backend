-- Motorcycle classified listings (for sale). Optional: run manually in production
-- if TypeORM synchronize is disabled. In dev, entities + synchronize create these tables.

CREATE TYPE mileage_unit AS ENUM ('km', 'mi');

CREATE TABLE motorcycle_listings (
    id SERIAL PRIMARY KEY,
    brand_id INTEGER NOT NULL REFERENCES brands(id),
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    displacement_cc INTEGER NOT NULL,
    mileage INTEGER NOT NULL,
    mileage_unit mileage_unit NOT NULL DEFAULT 'km',
    vin TEXT NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    currency TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT motorcycle_listings_vin_unique UNIQUE (vin),
    CONSTRAINT motorcycle_listings_year_check CHECK (year >= 1900 AND year <= 2100),
    CONSTRAINT motorcycle_listings_displacement_cc_check CHECK (displacement_cc >= 1 AND displacement_cc <= 5000)
);

CREATE TABLE motorcycle_listing_images (
    id SERIAL PRIMARY KEY,
    listing_id INTEGER NOT NULL REFERENCES motorcycle_listings(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_main BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_motorcycle_listing_images_listing_id ON motorcycle_listing_images(listing_id);
