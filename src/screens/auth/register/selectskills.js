import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import imagePath from '../../../utils/imagePath';
import RNPickerSelect from 'react-native-picker-select';
import MultiSelect from 'react-native-multiple-select';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {createUser, deleteUser} from '../../../utils/AuthService';
import LoadingModal from '../../../components/spinner';
import ResponseModel from '../../../components/responseModal';
import {TypePredicateKind} from 'typescript';
import {setUser as setStoreUser, clearUser} from '../../../redux/userActions';
import {store} from '../../../redux/store';

import {singup} from '../../../api/sf_apis';

const MultiPicklist = ({
  selectedValues,
  onSelectChange,
  options,
  groupName,
}) => (
  <View key={groupName}>
    <Text
      style={{
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
      }}>
      {groupName}
    </Text>
    <View style={styles.checkboxContainer1}>
      {options.map(option => (
        <View key={option} style={styles.checkboxItem}>
          <CheckBox
            value={selectedValues.includes(option)}
            onValueChange={() => {
              const updatedSkills = selectedValues.includes(option)
                ? selectedValues.filter(s => s !== option)
                : [...selectedValues, option];

              onSelectChange(updatedSkills);
            }}
            style={styles.checkbox}
            tintColors={{
              true: '#654cfd',
              false: '#000',
            }}
          />
          <Text style={styles.checkboxLabel}>{option}</Text>
        </View>
      ))}
    </View>
  </View>
);

