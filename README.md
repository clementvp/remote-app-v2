# Remote-app-v2  
A ionic React/Capacitor remote app for sending basic controls to the remote server  
Build with [Capacitor](https://capacitorjs.com/)

## Dev
Install dependencies :`npm install`   
Serve a browser version: `ionic serve`  


## Build for android
To build for Android you must have Android studio and a version of the Android SDK Platforms for API 21 or greater  
You can see the [android documentation](https://capacitorjs.com/docs/android) of Capacitor

Build for the first time: `ionic build`  
Add the Android platform to the project: `npx cap add android`  
Open Android studio with the loaded project: `npx cap open android`  

You need to add `android:usesCleartextTraffic="true"` to the application block in the `manifest.xml` of the app  

You can now run the app on an Android Emulator or A Android Device

