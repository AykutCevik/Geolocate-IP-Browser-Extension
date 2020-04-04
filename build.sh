#!/bin/bash

copyDevFunction()
{
    echo "Copying files to ./dev/"
    rm -rf ./dev/*
    cp -rf css ./dev/
    cp -rf js ./dev/
    cp -rf img ./dev/
    cp background.html ./dev/
    cp manifest.json ./dev/
    cp options.html ./dev/
    cp popup.html ./dev/
}

prepareChromeFunction()
{
    echo "Preparing manifest.json for Chrome"
    sed -i -e '28,32d;19d;35d' ./dev/manifest.json
}

prepareFirefoxFunction()
{
    echo "Preparing manifest.json for Firefox"
    sed -i -e '14d;16d;17d' ./dev/manifest.json
    cd ./dev/
    zip -qr firefox.zip ./*
    cd ..
    echo "Package for Firefox in ./dev/ created."
}

prepareOperaFunction()
{
    echo "Preparing manifest.json for Opera"
    echo "Right now it is the same as Chrome, going for it..."
    prepareChromeFunction
}

if [ -z "$1" ] || ([ "$1" != "dev" ] && [ "$1" != "package" ])
    then
    echo ""
    echo "Usage: $0 [dev chrome|firefox|opera] [package chrome|firefox|opera]"
    echo -e "\tdev [chrome|firefox|opera] - Copies extension files into ./dev/ folder to load it from any browser in development mode. Archive file is for Firefox."
    echo -e "\tpackage [chrome|firefox|opera] - creates production ready archives to upload them on the specific extension store."
    exit 1
fi

echo "Running $1 command..."

if [ "$1" == "dev" ]
    then
    mkdir -p ./dev/
    copyDevFunction
    if [ "$2" == "chrome" ]
        then
        prepareChromeFunction
    elif [ "$2" == "opera" ]
        then
        prepareOperaFunction
    else
        prepareFirefoxFunction
    fi
    echo "Done, now load extension in browser."
fi

if [ "$1" == "package" ]
    then
    mkdir -p ./build/
    echo "To be developed...."
fi

exit 0