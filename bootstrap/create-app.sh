#!/bin/bash

if [ $# -eq 0 ]
  then
    echo "Not enough args"
    echo "Usage: create-app.sh [name of app]"
    exit -1
fi

if [ $# -gt 1 ]
  then
    echo "Too many args"
    echo "Usage: create-app.sh [name of app]"
    exit -1
fi

app=$1
path=$(pwd)
mkdir -p "$path/app/$app/controllers"
mkdir -p "$path/app/$app/services"
mkdir -p "$path/app/$app/schemas"

touch "$path/app/$app/router.js"
touch "$path/app/$app/sql.sql"

touch "$path/app/$app/controllers/index.js"
touch "$path/app/$app/controllers/fetch.js"
touch "$path/app/$app/controllers/fetch_all.js"
touch "$path/app/$app/controllers/create.js"
touch "$path/app/$app/controllers/update.js"
touch "$path/app/$app/controllers/remove.js"

touch "$path/app/$app/schemas/create.js"
touch "$path/app/$app/schemas/update.js"

touch "$path/app/$app/services/fetch.js"
touch "$path/app/$app/services/fetch_all.js"
touch "$path/app/$app/services/create.js"
touch "$path/app/$app/services/update.js"
touch "$path/app/$app/services/remove.js"

echo "$app created."
