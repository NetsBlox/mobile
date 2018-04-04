#!/bin/bash

keystore=$1
alias=$2
version=$3
app_name=netsblox
apk_dir=platforms/android/build/outputs/apk
final_name="$app_name-release-$version.apk"
unsigned_name="$app_name-release-unsigned-$version.apk"

set -e

function safe_deletion() {
  echo version $version already exists. Do you wanna overwrite it?
  read -p "Are you sure? " -n 1 -r
  echo    # (optional) move to a new line
  if [[ $REPLY =~ ^[Yy]$ ]]
  then
    rm -i $apk_dir/$unsigned_name $apk_dir/$final_name
  fi
}


[ -f $apk_dir/$final_name ] && safe_deletion

# jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $keystore $apk_dir/$unsigned_name $alias

# zipalign -v 4 $apk_dir/$unsigned_name $apk_dir/$final_name

ionic cordova build android --prod --release -- -- --keystore=$keystore --alias=$alias

mv $apk_dir/android-release.apk $apk_dir/$final_name
echo published $app_name $version to $apk_dir/$final_name
