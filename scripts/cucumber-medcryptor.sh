rm -rf test/reports/*.json
source ./env.sh

export APP_LABEL='medcryptor'
export EXECUTABLE_NAME='medcryptor'

cd ios
xcodebuild \
    -project peeriomobile.xcodeproj \
    -configuration Debug \
    -scheme peeriomobile \
    -destination platform="iOS Simulator,name=$PEERIO_IOS_SIM,OS=$PEERIO_IOS_VERSION" \
    -derivedDataPath build

cd ..
./node_modules/.bin/cucumberjs test/spec \
    -r test/code \
    -f node_modules/cucumber-pretty \
    -f json:test/reports/result-ios.json \
    --tags "@medcryptor" \
    --world-parameters "{\"platform\": \"ios\"}"

cd android
./gradlew assembleDebug

cd ..
./node_modules/.bin/cucumberjs test/spec \
    -r test/code \
    -f node_modules/cucumber-pretty \
    -f json:test/reports/result-android.json \
    --tags "@medcryptor" \
    --world-parameters "{\"platform\": \"android\"}"

node test/reports/generate-report.js