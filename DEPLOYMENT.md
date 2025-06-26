# Deployment Guide

## Vercel Deployment (Recommended)

1. Push your code to GitHub
2. Import your repository in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy!

## Environment Variables

Make sure to set these in your deployment platform:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Build Command

`npm run build`

## Output Directory

`dist`

## Custom Domain

After deployment, you can add a custom domain through your hosting provider's dashboard.
