import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  Pressable,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import GlobalStyle from '../../../assets/css/style';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { STATE_OBJ } from '../../../utils/constants';
import LoadingModal from '../../../components/spinner';
import ResponseModel from '../../../components/responseModal';
import { TypePredicateKind } from 'typescript';
import { setUser as setStoreUser, clearUser } from '../../../redux/userActions';
import { store } from '../../../redux/store';
import { createUser, deleteUser } from '../../../utils/AuthService';
import imagePath from '../../../utils/imagePath';
import { getCountryState } from '../../../api/sf_apis';

const Register = props => {
  const [loading, setLoading] = useState(false);
  const [loadingModal, setLoadingModal] = useState(false);
  const [modalMessage, setModalMessage] = useState(
    'You have registered successfully!',
  );
  const [passwordError, setError] = useState('');
  const [isContactPerson, setContactPerson] = useState(false);
  const [isStreet, setStreet] = useState(false);
  const [isCountry, setCountry] = useState(false);
  const [isState, setState] = useState(false);
  const [isCity, setCity] = useState(false);
  const [isPincode, setPincode] = useState(false);
  const [isPhoneNumber, setPhoneNumber] = useState(false);
  const [isEmailId, setEmailId] = useState(false);
  const [isPassword, setPassword] = useState(false);
  const [isConfirmPassword, setConfirmPassword] = useState(false);
  const [isPasswordMissmatch, setPasswordMissmatch] = useState(false);
  const [isPasswordLength, setPasswordLength] = useState(false);
  const [isValidEmail, setValidEmail] = useState(false);
  const [isFirstName, setFirstName] = useState(false);
  const [isLastName, setLastName] = useState(false);
  const [cityCountyMap, setCityCountyMap] = useState([]);
  const [selectedCounty, setSelectedCounty] = useState('Alameda');
  const [selectedCity, setSelectedCity] = useState([]);
  const [allCounty, setAllcounty] = useState([]);
  useEffect(() => {
    getCountry();
  }, []);

  const navigation = useNavigation();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    street: '',
    country: 'United States',
    state: 'California',
    county: '',
    city: '',
    pincode: '',
    phoneNumber: '',
    emailId: '',
    password: 'password',
    confirmPassword: '',
  });
  const errorMessage = {
    firstName: 'Please enter first name',
    lastName: 'Please enter last name',
    street: 'Please enter street address',
    country: 'Please enter country name',
    state: 'Please enter state name',
    city: 'Please enter city name',
    pincode: 'Please enter pincode',
    phoneNumber: 'Please enter correct phone number',
    emailId: 'Please enter email id',
    password: 'Please enter password',
    confirmPassword: 'Please enter confirm password',
    passwordMissmatch: 'Password does not match',
    passwordLength: 'Password should contain atleast 5 characters',
    invalidEmail: 'Please enter a valid email id',
  };

  const handleInputChange = (name, value, index) => {
    // if(name=='emailId'){
    //     validateEmail(value);
    // }
    setUser(prevState => ({
      ...prevState,
      [name]: value,
    }));

    console.log(Object.values(allCounty).at(index))
    index && setSelectedCity(Object.values(allCounty).at(index))
  };
  const validateEmail = email => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
  };

  const getCountry = () => {
    getCountryState()
      .then(res => {
        // console.log('country state res', JSON.stringify(res, null, 1));
        const countyKeys = Object.keys(res);
        // console.log('countyKeys', countyKeys);
        setCityCountyMap(Object.keys(res));
        setAllcounty(res)
      })
      .catch(err => {
        console.log('country state err', err);
      });
  };


  // Event handler for city selection
  const handleCityChange = city => {
    setSelectedCity(city);
  };

  const handleContinue = () => {
    console.log('validate');
    if (!user.firstName) {
      setFirstName(true);
      return;
    } else {
      setFirstName(false);
    }
    if (!user.lastName) {
      setLastName(true);
      return;
    } else {
      setLastName(false);
    }

    if (!user.street) {
      setStreet(true);
      return;
    } else {
      setStreet(false);
    }
    if (!user.country) {
      setCountry(true);
      return;
    } else {
      setCountry(false);
    }
    if (!user.state) {
      setState(true);
      return;
    } else {
      setState(false);
    }
    // if (!user.city) {
    //   setCity(true);
    //   return;
    // } else {
    //   setCity(false);
    // }
    if (!user.pincode) {
      setPincode(true);
      return;
    } else {
      setPincode(false);
    }
    if (!user.phoneNumber) {
      setPhoneNumber(true);
      return;
    } else {
      setPhoneNumber(false);
    }
    if (!user.emailId) {
      console.log('Email id' + user.emailId);
      setEmailId(true);
      return;
    } else {
      setEmailId(false);
    }
    // if (!user.password || user.password.length < 5){
    //     setPasswordLength(true);
    //     return;
    // }else{setPasswordLength(false);}
    // if(user.password !== user.confirmPassword){
    //     setPasswordMissmatch(true);
    //     return;
    // } else{setPasswordMissmatch(false);}

    console.log(user);
    //setError('');
    console.log('clicked signup');
    setLoading(true);
    firestore()
      .collection('user')
      .where('phone', '==', user.phoneNumber)
      .get()
      .then(phoneQuerySnapshot => {
        if (!phoneQuerySnapshot.empty) {
          // Phone already in use
          setPhoneNumber(true);
          setLoading(false);
          Alert.alert('Phone number is already in use.');
          return;
        }
        console.log(user);
        setLoading(false)
        navigation.navigate('selectskills', { user: user });
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView>
        {loading ? (
          <ActivityIndicator
            size={80}
            color="black"
            style={{ marginTop: 350, width: 200, alignSelf: 'center' }}
          />
        ) : (
          <View style={styles.container}>
            <LoadingModal visible={loading} text="Please wait..." />
            <View style={{ flexDirection: 'row', justifyContent:'flex-start', marginTop:10 }}>
              <TouchableOpacity
                onPress={() => {
                  navigation.replace('home');
                }}>
                <Image
                  style={styles.backButton}
                  source={imagePath.BACK_IMAGE}
                />
              </TouchableOpacity>
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Text style={styles.textHeading}>Sign Up</Text>
              <Text style={{ color: 'gray', marginTop: 10, marginBottom: '5%' }}>
                Enter the details to get started
              </Text>
            </View>
            <Text style={styles.textPhoneNo}>
              First Name<Text style={styles.textStart}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput]}
              placeholder="first name"
              placeholderTextColor={'#97A3B5'}
              keyboardType="default"
              onChangeText={text => handleInputChange('firstName', text)}
              value={user.firstName}
            />
            {isFirstName ? (
              <Text style={styles.errorText}>{errorMessage.firstName}</Text>
            ) : null}
            <Text style={styles.textPhoneNo}>
              Last Name<Text style={styles.textStart}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput]}
              placeholderTextColor={'#97A3B5'}
              placeholder="last name"
              keyboardType="default"
              onChangeText={text => handleInputChange('lastName', text)}
              value={user.lastName}
            />
            {isLastName ? (
              <Text style={styles.errorText}>{errorMessage.lastName}</Text>
            ) : null}
            <Text style={styles.textPhoneNo}>
              Street address<Text style={styles.textStart}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput]}
              placeholderTextColor={'#97A3B5'}
              placeholder="eg. 756, Sector 15"
              keyboardType="default"
              onChangeText={text => handleInputChange('street', text)}
              value={user.street}
            />
            {isStreet ? (
              <Text style={styles.errorText}>{errorMessage.street}</Text>
            ) : null}

            <Text style={styles.textPhoneNo}>
              Country<Text style={styles.textStart}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput]}
              // onChangeText={text => handleInputChange('country', text)}
              value={user.country}
              keyboardType="default"
              readOnly
            />
            {/* <Picker
            selectedValue={selectedCounty}
            onValueChange={itemValue => handleCountyChange(itemValue)}>
            {Object.keys(cityCountyMap).map(county => (
              <Picker.Item key={county} label={county} value={county} />
            ))}
          </Picker> */}
            {isCountry ? (
              <Text style={styles.errorText}>{errorMessage.country}</Text>
            ) : null}
            <Text style={styles.textPhoneNo}>
              State<Text style={styles.textStart}>*</Text>
            </Text>
            {/* <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf: 'stretch',
              borderWidth: Platform.OS === 'ios' ? 0 : 1,
              borderRadius: 10,
              // marginVertical: Platform.OS === 'ios' ? 50 : 0,
              marginBottom: Platform.OS === 'ios' ? 180 : 0,
            }}>
            <Picker
              selectedValue={user.state}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                handleInputChange('state', itemValue)
              }>
              {Object.keys(STATE_OBJ).map(stateCode => (
                <Picker.Item
                  key={stateCode}
                  label={STATE_OBJ[stateCode]}
                  value={stateCode}
                />
              ))}
            </Picker>
          </View> */}
            <TextInput
              style={[styles.textInput]}
              // onChangeText={text => handleInputChange('country', text)}
              value={user.state}
              keyboardType="default"
              readOnly
            />
            {/* <TextInput  style={[styles.textInput]} placeholder="eg. Karnataka" keyboardType="default"
            onChangeText={(text) =>
                handleInputChange("state", text)
            }/> */}
            {isState ? (
              <Text style={styles.errorText}>{errorMessage.state}</Text>
            ) : null}
            <Text style={styles.textPhoneNo}>
              County<Text style={styles.textStart}>*</Text>
            </Text>
            <View style={{
              borderWidth: 1,
              borderColor: '#DFDFDF',
              borderRadius: 4,
              justifyContent: 'center'
            }}>
              <Picker
                style={styles.picker}
                selectedValue={user.county}
                onValueChange={(itemValue, index) => handleInputChange('county', itemValue, index)}>
                 
                {cityCountyMap.map((city, index) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
            </View>

            {/* <TextInput
              style={[styles.textInput]}
              onChangeText={text => handleInputChange('county', text)}
              value={user.county}
              keyboardType="default"
              readOnly
            /> */}
            <Text style={styles.textPhoneNo}>
              City
              {/* <Text style={styles.textStart}>*</Text> */}
            </Text>
            {/* <TextInput
            style={[styles.textInput]}
            placeholderTextColor={'#97A3B5'}
            placeholder="City"
            keyboardType="default"
            onChangeText={text => handleInputChange('city', text)}
          /> */}

            <View style={{
              borderWidth: 1,
              borderColor: '#DFDFDF',
              borderRadius: 4,
              justifyContent: 'center'
            }}>
              <Picker
                style={styles.picker}
                selectedValue={user.city}
                onValueChange={itemValue => handleInputChange('city', itemValue)}>
                {selectedCity.map((city) => (
                  <Picker.Item key={city} label={city} value={city} />
                ))}
              </Picker>
            </View>

            {isCity ? (
              <Text style={styles.errorText}>{errorMessage.city}</Text>
            ) : null}
            <Text style={styles.textPhoneNo}>
              Pincode<Text style={styles.textStart}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput]}
              placeholderTextColor={'#97A3B5'}
              placeholder="eg. 560098"
              keyboardType="numeric"
              onChangeText={text => handleInputChange('pincode', text)}
              value={user.pincode}
            />
            {isPincode ? (
              <Text style={styles.errorText}>{errorMessage.pincode}</Text>
            ) : null}
            <Text style={styles.textPhoneNo}>
              Phone Number<Text style={styles.textStart}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput]}
              placeholderTextColor={'#97A3B5'}
              maxLength={10}
              placeholder="eg. 98267799xx"
              keyboardType="default"
              onChangeText={text => handleInputChange('phoneNumber', text)}
              value={user.phoneNumber}
            />
            {isPhoneNumber ? (
              <Text style={styles.errorText}>{errorMessage.phoneNumber}</Text>
            ) : null}
            <Text style={styles.textPhoneNo}>
              Email ID<Text style={styles.textStart}>*</Text>
            </Text>
            <TextInput
              style={[styles.textInput]}
              placeholderTextColor={'#97A3B5'}
              placeholder="eg. johndon@example.com"
              keyboardType="email-address"
              onChangeText={text => handleInputChange('emailId', text)}
              value={user.emailId}
            />
            {isEmailId ? (
              <Text style={styles.errorText}>{errorMessage.emailId}</Text>
            ) : null}
            {isValidEmail ? (
              <Text style={styles.errorText}>{errorMessage.invalidEmail}</Text>
            ) : null}
            {/*<Text style={styles.textPhoneNo}>
                        Password<Text style={styles.textStart}>*</Text>
                    </Text>

                    <TextInput
                        placeholderTextColor={"#97A3B5"}
                        style={styles.textInput}
                        value={user.password}
                        onChangeText={(text) =>
                            handleInputChange("password", text)
                        }
                        placeholder="Password"
                        secureTextEntry
                    />
            {isPassword ? (
                <Text style={styles.errorText}>{errorMessage.password}</Text>
                    ) : null
            }
                    <Text style={styles.textPhoneNo}>
                        Confirm Password<Text style={styles.textStart}>*</Text>
                    </Text>
                    <TextInput
                        placeholderTextColor={"#97A3B5"}
                        style={styles.textInput}
                        value={user.confirmPassword}
                        onChangeText={(text) =>
                            handleInputChange("confirmPassword", text)
                        }
                        placeholder="Confirm Password"
                        secureTextEntry
                    />
                     {isConfirmPassword ? (
                        <Text style={styles.errorText}>{errorMessage.confirmPassword}</Text>
                    ) : null
                    }
                    {isPasswordMissmatch ? (
                        <Text style={styles.errorText}>{errorMessage.passwordMissmatch}</Text>
                    ) : null
                    }
                    {isPasswordLength ? (
                        <Text style={styles.errorText}>{errorMessage.passwordLength}</Text>
                    ) : null
                    }
                */}
            <View style={styles.container_btn}>
              <TouchableOpacity
                style={[styles.loginBtnContinue, styles.btnContinue]}
                onPress={handleContinue}>
                <Text style={styles.loginTxtCont}>Continue</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: '5%',
                marginBottom: '5%',
                alignSelf: 'center',
              }}>
              <Text style={{ color: '#000', fontWeight: '400' }}>
                Already have an account?
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('login');
                  }}>
                  <Text
                    style={{
                      color: '#654cfd',
                      fontWeight: '600',
                      marginLeft: 5,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  container_btn: {
    flex: 1,
    marginTop: 80,
  },
  loginBtnContinue: {
    backgroundColor: '#654cfd',
    borderWidth: 1,
    borderColor: '#654cfd',
    borderRadius: 8,
    bottom: 0,
  },
  loginTxtCont: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  btnContinue: {
    width: '100%',
    height: 50,
    textAlignVertical: 'bottom',
    justifyContent: 'center',
    position: 'absolute', //Here is the trick
    bottom: 0, //Here is the trick
  },
  textHeading: {
    color: '#654cfd',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 0,
  },
  textPhoneNo: {
    fontWeight: '600',
    color: '#3E3E3C',
    fontWeight: 'bold',
    paddingTop: 20,
    paddingBottom: 10,

  },
  backButton: {
    marginLeft: 0,
    marginRight: '5%',
    marginTop: '5%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DFDFDF',
    borderRadius: 4,
    height: 48,
    paddingLeft: 10,
    color: '#000',
  },
  textStart: {
    color: 'red',
  },
  container_chk: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '5%',
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 1,
    borderColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checked: {
    height: 12,
    width: 12,
    backgroundColor: '#000',
  },
  tnc: {
    color: '#654cfd',
    fontWeight: 'bold',
  },
  aggreTo: {
    color: 'black',
  },
  errorText: {
    color: '#3E3E3C',
    fontWeight: 'bold',
    color: 'red',
    // alignSelf: "left",
    //marginBottom: 10,
    // Add any other styling for the error text
  },
  picker: {
    height: 48,
    width: '100%',
    color: '#000',

  },
});
export default Register;
