import React, {useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home';
import Login from '../screens/auth/login';
import Register from '../screens/auth/register';
import {connect} from 'react-redux';
import { ActivityIndicator, Dimensions, View } from 'react-native';
import FlashMessage from 'react-native-flash-message';


const Stack = createNativeStackNavigator();
const mapStateToProps = state => ({
  currentUser: state.user.currentUser,
});

const AppNavigator = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [initialScreen, setInitialScreen] = useState('home');

  return (
    <NavigationContainer>
      {loading ? (
        <View
          style={{
            position: 'absolute',
            width: Dimensions.get('window').width,
            height: Dimensions.get('screen').height,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1,
          }}>
          <ActivityIndicator
            size={80}
            color="black"
            style={{ alignSelf: 'center' }}
          />
        </View>
      ) :
        <Stack.Navigator
          initialRouteName={initialScreen}
          screenOptions={{ headerShown: false }}>
          <Stack.Screen name="home" component={HomeScreen} />
          <Stack.Screen name="login" component={Login} />
          <Stack.Screen name="register" component={Register} />
          
        </Stack.Navigator>}
        <FlashMessage position="top" />
    </NavigationContainer>
  );
};

export default connect(mapStateToProps)(AppNavigator);
