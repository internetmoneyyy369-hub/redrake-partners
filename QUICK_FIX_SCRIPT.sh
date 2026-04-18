#!/bin/bash

# Quick fix script to replace all Clerk imports with Supabase auth

# Replace in all API route files
find apps -name "*.ts" -type f -exec sed -i "s/import { auth } from '@clerk\/nextjs\/server'/import { getUser } from '@redrake\/db'/g" {} \;
find apps -name "*.ts" -type f -exec sed -i "s/import { auth, clerkClient } from '@clerk\/nextjs\/server'/import { getUser } from '@redrake\/db'/g" {} \;

# Replace auth() usage pattern
find apps -name "*.ts" -type f -exec sed -i "s/const { userId } = await auth()/const user = await getUser()/g" {} \;
find apps -name "*.ts" -type f -exec sed -i "s/if (!userId)/if (!user)/g" {} \;

echo "Fixed all Clerk imports!"
