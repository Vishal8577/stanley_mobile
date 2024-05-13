import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Image,Alert, Text, TouchableOpacity } from 'react-native';
import LoadingModal from '../../../components/spinner';
import imagePath from '../../../utils/imagePath';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { Connect, connect } from 'react-redux';


const mapStateToProps = (state) => ({
  currentUser: state.user.currentUser,
  userObj: state.user,

});

const InterviewScheduling = ({currentUser}) => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  console.log('current user on interView Scheduled----->', currentUser)

  const logoutUser = async () => {
    try {
        // await signOutUser();
        console.log('User signed out successfully!');
        // if (Platform.OS !== 'ios') {
          await AsyncStorage.clear();
      // }
      Alert.alert("User signed out successfully")
      navigation.replace('home');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

 

  return (
    <View style={{backgroundColor:'#fff'}}>

<View style={styles.header}>
        <Text style={styles.headerText}>Interview</Text>
        <TouchableOpacity
          onPress={() => {
            logoutUser();
          }}
        ><Text style={{color:'#fff',fontWeight:'400', marginLeft:40}}>Logout</Text></TouchableOpacity>
      </View>
    <View style={styles.container}>
    
      <LoadingModal visible={loading} text="Please wait..." />

      <Text style={styles.textHeading}>Interview Scheduling</Text>

      <Image style={styles.backButton} source={imagePath.INTERVIEW_IMAGE} />

      <Text style={{ color: '#000', marginHorizontal: 30, textAlign: 'center' }}>
        Congratulations {currentUser.first_name}{' '}{currentUser.last_name}, You have successfully completed the initial steps of your registration. Please wait till we process your application.
      </Text>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textHeading: {
    color: '#6750fd',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    paddingTop: 0,
    marginTop: '10%',
  },


  header: {
    height: 80,
    backgroundColor: '#6750fd',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    flexDirection:'row'
  },
  headerText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 22,
     marginLeft:'20%'
  },
});

export default connect(mapStateToProps) (InterviewScheduling);
