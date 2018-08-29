#!/bin/bash

# updates the netsblox submodule.

target_branch=tmp-master

# routine to ensure a clean and uptodate branch: fetch, delete branch, checkout branch, pull

cd netsblox
git checkout master
git branch -d $target_branch
git pull
git fetch
git checkout $target_branch
git submodule update
npm i
cd ..
npm run build
