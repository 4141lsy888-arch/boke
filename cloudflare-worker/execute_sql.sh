#!/bin/bash
echo "Y" | npx wrangler d1 execute boke-d1 --remote --file=init_database.sql
