import React, { useState } from 'react';
import { firebase } from '@react-native-firebase/app';
import '@react-native-firebase/firestore';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import LoadingModal from '../../../components/spinner';
import ResponseModel from '../../../components/responseModal';
import { signInUser, handleForgotPassword } from '../../../utils/AuthService';
import GlobalStyle from '../../../assets/css/style';
import imagePath from '../../../utils/imagePath';
import { useNavigation } from '@react-navigation/core';
import { getCandidateStatus } from '../../../api/sf_apis';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [isEmail, setIsEmail] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [selectedInput, setSelectedInput] = useState('email');
  const [modalTitle, setModalTitle] = useState('Invalid Login');
  const [modalMessage, setModalMessage] = useState('Login successfully!');
  const [otpResponse, setOTPResponse] = useState('');
  const [fbUserData, setFbUserData] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();



  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 20,
          backgroundColor: '#EBEBEB',
          alignItems: 'center',
        }}>
        <Image source={imagePath.DOOR_TO_DOOR} style={styles.deliveryImage} />
        <Text style={styles.subHeading}>
          Ready to hit the road and deliver joy door-to-door!
        </Text>
      </View>

      <View
        style={{
          alignItems: 'center',
          paddingVertical: '5%',
          flexGrow: 1,
          marginHorizontal: '5%',
        }}>
        <Text style={styles.heading}>Login</Text>
        <Text
          style={{
            color: '#939393',
            fontSize: 14,
            fontWeight: '400',
            marginVertical: '2%',
          }}>
          {' '}
          Welcome Back!
        </Text>

        <View style={styles.placeholder}>
          <TextInput
            value={email}
            onChangeText={(e) => {
              setEmail(e);
            }}
            placeholder="Email"
            placeholderTextColor="#67696B"
            style={styles.inputContainer}
          />
        </View>

        <View style={styles.placeholder}>
          <TextInput
            value={password}
            onChangeText={e => {
              setPassword(e);
            }}
            placeholder="Password"
            placeholderTextColor="#67696B"
            style={styles.inputContainer}
            keyboardType="password"
            secureTextEntry={true}
          />
        </View>

        <TouchableOpacity style={{alignSelf: 'flex-end', marginTop: '2%'}}>
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </TouchableOpacity>

        <View style={{flexDirection: 'row', marginTop: '5%'}}>
          <Text style={{color: '#000', fontSize: 14, fontWeight: '400'}}>
            Don’t have an account?{' '}
          </Text>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Sign up </Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.technicianButton} onPress={()=>navigation.navigate('deliverydashboard')}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  deliveryImage: {
    height: 150,
    width: 150,
    marginVertical: '4%',
  },
  heading: {
    color: '#1A1A1A',
    fontWeight: '700',
    fontSize: 24,
    fontFamily: 'DM Sans',
    marginVertical: '2%',
  },
  subHeading: {
    color: '#4E4E4E',
    fontSize: 14,
    fontWeight: '400',
    marginVertical: '2%',
  },
  buttonText: {color: '#FFF', fontSize: 16, fontWeight: '500'},
  driverButton: {
    marginBottom: '4%',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '5%',
    backgroundColor: '#BC562D',
  },
  technicianButton: {
    marginBottom: '4%',
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '5%',
    backgroundColor: '#263238',
  },
  inputContainer: {
    flex: 1,

    fontSize: 12,
    color: '#000',
  },
  placeholder: {
    borderWidth: 1.5,
    borderRadius: 10,
    borderColor: '#CCD0D4',
    height: 50,
    marginTop: '5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#0B73FF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default Login;
