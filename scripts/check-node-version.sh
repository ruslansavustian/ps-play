#!/bin/bash

# Check if Node.js version is 20 or higher
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)

if [ "$NODE_VERSION" -lt 20 ]; then
    echo "❌ Error: Node.js version 20 or higher is required"
    echo "Current version: $(node -v)"
    echo "Please update Node.js to version 20 or higher"
    exit 1
else
    echo "✅ Node.js version $(node -v) is compatible"
fi 