#!/bin/sh
git add --all
git stash
git pull
git submodule init
git submodule update
chmod -R a+rx .
