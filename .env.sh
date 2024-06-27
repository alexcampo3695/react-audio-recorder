#!/bin/sh
# Recreate config file
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js
echo "  VITE_PROD_BACKEND_URL: \"$VITE_PROD_BACKEND_URL\"," >> /usr/share/nginx/html/env-config.js
echo "  VITE_OPENAI_API_KEY: \"$VITE_OPENAI_API_KEY\"" >> /usr/share/nginx/html/env-config.js
echo "}" >> /usr/share/nginx/html/env-config.js