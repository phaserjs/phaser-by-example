echo "Bulding"
npm run-script build && echo "DONE!"

WIN64VERSION=tracktruck-win-x64

rm -rf dist/assets/html
cp package.json dist/
rm -rf $WIN64VERSION
# npx nwb nwbuild -v 0.55.0-sdk -p win32,osx64 ./dist/
npx nwb nwbuild -v 0.55.0-sdk -p win64 ./dist/
mkdir dist/download

zip -r $WIN64VERSION.zip $WIN64VERSION && mv $WIN64VERSION.zip dist/download
#zip -r $MACVERSION.zip $MACVERSION && mv $MACVERSION.zip dist/download