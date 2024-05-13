import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet,Text, Dimensions, StatusBar } from 'react-native';

import imagePath from '../../utils/imagePath';
import GlobalStyle from '../../assets/css/style';

export default function SplashScreen() {
  const { width, height } = Dimensions.get('window');
  const [isLodingScreen, setIsLodingScreen] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLodingScreen(false);
    }, 3000);
  }, []);

  return (
    <View style={{ flex: 1 }}>
          <View style={styles.splash_wrapper}>
            <Image
              resizeMode={'contain'}
              style={{height:100, width:'80%'}}
              source={imagePath.SPLASH_SCREEN_LOGO}
            />
          </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splash_wrapper: {
    flex: 1,
    backgroundColor: '#654cfd',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  screen1: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '100%',
    position: 'relative',
    textAlign: 'center',
  },
  screenTxt: {
    position: 'absolute',
    left: '45%',
    bottom: 50,
    zIndex: 2,
    fontSize: 18,
    color: '#000',
  },
});
