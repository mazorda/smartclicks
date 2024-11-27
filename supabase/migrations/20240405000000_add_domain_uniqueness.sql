ALTER TABLE domains ADD CONSTRAINT unique_domain UNIQUE (LOWER(TRIM(domain)));
