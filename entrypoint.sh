#!/bin/bash
# sequelize:migrate --env production-ssl-disabled
npm run set:post-build
node dist/index.js
