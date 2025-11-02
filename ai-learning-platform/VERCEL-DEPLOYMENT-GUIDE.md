# Vercel Deployment Guide - Environment Variables Setup

## ⚠️ Required Environment Variables

Your Vercel deployment needs these environment variables to work properly. Without them, login and registration will fail with "internal server error".

### 🔧 Step 1: Access Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project: `ai-learning-platforms`
3. Go to **Settings** → **Environment Variables**

### 📝 Step 2: Add Environment Variables

Add these environment variables one by one:

#### Database Configuration
```
Name: DATABASE_URL
Value: postgres://0af78d765e7aebe7ea3952ca8c7a022f6c0a310dbd9da75070bf047145d0b837:sk_7K1_W9CDhL3Yo4ggalmDx@db.prisma.io:5432/postgres?sslmode=require
Environment: Production, Preview, Development
```

```
Name: PRISMA_DATABASE_URL  
Value: postgres://0af78d765e7aebe7ea3952ca8c7a022f6c0a310dbd9da75070bf047145d0b837:sk_7K1_W9CDhL3Yo4ggalmDx@db.prisma.io:5432/postgres?sslmode=require
Environment: Production, Preview, Development
```

#### Authentication Configuration
```
Name: NEXTAUTH_URL
Value: https://ai-learning-platforms.vercel.app
Environment: Production, Preview, Development
```

```
Name: NEXTAUTH_SECRET
Value: ai-learning-platform-secret-key-2024-production-secure-random-string-here
Environment: Production, Preview, Development
```

```
Name: JWT_SECRET
Value: ai-learning-platform-jwt-secret-2024-another-secure-random-string
Environment: Production, Preview, Development
```

### 🔒 Step 3: Generate Secure Secrets

For `NEXTAUTH_SECRET` and `JWT_SECRET`, you can use these secure values:

**Option A: Use these pre-generated values (recommended for now):**
```
NEXTAUTH_SECRET: ai-learning-platform-production-secret-2024-a1b2c3d4e5f6g7h8i9j0k
JWT_SECRET: ai-learning-platform-jwt-secret-2024-z9y8x7w6v5u4t3s2r1q0p
```

**Option B: Generate your own:**
1. Go to [randomkeygen.com](https://randomkeygen.com/)
2. Generate a 32+ character random string
3. Use it for both NEXTAUTH_SECRET and JWT_SECRET

### 🚀 Step 4: Redeploy

After adding all environment variables:

1. Go to **Deployments** tab in Vercel
2. Click **...** menu on the latest deployment
3. Select **"Redeploy"** to apply the new environment variables

### ✅ Step 5: Test the Fix

After redeployment, visit:
- [https://ai-learning-platforms.vercel.app/auth](https://ai-learning-platforms.vercel.app/auth)
- Try registration and login - should now work perfectly!

## 🔍 What These Variables Do

- **DATABASE_URL**: Connects to your PostgreSQL database
- **PRISMA_DATABASE_URL**: Same as DATABASE_URL for Prisma ORM
- **NEXTAUTH_URL**: Tells NextAuth where your app is hosted
- **NEXTAUTH_SECRET**: Secures authentication tokens
- **JWT_SECRET**: Secures JWT tokens for session management

## 🆘 Troubleshooting

If login/register still don't work after setting environment variables:

1. **Check Vercel Function Logs:**
   - Go to Vercel → Your Project → Functions
   - Click on `/api/auth/register` or `/api/auth/login`
   - Check for error messages

2. **Common Issues:**
   - Database URL format incorrect
   - Missing SSL mode in database URL
   - Environment variables not applied to all environments

3. **Verify Environment Variables:**
   - Ensure all values are copied exactly
   - No extra spaces or quotes
   - Database URL ends with `?sslmode=require`

## 🎯 Expected Result

After setup:
- ✅ Registration works: `POST /api/auth/register`
- ✅ Login works: `POST /api/auth/login`  
- ✅ Database queries successful
- ✅ User authentication functional
- ✅ No more "internal server error"

Your AI Learning Platform will be fully functional on Vercel! 🚀