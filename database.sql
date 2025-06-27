CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE scripts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL, -- 'tiktok', 'youtube', 'marketing', 'shortfilm'
    idea TEXT NOT NULL,
    structure JSONB,
    final_script TEXT,
    status TEXT DEFAULT 'draft' NOT NULL, -- 'draft', 'completed'
    duration INTEGER,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE ai_sessions (
    id SERIAL PRIMARY KEY,
    script_id INTEGER REFERENCES scripts(id) NOT NULL,
    step TEXT NOT NULL, -- 'analysis', 'questions', 'structure', 'generation'
    input JSONB NOT NULL,
    output JSONB NOT NULL,
    "timestamp" TIMESTAMP DEFAULT NOW() NOT NULL
);
