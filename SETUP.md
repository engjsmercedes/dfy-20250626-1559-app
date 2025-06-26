# Setup Guide

## Environment Configuration

1. Copy `.env.example` to `.env`
2. Add your Supabase credentials:
   - VITE_SUPABASE_URL: Your Supabase project URL
   - VITE_SUPABASE_ANON_KEY: Your Supabase anon key

## Database Setup

If you're using authentication or database features, you'll need to set up your Supabase database:

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the following SQL to create basic tables:

```sql
-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade,
  email text,
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (id)
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create profile policies
create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);
```

## Development

Run `npm run dev` to start the development server.

## Testing

The application includes sample data and test accounts for immediate testing.
