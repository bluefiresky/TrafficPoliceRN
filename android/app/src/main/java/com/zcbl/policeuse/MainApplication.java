package com.zcbl.policeuse;

import android.app.Application;

import com.facebook.react.ReactApplication;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.rnziparchive.RNZipArchivePackage;
import com.rnfs.RNFSPackage;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.remobile.toast.RCTToastPackage;
import com.rssignaturecapture.RSSignatureCapturePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.beefe.picker.PickerViewPackage;
import com.imagepicker.ImagePickerPackage;
import com.remobile.toast.RCTToastPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.zcbl.policeuse.modules.ModuleManagerPackage;
import com.reactnative.photoview.PhotoViewPackage;
import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNViewShotPackage(),
          new OrientationPackage(),
          new RNZipArchivePackage(),
          new RNFSPackage(),
          new RSSignatureCapturePackage(),
          new VectorIconsPackage(),
          new PickerViewPackage(),
          new ImagePickerPackage(),
          new RCTToastPackage(),
          new ModuleManagerPackage(),
          new PhotoViewPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
