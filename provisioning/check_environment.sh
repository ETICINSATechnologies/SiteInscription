#!/bin/bash

check_program() {
    if [ -x "$(command -v $1)" ]; then
        echo "$1 checked"
    else
        echo "$1 is missing or you don't have the rights to access it"
        exit 1
    fi
}

check_file() {
    if [ -f "$1" ]; then
        echo "$1 checked"
    else
        echo "$1 does not exist"
        exit 1
    fi
}



copy_file() {
    if [ -f "$2" ]; then
        rm $2
    fi
    cp $1 $2
}

success_message() {
    echo "Environment check complete"
}

check_program docker
check_program docker-compose
check_file .env
copy_file .env ./client/.env
copy_file .env ./server/.env

success_message
