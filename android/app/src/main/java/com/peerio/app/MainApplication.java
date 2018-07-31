package com.peerio.app;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.filepicker.FilePickerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.BV.LinearGradient.LinearGradientPackage;
import com.chirag.RNMail.RNMail;
import com.idehub.Billing.InAppBillingBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.zmxv.RNSound.RNSoundPackage;
import cl.json.RNSharePackage;
import com.avishayil.rnrestart.ReactNativeRestartPackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.imagepicker.ImagePickerPackage;
import com.rnfs.RNFSPackage;
import com.fileopener.FileOpenerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import org.pgsqlite.SQLitePluginPackage;
// import com.facebook.stetho.Stetho;
import com.facebook.soloader.SoLoader;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, false);
        // Stetho.initializeWithDefaults(this);
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new KCKeepAwakePackage(),
                    new FilePickerPackage(),
                    new PickerPackage(),
                    new ReactNativeContacts(),
                    new RNSodiumPackage(),
                    new RNKeychainPackage(),
                    new LinearGradientPackage(),
                    new RNMail(),
                    new InAppBillingBridgePackage(),
                    new VectorIconsPackage(),
                    new RNSoundPackage(),
                    new ReactNativeRestartPackage(),
                    new RandomBytesPackage(),
                    new ReactNativePushNotificationPackage(),
                    new ImagePickerPackage(),
                    new FileOpenerPackage(),
                    new RNDeviceInfo(),
                    new RNSharePackage(),
                    new SQLitePluginPackage(),
                    new RNFSPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
