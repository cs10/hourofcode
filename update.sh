#!/bin/sh
git add --all
git stash
git pull
./post-update.sh
