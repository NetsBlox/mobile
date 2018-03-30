#!/bin/bash

# updates the netsblox submodule.

target_branch=tmp-master
# exit and warn if any cmd failed
set -e

cd netsblox
git checkout master
git branch -d $target_branch
git pull
git checkout $target_branch
git submodule update
npm i
cd ..
npm run build
