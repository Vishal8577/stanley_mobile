import React, {useEffect, useState} from 'react';
import SplashScreen from './src/components/splashScreen/splashscreen';
import AppNavigator from './src/Navigations/AppNavigations';
import auth from '@react-native-firebase/auth';
// import {firebaseConfig} from './src/config/firebaseConfig';
// import {firebase} from '@react-native-firebase/app';
import {setUser, clearUser} from './src/redux/userActions';
import {store} from './src/redux/store';
import {Provider} from 'react-redux';
import {PaperProvider} from 'react-native-paper';

const App = () => {
  //Firebase setup
  const [initializing, setInitializing] = useState(true);
  const [loggedinUser, setloggedinUser] = useState();
  // console.log('--- fb apps', firebase.apps);

  // Initialize Firebase
  // if (!firebase.apps.length) {
  //   firebase.initializeApp(firebaseConfig);
  // } else {
  //   firebase.app(); // if already initialized, use that one
  // }

  // Handle user state changes
  function onAuthStateChanged(user) {
    console.log('--- auth state changed called with user:', user);
    if (user) {
      const userData = {uid: user.uid, email: user.email};
      firebase
        .firestore()
        .collection('user')
        .doc(user.uid)
        .get()
        .then(doc => {
          console.log('doc --->', doc);
          if (doc.exists) {
            const additionalData = doc.data();
            setloggedinUser({...userData, ...additionalData});
            store.dispatch(setUser({...userData, ...additionalData}));
          } else {
            store.dispatch(setUser(userData));
            setloggedinUser(userData);
          }
        });
    } else {
      // User is signed out.
      store.dispatch(clearUser());
    }
    setTimeout(() => {
      setInitializing(false);
    }, 3000);
  }

  useEffect(() => {
    setTimeout(() => {
      setInitializing(false);
    }, 3000);
    // const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    // return subscriber; // unsubscribe on unmount
  }, []);

  if (initializing) {
    return <SplashScreen />;
  }
  return (
    <>
      {
        <Provider store={store}>
          <PaperProvider>

          <AppNavigator />
          </PaperProvider>
        </Provider>
      }
    </>
  );
};

export default App;
