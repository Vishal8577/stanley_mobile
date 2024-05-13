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

  const errorMessage = {
    email: 'Please enter email id',
    password: 'Please enter password',
    phone: 'Please enter phone number',
  };
  const handleLogin = async () => {
    try {

      if (selectedInput === 'email') {
        if (!email) {
          setIsEmail(true);
          return;
        } else {
          setIsEmail(false);
        }
      } else if (selectedInput === 'phone') {
        if (!phone) {
          setIsPhone(true);
          return;
        } else {
          setIsPhone(false);
        }
      }

      if (!password) {
        setIsPassword(true);
        return;
      } else {
        setIsPassword(false);
      }

      if (selectedInput === 'phone') {
        try {
          if (phone.length < 10) {
            Alert.alert('Correct the phone format');
          } else {
            console.log(
              'Checking credentials - Phone:',
              phone,
              'Password:',
              password,
            );

            setLoading(true);
            firebase
              .firestore()
              .collection('user')
              .where('phone', '==', phone)
              .get()
              .then(async doc => {
                console.log('firebase storage ----------->', doc.docs);
                if (doc.docs.length === 0) {
                  setLoading(false);
                  return;
                }
                const userSnapshot = doc.docs[0]._data;
                console.log('fbUserData----->', fbUserData);

                const apiKey = '11091077-a9d5-11e8-a895-0200cd936042';
                const otpTemplateName = 'OTP1';
                const apiUrl = `https://2factor.in/API/V1/${apiKey}/SMS/${phone}/AUTOGEN2/${otpTemplateName}`;

                try {
                  const result = await fetch(apiUrl);
                  const data = await result.json();
                  setOTPResponse(data);

                  if (!userSnapshot.empty) {
                    navigation.replace('otpVerification', {
                      phoneNumber: phone,
                      otpResponse: data,
                      fbUserData: userSnapshot,
                      password: password,
                    });
                  } else {
                    console.log('User not found or fbUserData is null');
                    setLoading(false);
                    setLoadingModal(true);
                    setModalMessage('Invalid login credentials.');
                    setTimeout(() => {
                      setLoadingModal(false);
                    }, 2000);
                  }
                } catch (error) {
                  console.error('Error sending OTP:', error);
                  setOTPResponse({ error: 'Error sending OTP' });
                  setLoading(false);
                  return;
                }
              })
              .catch(error => {
                console.error(error);
              });
          }
        } catch (error) {
          console.error('Error checking phone and password:', error);
          setLoading(false);
          setLoadingModal(true);
          setModalMessage('An error occurred. Please try again.');
          setTimeout(() => {
            setLoadingModal(false);
          }, 2000);
        }
      } else {
        setLoading(true);

        // Check if the user with the provided email exists in Firestore
        firebase
          .firestore()
          .collection('user')
          .where('email', '==', email)
          .get()
          .then(querySnapshot => {
            if (!querySnapshot.empty) {
              // User exists in Firestore
              const userSnapshot = querySnapshot.docs[0].data();
              console.log('fbUserData----->', userSnapshot);

              // Proceed with signing in the user
              signInUser(email, password)
                .then(response => {
                  // setLoading(false);
                  console.log('User signed in!');
                  console.log('API Response=>' + JSON.stringify(response));

                  // Continue with the logic for handling the signed-in user
                  firebase
                    .firestore()
                    .collection('user')
                    .doc(response.user.uid)
                    .get()
                    .then(doc => {
                      if (doc.exists) {
                        const fbUser = doc.data();
                        console.log(
                          'firebase object2--------->' + JSON.stringify(fbUser),
                        );

                        getCandidateStatus(fbUser.sf_id)
                          .then(res => {
                            console.log('status res', res);
                            setLoading(false)
                            if (res.candidate_status) {
                              const userStatus =
                                res.candidate_status.toLowerCase();

                              console.log('userStatus', userStatus);
                              switch (userStatus) {
                                case 'new':
                                  navigation.replace('interviewscheduling');
                                  break;
                                case 'document upload':
                                  navigation.replace('documentUpload');
                                  break;
                                case 'active':
                                  navigation.replace('dashboard');
                                  break;
                                default:
                                  navigation.replace('inactive_screen');
                                  break;
                              }
                            } else {
                              navigation.replace('inactive_screen');
                            }
                          })
                          .catch(error => {
                            setLoading(false);
                            console.error(error);
                            setLoadingModal(true);
                            setModalMessage('Invalid login credentials.');
                            setTimeout(() => {
                              setLoadingModal(false);
                            }, 2000);
                          });
                      }
                    })
                    .catch(error => {
                      setLoading(false);
                      console.error(error);
                      setLoadingModal(true);
                      setModalMessage('Invalid login credentials.');
                      setTimeout(() => {
                        setLoadingModal(false);
                      }, 2000);
                    });
                })
                .catch(error => {
                  setLoading(false);
                  console.error('Error signing in:', error);
                  setLoadingModal(true);
                  setModalMessage('Invalid login credentials.');
                  setTimeout(() => {
                    setLoadingModal(false);
                  }, 2000);
                });
            } else {
              // User does not exist in Firestore
              setLoading(false);
              setLoadingModal(true);
              setModalMessage('Invalid login credentials.');
              setTimeout(() => {
                setLoadingModal(false);
              }, 2000);
            }
          })
          .catch(error => {
            setLoading(false);
            console.error(error);
            setLoadingModal(true);
            setModalMessage('An error occurred. Please try again.');
            setTimeout(() => {
              setLoadingModal(false);
            }, 2000);
          });
      }
    } catch (error) {
      // Handle any other errors if needed

      console.error('Error in handleLogin:', error);
    }
  };

  const handlefPassword = async () => {
    if (selectedInput === 'email') {
      if (!email) {
        setIsEmail(true);
        return;
      } else {
        setIsEmail(false);
      }
    } else if (selectedInput === 'phone') {
      if (!phone) {
        setIsPhone(true);
        return;
      } else {
        setIsPhone(false);
      }
    }

    try {
      const userSnapshot = await firebase
        .firestore()
        .collection('user')
        .where('email', '==', email)
        .get();

      if (userSnapshot.empty) {
        setModalTitle('Email Not Found');
        setModalMessage('No user found with this email address.');
        setLoadingModal(true);
        setTimeout(() => {
          setLoadingModal(false);
        }, 2000);
      } else {
        setLoading(true);
        await handleForgotPassword(email);
        setLoading(false);
        setModalTitle('Check your email');
        setModalMessage('A password reset link has been sent to your email.');
        setLoadingModal(true);
        setTimeout(() => {
          setLoadingModal(false);
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      setModalTitle('Reset Failed');
      setModalMessage(error.message);
      setLoadingModal(true);
      setTimeout(() => {
        setLoadingModal(false);
      }, 2000);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1, paddingBottom: 15, backgroundColor: '#fff' }}>
        <ScrollView>
          <LoadingModal visible={loading} text="Please wait..." />
          <View style={styles.topbarContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.replace('home');
              }}>
              <Image style={styles.backButton} source={imagePath.BACK_IMAGE} />
            </TouchableOpacity>
          </View>
          {/* <ResponseModel
          visible={loadingModal}
          title={modalTitle}
          message={modalMessage}></ResponseModel> */}
          <View
            style={{
              marginTop: '5%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={styles.textHeading}>Login</Text>
            <Text style={{ color: 'gray', marginBottom: 20 }}>
              Hello, Welcome Back
            </Text>
          </View>
          <View style={styles.container}>
            {/* <Text style={styles.labelText}>Select Login Type</Text> */}
            <View
              style={{
                flexDirection: 'row',
                marginVertical: 20,
                marginBottom: '15%',
                marginHorizontal: 2,
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                onPress={() => setSelectedInput('email')}
                style={
                  selectedInput === 'email'
                    ? styles.selectedInput
                    : styles.inputTypeButton
                }>
                <Text style={styles.inputTypeButtonText}>Email ID</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSelectedInput('phone')}
                style={
                  selectedInput === 'phone'
                    ? styles.selectedInput
                    : styles.inputTypeButton
                }>
                <Text style={styles.inputTypeButtonText}>Phone Number</Text>
              </TouchableOpacity>
            </View>

            {selectedInput === 'email' && (
              <>
                <Text style={styles.labelText}>Email Id</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setEmail}
                  value={email}
                  placeholder="Email"
                  placeholderTextColor={'#97A3B5'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {isEmail ? (
                  <Text style={styles.errorText}>{errorMessage.email}</Text>
                ) : null}
              </>
            )}

            {selectedInput === 'phone' && (
              <>
                <Text style={styles.labelText}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={setPhone}
                  value={phone}
                  maxLength={10}
                  placeholder="Phone Number"
                  placeholderTextColor={'#97A3B5'}
                  keyboardType="phone-pad"
                />
                {isPhone ? (
                  <Text style={styles.errorText}>{errorMessage.phone}</Text>
                ) : null}
              </>
            )}

            <Text style={styles.labelText}>Password</Text>
            <View style={styles.pwdContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                placeholderTextColor={'#97A3B5'}
                secureTextEntry={!showPassword}
              />
              {/* <TouchableOpacity 
            onPress={toggleShowPassword}
            style={{ position: 'absolute', right: 10, top: 16 }}>
            <Image
            source={imagePath.PassEye}>
            </Image>
            </TouchableOpacity> */}

              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#aaa"
                style={{ position: 'absolute', right: 10, top: 12 }}
                onPress={toggleShowPassword}
              />
            </View>
            {isPassword ? (
              <Text style={styles.errorText}>{errorMessage.password}</Text>
            ) : null}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={handlefPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
        <KeyboardAvoidingView
          style={{ width: '85%', alignSelf: 'center',marginTop:100 }}
          keyboardVerticalOffset={0}>


          <View style={{ width: '100%' }}>
            <View style={styles.bottomContainer}>
              <TouchableOpacity
                onPress={handleLogin}
                style={[styles.loginBtnContinue, styles.btnContinue]}>
                <Text style={styles.loginTxtCont}>
                  {selectedInput === 'phone' ? 'Send Verification code' : 'Login'}
                </Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: '5%',
                alignSelf: 'center',
              }}>
              <Text style={{ color: '#000', fontWeight: '400' }}>
                Don't have an account?
              </Text>
              <View>
                <TouchableOpacity onPress={() => navigation.navigate('register')}>
                  <Text
                    style={{ color: '#654cfd', fontWeight: '600', marginLeft: 5 }}>
                    Sign Up for free
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 20,
    marginHorizontal: 30,
  },
  pwdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  topbarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    marginTop: 0,
    marginTop: '8%',
  },

  backButton: {
    marginLeft: 30,
  },
  title: {
    fontSize: 24,
    color: GlobalStyle.colors.themeGreen,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DFDFDF',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    color: '#000',
    paddingVertical: 10,
    paddingRight: 10,
  },
  button: {
    backgroundColor: GlobalStyle.colors.themeGreen,
    width: '100%',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'flex-end',

  },
  forgotPasswordText: {
    color: '#654CFD',
    fontWeight: '500',
    fontSize: 14
  },

  textHeading: {
    color: '#654cfd',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: '5%',
    paddingBottom: 10,
  },
  loginBtnContinue: {
    backgroundColor: '#654cfd',
    borderWidth: 1,
    borderColor: '#654cfd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  btnContinue: {
    width: '100%',
    height: 50,
    textAlignVertical: 'bottom',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
  },
  textRegister: {
    textAlignVertical: 'bottom',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 70,
    color: 'black',
  },
  loginTxtCont: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  labelText: {
    fontFamily: 'Ubuntu',
    fontSize: 16,
    fontWeight: '700',
    paddingBottom: 5,
    color: '#000',
  },
  spinner: {
    marginTop: 20,
  },
  selectedInput: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomColor: '#654cfd',
    borderBottomWidth: 4,
    color: '#654cfd',
    backgroundColor: '#F4F2FF'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
    color: 'white',
  },
  errorText: {
    color: '#3E3E3C',
    fontWeight: 'bold',
    color: 'red',
    // alignSelf: "left",
  },
  bottomContainer: {
    // paddingVertical:"15%",
    alignItems: 'center',
  },
  inputTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomColor: 'gray',
    borderBottomWidth: 2,
  },
  inputTypeButtonText: {
    color: '#654CFD',
    fontWeight: '500',
  },
});

export default Login;
