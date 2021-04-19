#!/bin/bash

sequelize db:migrate:undo:all && sequelize db:migrate
node dist/index.js
