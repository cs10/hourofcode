#!/bin/sh
git stash
git pull
git submodule init
git submodule update
