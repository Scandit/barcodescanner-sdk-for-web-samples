import React, {useEffect, useState} from 'react';
import {BackHandler, StyleSheet} from 'react-native';

import {WebView} from 'react-native-webview';

import * as CameraPermission from './CameraPermission';

function App(): JSX.Element {
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    CameraPermission.requestCameraPermissionsIfNeeded()
      .then(() => setPermissionGranted(true))
      .catch(() => BackHandler.exitApp());
  }, []);

  const renderWebview = (hasPermission: boolean) => {
    if (!hasPermission) {
      return <></>;
    }

    return (
      <WebView
        source={{
          uri: 'https://websdk5.demos.scandit.com/',
        }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsFullscreenVideo={true}
        allowFileAccess={true}
        allowsInlineMediaPlayback={true}
      />
    );
  };

  return renderWebview(permissionGranted);
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    backgroundColor: 'blue',
  },
  webview: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'red',
  },
});

export default App;