const SelectSkills = props => {
  const {user} = props.route.params;
  console.log('user Data on select skills screen------->', user);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [modalMessage, setModalMessage] = useState(
    'You have registered successfully!',
  );
  const [loadingModal, setLoadingModal] = useState(false);
  const [selectedStaffTypes, setSelectedStaffType] = useState([]);
  const [selectedKeySkill, setSelectedKeySkill] = useState({});
  const [selectXRay, setSelectRay] = useState({});
  const [selectedMultiPicklist, setSelectedMultiPicklist] = useState([]);
  const [selectedFrontOfficeSkill, setSelectedFrontOfficeSkill] = useState({});
  const [selectedHygienistSkill, setSelectedHygienistSkill] = useState({});
  const [otpResponsee, setOTPResponse] = useState('');

  const [showAssistantCard, setShowAssistantCard] = useState(false);
  const [showDentalCard, setShowDentalCard] = useState(false);
  const [AssistantButtonActive, setAssistantButtonActive] = useState(false);
  const [DentalButtonActive, setDentalButtonActive] = useState(false);

  const [showFrontOfficeCard, setShowFrontOfficeCard] = useState(false);
  const [FrontOfficeButtonActive, setFrontOfficeButtonActive] = useState(false);

  const [showHygienistCard, setShowHygienistCard] = useState(false);
  const [HygienistButtonActive, setHygienistButtonActive] = useState(false);

  const [multiSelectedValues, setMultiSelectedValues] = useState([]);
  const [pmsMultiSelectedValues, setPmsMultiSelectValues] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');

  const staffType = [
    {
      groupName: 'Staff Type',
      skills: ['DA', 'RDA', 'RDAEF', 'Hygienist', 'Front office', 'Doctor'],
    },
  ];

  const keySkill = [
    {
      groupName1: 'Key Skills',
      skills: ['Orthodontic Assistant Permit', 'Cerec', 'E4D', 'OMSA Permit'],
    },
  ];

  const multiPicklistOptions = ['Acrylic', 'Polycarbonate', 'Aluminum'];

  const xray = [{groupName2: 'group', skills: ['X-Ray']}];

  const FrontOffSkills = [
    {
      groupName3: 'Front Office Key Skills',
      skills: [
        'Critical Data Input to Software',
        'Formal Software Trained',
        'Create Patient Files',
        'Appointment Scheduling',
        'Accounts Payable',
        'AR Management',
        'Insurance Benefit Coordination',
        'Insurance Verification and Pre Auth',
        'Run Financial Reports',
        'Post Insurance Payments',
        'Operate Credit Card Machine',
        'Over the Counter Collection',
        'Prepare Daily Deposit',
        'Prepare Day Sheet',
        'Recall Maintenance',
        'Create Treatment Plans in System',
        'Treatment Presentation',
      ],
    },
  ];

  const HygienistKeySkills = [
    {
      groupName4: 'Hygienist Key Skills',
      skills: [
        'Assisted Hygiene',
        'Arestin',
        'Assist w/Nitrous Administration',
        'Chairside Scheduling',
        'Digital Perio Charting',
        'Loupes',
        'Fluoride Varnish',
        'Laser Curettage',
        'Micro Ultrasonic',
        'Treatment Planning',
      ],
    },
  ];

  const handleSignUp = () => {
    // navigation.replace('document');
    navigation.navigate('dashboard');
    // navigation.navigate('faq')
  };

  console.log('user.firstName------->', user.firstName);
  console.log('user.lastName------->', user.lastName);
  console.log('user.emailId--------->', user.emailId);
  console.log('user.city--------->', user.city);
  console.log('user.street---------->', user.street);
  console.log('user.state------------->', user.state);
  console.log('user.country--------->', user.country);
  console.log('user.pincode----------->', user.pincode);
  console.log('user.phoneNumber----------->', user.phoneNumber);
  console.log('selectedStaffTypes---------->', selectedStaffTypes);
  console.log('multiSelectedValues---------->', selectedMultiPicklist);
  console.log('pmsMultiSelectedValues------------->', pmsMultiSelectedValues);
  console.log('selectedValue------------>', selectedValue);

  const handleSignUpClick = () => {
    const testData = {
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.emailId,
      password: user.password,
      phone: user.phoneNumber,
      add_city: user.city,
      add_street: user.street,
      add_state: user.state,
      add_country: user.country,
      add_pincode: user.pincode,
      staf_type: selectedStaffTypes,
      x_ray: true,
      pms_knowlagde: pmsMultiSelectedValues,
      formal_software_trained: true,
      post_insurance_payments: true,
      create_patient_files: true,
      counter_collection: true,
      appointment_scheduling: true,
      daily_deposit: true,
      accounts_payable: false,
      ar_management: false,
      prepare_day_sheet: true,
      insurance_benefit: false,
      recall_maintenance: true,
      insurance_verification: true,
      critical_data_input: true,
      operate_credit_card: true,
      create_treatment_plans: true,
      treatment_presentation: false,
      run_financial_reports: true,
      x_ray_proficiency: 'Bitewings',
      types_of_crowns: selectedMultiPicklist,
      e4d: true,
      cerec: true,
      omsa_permit: true,
      orthodontic_assistant_permit: true,
      image_x_ray_software: ['Dexis', 'Schick'],
      assisted_hygiene: true,
      loupes: true,
      arestin: true,
      fluoride_varnish: true,
      assist_nitrous_admin: true,
      laser_curettage: true,
      chairside_scheduling: true,
      micro_ultrasonic: true,
      digital_perio_charting: true,
      treatment_planning: true,
    };

    console.log('testData------->', testData);
    console.log('testData------->', testData);

    if (user == null) {
      Alert.alert('Please fill in all the details');
    } else {
      console.log(' ----------> INSIDE CREATE USER FUNCTION  <-----------');
      setLoading(true);

      createUser(user.emailId, user.password)
        .then(userCredentials => {
          const fbUser = userCredentials.user;
          console.log('Firebase user:', fbUser);
          console.log(
            ' ----------> INSIDE CREATE USER FUNCTION 2222222  <-----------',
          );

          let sfCandidate = {
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.emailId,
            phone: user.phoneNumber,
            add_city: user.city,
            add_street: user.street,
            add_state: user.state,
            county:user.county,
            add_country:user.country,
            add_pincode: user.pincode,
            staf_type: selectedStaffTypes,
            orthodontic_assistant_permit:
              selectedKeySkill['Orthodontic Assistant Permit'] || false,
            cerec: selectedKeySkill['Cerec'] || false,
            e4d: selectedKeySkill['E4D'] || false,
            omsa_permit: selectedKeySkill['OMSA Permit'] || false,
            types_of_crowns: selectedMultiPicklist,
            x_ray: selectXRay['X-Ray'] || false,
            pms_knowlagde: pmsMultiSelectedValues,
            x_ray_proficiency: selectedValue,
            image_x_ray_software: multiSelectedValues,
            critical_data_input:
              selectedFrontOfficeSkill['Critical Data Input to Software'] ||
              false,
            formal_software_trained:
              selectedFrontOfficeSkill['Formal Software Trained'] || false,
            create_patient_files:
              selectedFrontOfficeSkill['Create Patient Files'] || false,
            appointment_scheduling:
              selectedFrontOfficeSkill['Appointment Scheduling'] || false,
            accounts_payable:
              selectedFrontOfficeSkill['Accounts Payable'] || false,
            ar_management: selectedFrontOfficeSkill['AR Management'] || false,
            insurance_benefit:
              selectedFrontOfficeSkill['Insurance Benefit Coordination'] ||
              false,
            insurance_verification:
              selectedFrontOfficeSkill['Insurance Verification and Pre Auth'] ||
              false,
            run_financial_reports:
              selectedFrontOfficeSkill['Run Financial Reports'] || false,
            post_insurance_payments:
              selectedFrontOfficeSkill['Post Insurance Payments'] || false,
            operate_credit_card:
              selectedFrontOfficeSkill['Operate Credit Card Machine'] || false,
            counter_collection:
              selectedFrontOfficeSkill['Over the Counter Collection'] || false,
            daily_deposit:
              selectedFrontOfficeSkill['Prepare Daily Deposit'] || false,
            prepare_day_sheet:
              selectedFrontOfficeSkill['Prepare Day Sheet'] || false,
            recall_maintenance:
              selectedFrontOfficeSkill['Recall Maintenance'] || false,
            create_treatment_plans:
              selectedFrontOfficeSkill['Create Treatment Plans in System'] ||
              false,
            treatment_presentation:
              selectedFrontOfficeSkill['Treatment Presentation'] || false,
            assisted_hygiene:
              selectedHygienistSkill['Assisted Hygiene'] || false,
            arestin: selectedHygienistSkill.Arestin || false,
            assist_nitrous_admin:
              selectedHygienistSkill['Assist w/Nitrous Administration'] ||
              false,
            chairside_scheduling:
              selectedHygienistSkill['Chairside Scheduling'] || false,
            digital_perio_charting:
              selectedHygienistSkill['Digital Perio Charting'] || false,
            loupes: selectedHygienistSkill.Loupes || false,
            fluoride_varnish:
              selectedHygienistSkill['Fluoride Varnish'] || false,
            laser_curettage: selectedHygienistSkill['Laser Curettage'] || false,
            micro_ultrasonic:
              selectedHygienistSkill['Micro Ultrasonic'] || false,
            treatment_planning:
              selectedHygienistSkill['Treatment Planning'] || false,
            device_type: 'Android', //Android, iOS, Web
            regitstration_uid: 'xyz8910jwkj92',
          };
          console.log('sfCandidate------->', JSON.stringify(sfCandidate,null,1));
          singup(sfCandidate)
            .then(response => {
              console.log('Response from SFDC', response.data);
              console.log(
                ' ----------> INSIDE SIGN UP FUNCTION 111111  <-----------',
              );

              if (
                response &&
                response.data &&
                response.data.status &&
                response.data.response.ref_id
              ) {
                console.log(
                  'respnseee Data ------------------>',
                  response.data.response.ref_id,
                );
                let firebaseUserObj = {
                  first_name: user.firstName,
                  last_name: user.lastName,
                  email: user.emailId,
                  user_type: '',
                  street: testData.add_street,
                  city: testData.add_city,
                  state: testData.add_state,
                  country: testData.add_country,
                  status: 'New',
                  phone: user.phoneNumber,
                  pincode: testData.add_pincode,
                  sf_id: response.data.response.ref_id,
                  //    // acc_id: response.data.user_info.account_id,
                };

                console.log('fb user obj --- :', firebaseUserObj);
                console.log(
                  ' ----------> INSIDE SIGN UP FUNCTION 333333  <-----------',
                );

                firestore()
                  .collection('user')
                  .doc(fbUser.uid)
                  .set(firebaseUserObj)
                  .then(docRef => {
                    setLoadingModal(true);
                    setTimeout(() => {
                      setLoadingModal(false);
                    }, 3000);

                    console.log(
                      ' ----------> INSIDE FIRESTORE FUNCTION 333333  <-----------',
                    );
                    console.log('Document created with ID: ', docRef);

                    const userData = {
                      uid: fbUser.uid,
                      email: user.emailId,
                    };

                    store.dispatch(
                      setStoreUser({
                        ...userData,
                        ...firebaseUserObj,
                      }),
                    );

                    console.log(
                      ' ----------> INSIDE USERDATA FUNCTION  <-----------',
                    );

                    const apiKey = '11091077-a9d5-11e8-a895-0200cd936042';
                    const otpTemplateName = 'OTP1';
                    const apiUrl = `https://2factor.in/API/V1/${apiKey}/SMS/${user.phoneNumber}/AUTOGEN2/${otpTemplateName}`;

                    fetch(apiUrl)
                      .then(result => result.json())
                      .then(data => {
                        console.log(
                          ' ----------> INSIDE MOBILE API FUNCTION  <-----------',
                        );

                        // setOTPResponse(data);

                        if (!data.empty) {
                          setLoading(false);
                          navigation.navigate('numberVerification', {
                            phoneNumber: user.phoneNumber,
                            otpResponse: data,
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
                      })
                      .catch(error => {
                        console.error('Error sending OTP:', error);
                        // setOTPResponse({ error: "Error sending OTP" });
                        setLoading(false);
                      });
                  })
                  .catch(error => {
                    console.log('Firestore error:', error);
                    setLoading(false);
                    // Handle Firestore error
                  });
              } else {
                console.log(
                  'Deleting Firebase user as SFDC user creation was unsuccessful',
                );
                deleteUser().then(() => {
                  console.log('Firebase user deleted successfully');
                });
                store.dispatch(
                  clearUser(),
                );
              }
            })
            .catch(error => {
              console.log('SFDC signup error:', error);
              setLoading(false);
              // Handle SFDC signup error
            });
        })
        .catch(error => {
          console.log('Firebase createUser error:', error);
          setLoading(false);
          // Handle Firebase createUser error
        });
    }
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}} style={{flexGrow: 1}}>
      <>
        <View style={styles.container}>
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
                style={{alignSelf: 'center'}}
              />
            </View>
          ) : null}

          <View style={{flexDirection: 'row', padding: '5%'}}>
            <TouchableOpacity
              onPress={() => {
                props.navigation.replace('register');
              }}>
              <Image style={styles.backButton} source={imagePath.BACK_IMAGE} />
            </TouchableOpacity>
            <Text style={styles.textHeading}>Skills</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.dropDownCard,
              {backgroundColor: AssistantButtonActive ? '#8c9fff' : '#edf0ff'},
            ]}
            onPress={() => {
              setShowAssistantCard(!showAssistantCard);
              setAssistantButtonActive(!AssistantButtonActive);
            }}>
            <Text
              style={{
                color: AssistantButtonActive ? '#fff' : '#000',
                fontWeight: '500',
              }}>
              Assistant Key Skills
            </Text>
            <Image style={styles.downArrow} source={imagePath.DOWN_ARROW} />
          </TouchableOpacity>

          {showAssistantCard && (
            <View style={styles.checkboxContainer}>
              {/* <Text style={{ color: '#000', marginTop: 20, marginBottom: 5 }}> *Check all that apply</Text> */}

              {staffType.map(group => (
                <View key={group.groupName}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '400',
                      color: '#000',
                      marginBottom: 10,
                    }}>
                    *check all that apply
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#000',
                      marginBottom: 10,
                    }}>
                    {group.groupName}
                  </Text>
                  <View style={styles.checkboxContainer1}>
                    {group.skills.map(skill => (
                      <View key={skill} style={styles.checkboxItem}>
                        <CheckBox
                          value={selectedStaffTypes.includes(skill)}
                          onValueChange={() => {
                            const updatedSkills = selectedStaffTypes.includes(
                              skill,
                            )
                              ? selectedStaffTypes.filter(s => s !== skill)
                              : [...selectedStaffTypes, skill];

                            setSelectedStaffType(updatedSkills);
                          }}
                          style={styles.checkbox}
                          tintColors={{
                            true: '#654cfd',
                            false: '#000',
                          }}
                        />
                        <Text style={styles.checkboxLabel}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              {keySkill.map(group => (
                <View key={group.groupName1}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#000',
                      marginBottom: 10,
                      marginTop: '5%',
                    }}>
                    {group.groupName1}
                  </Text>
                  <View style={styles.checkboxContainer1}>
                    {group.skills.map(skill => (
                      <View key={skill} style={styles.checkboxItem}>
                        <CheckBox
                          value={selectedKeySkill[skill]}
                          onValueChange={() => {
                            setSelectedKeySkill(prevSkills => ({
                              ...prevSkills,
                              [skill]: !prevSkills[skill], // Toggle the value
                            }));
                          }}
                          style={styles.checkbox}
                          tintColors={{
                            true: '#654cfd',
                            false: '#000',
                          }}
                        />
                        <Text style={styles.checkboxLabel}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              <View style={styles.multiPicklist}>
                <MultiPicklist
                  selectedValues={selectedMultiPicklist}
                  onSelectChange={setSelectedMultiPicklist}
                  options={multiPicklistOptions}
                  groupName="Types of Crown"
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.dropDownCard,
              {backgroundColor: DentalButtonActive ? '#8c9fff' : '#edf0ff'},
            ]}
            onPress={() => {
              setShowDentalCard(!showDentalCard);
              setDentalButtonActive(!DentalButtonActive);
            }}>
            <Text
              style={{
                color: DentalButtonActive ? '#fff' : '#000',
                fontWeight: '500',
              }}>
              Dental Key Skills
            </Text>
            <Image style={styles.downArrow} source={imagePath.DOWN_ARROW} />
          </TouchableOpacity>

          {showDentalCard && (
            <View style={styles.checkboxContainer1}>
              {xray.map(group => (
                <View key={group.groupName2}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '400',
                      color: '#000',
                      marginBottom: 10,
                    }}>
                    *check all that apply
                  </Text>
                  <View style={styles.checkboxContainer1}>
                    {group.skills.map(skill => (
                      <View key={skill} style={styles.checkboxItem}>
                        <CheckBox
                          value={selectXRay[skill]} // Connect CheckBox to the selectXRay state with the specific skill key
                          onValueChange={() => {
                            setSelectRay(prevSkills => ({
                              ...prevSkills,
                              [skill]: !prevSkills[skill], // Toggle the value for the corresponding skill key
                            }));
                          }}
                          style={styles.checkbox}
                          tintColors={{
                            true: '#654cfd',
                            false: '#000',
                          }}
                        />
                        <Text style={styles.checkboxLabel}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}

              <View style={{paddingLeft: 25, marginTop: 20}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000',
                    fontWeight: '500',
                    marginBottom: 10,
                  }}>
                  PMS Knowledge
                </Text>
                <MultiSelect
                  items={[
                    {id: 'Dentrix', name: 'Dentrix'},
                    {id: 'Eaglesoft', name: 'Eaglesoft'},
                    {id: 'Softdent', name: 'Softdent'},
                    {id: 'Practice Works', name: 'Practice Works'},
                    {id: 'Computer Age Dentist', name: 'Computer Age Dentist'},
                    {id: 'Patient Base', name: 'Patient Base'},
                    {id: 'Datacon', name: 'Datacon'},
                    {id: 'Mogo', name: 'Mogo'},
                    {id: 'QSI', name: 'QSI'},
                    {id: 'Other', name: 'Other'},
                  ]}
                  uniqueKey="id"
                  onSelectedItemsChange={items =>
                    setPmsMultiSelectValues(items)
                  }
                  selectedItems={pmsMultiSelectedValues}
                  selectText="Select Multiple Items"
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={text => console.log(text)}
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                />
              </View>

              <View style={{marginTop: 20}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000',
                    fontWeight: '500',
                    marginLeft: 20,
                  }}>
                  X-Ray Proficiency
                </Text>

                <RNPickerSelect
                  onValueChange={value => setSelectedValue(value)}
                  items={[
                    {label: 'Bitewings', value: 'Bitewings'},
                    {label: 'Full Mouth', value: 'Full Mouth'},
                    {label: 'Panoramic', value: 'Panoramic'},
                    {label: 'Digital', value: 'Digital'},
                    {label: 'Ceph', value: 'Ceph'},
                    {label: 'ICAT 3D', value: 'ICAT 3D'},
                    {label: 'Film Processing', value: 'Film Processing'},
                  ]}
                  InputAccessoryView={() => null}
                  style={{
                    inputIOS: {
                      color: '#000',
                    },
                    inputAndroid: {
                      color: '#000',
                    },
                  }}
                  placeholder={{label: 'Select an option', value: null}}
                />
              </View>

              <View style={{paddingLeft: 25, marginTop: 20}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#000',
                    fontWeight: '500',
                    marginBottom: 10,
                  }}>
                  Image/X-Ray Software
                </Text>

                <MultiSelect
                  items={[
                    {id: 'Dexis', name: 'Dexis'},
                    {id: 'Dentrix Image', name: 'Dentrix Image'},
                    {id: 'Schick', name: 'Schick'},
                    {id: 'Kodak', name: 'Kodak'},
                    {id: 'Trophy', name: 'Trophy'},
                    {id: 'Tigerview', name: 'Tigerview'},
                    {id: 'Vixwin', name: 'Vixwin'},
                    {id: 'Scanex', name: 'Scanex'},
                    {id: 'Other', name: 'Other'},
                  ]}
                  uniqueKey="id"
                  onSelectedItemsChange={items => setMultiSelectedValues(items)}
                  selectedItems={multiSelectedValues}
                  selectText="Select Multiple Items"
                  searchInputPlaceholderText="Search Items..."
                  onChangeInput={text => console.log(text)}
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.dropDownCard,
              {
                backgroundColor: FrontOfficeButtonActive
                  ? '#8c9fff'
                  : '#edf0ff',
              },
            ]}
            onPress={() => {
              setShowFrontOfficeCard(!showFrontOfficeCard);
              setFrontOfficeButtonActive(!FrontOfficeButtonActive);
            }}>
            <Text
              style={{
                color: FrontOfficeButtonActive ? '#fff' : '#000',
                fontWeight: '500',
              }}>
              Front Office Key Skills
            </Text>
            <Image style={styles.downArrow} source={imagePath.DOWN_ARROW} />
          </TouchableOpacity>

          {showFrontOfficeCard && (
            <View style={styles.checkboxContainer}>
              {FrontOffSkills.map(group => (
                <View key={group.groupName3}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '400',
                      color: '#000',
                      marginBottom: 10,
                    }}>
                    *check all that apply
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#000',
                      marginBottom: 10,
                    }}>
                    {group.groupName3}
                  </Text>
                  <View style={styles.checkboxContainer1}>
                    {group.skills.map(skill => (
                      <View key={skill} style={styles.checkboxItem}>
                        <CheckBox
                          value={selectedFrontOfficeSkill[skill]}
                          onValueChange={() => {
                            setSelectedFrontOfficeSkill(prevSkills => ({
                              ...prevSkills,
                              [skill]: !prevSkills[skill], // Toggle the value for the corresponding skill key
                            }));
                          }}
                          style={styles.checkbox}
                          tintColors={{
                            true: '#654cfd',
                            false: '#000',
                          }}
                        />
                        <Text style={styles.checkboxLabel}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.dropDownCard,
              {backgroundColor: HygienistButtonActive ? '#8c9fff' : '#edf0ff'},
            ]}
            onPress={() => {
              setShowHygienistCard(!showHygienistCard);
              setHygienistButtonActive(!HygienistButtonActive);
            }}>
            <Text
              style={{
                color: HygienistButtonActive ? '#fff' : '#000',
                fontWeight: '500',
              }}>
              Hygienist Key Skills
            </Text>
            <Image style={styles.downArrow} source={imagePath.DOWN_ARROW} />
          </TouchableOpacity>

          {showHygienistCard && (
            <View style={styles.checkboxContainer}>
              {/* <Text style={{ color: '#000', marginTop: 20, marginBottom: 5 }}> *Check all that apply</Text> */}

              {HygienistKeySkills.map(group => (
                <View key={group.groupName4}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '400',
                      color: '#000',
                      marginBottom: 10,
                    }}>
                    *check all that apply
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#000',
                      marginBottom: 10,
                    }}>
                    {group.groupName4}
                  </Text>
                  <View style={styles.checkboxContainer1}>
                    {group.skills.map(skill => (
                      <View key={skill} style={styles.checkboxItem}>
                        <CheckBox
                          value={selectedHygienistSkill[skill]}
                          onValueChange={() => {
                            setSelectedHygienistSkill(prevSkills => ({
                              ...prevSkills,
                              [skill]: !prevSkills[skill], // Toggle the value
                            }));
                          }}
                          style={styles.checkbox}
                          tintColors={{
                            true: '#654cfd',
                            false: '#000',
                          }}
                        />
                        <Text style={styles.checkboxLabel}>{skill}</Text>
                        {/* Log each key and value separately */}
                        {/* {console.log(selectedHygienistSkill.${skill}:, selectedHygienistSkill[skill])} */}
                      </View>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.container_btn}>
            <TouchableOpacity
              style={[styles.loginBtnContinue, styles.btnContinue]}
              onPress={handleSignUpClick}>
              <Text style={styles.loginTxtCont}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // flexGrow: 1,
    // height:800,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  loginBtnContinue: {
    backgroundColor: '#654cfd',
    borderWidth: 1,
    borderColor: '#654cfd',
    borderRadius: 8,
    bottom: 0,
  },
  container_btn: {
    marginVertical: '5%',
    marginTop: '20%',
  },
  loginTxtCont: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  dropDownCard: {
    height: 50,
    width: '100%',
    backgroundColor: '#8c9fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderColor: '#ddd',
    marginTop: 10,
    flexDirection: 'row',
  },
  btnContinue: {
    width: '100%',
    height: 50,
    textAlignVertical: 'bottom',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  textHeading: {
    color: '#000',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 0,
  },
  backButton: {
    marginLeft: 0,
    marginRight: '5%',
    marginTop: '5%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 0,
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  checkboxContainer1: {
    backgroundColor: '#f5f5f5',
  },

  multiPicklist: {
    marginTop: '10%',
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderColor: 'transparent',
    marginRight: 5,
    width: 30,
    height: 20,
    borderWidth: 1,
    borderRadius: 2,
    marginRight: 5,
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#000',
  },
  downArrow: {
    width: 15,
    height: 15,
    marginLeft: 10,
  },
});

export default SelectSkills;
