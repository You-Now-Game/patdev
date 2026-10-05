#!/bin/sh
set -eu

mkdir -p /app/public/uploads
chown -R nextjs:nodejs /app/public/uploads

cd /app
node /app/node_modules/prisma/build/index.js migrate deploy

exec su-exec nextjs:nodejs node server.js
