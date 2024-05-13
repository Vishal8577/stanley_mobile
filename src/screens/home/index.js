import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import imagePath from '../../utils/imagePath';
import GlobalStyle from '../../assets/css/style';


const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.homeWrapper}>
      <View style={styles.midSec}>
        <Image source={imagePath.HOME_BACK_IMAGE} />
        <Text style={styles.heading}>
          Find The Right Job, {"\n"} For
          <Text style={styles.subHeading}> Yourself.</Text>
        </Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.text}>
          Explore dental career options at Ondonte.{"\n"}Choose between permanent and temporary positions to fit your needs.
        </Text>
        
      </View>

      <View style={{ ...styles.midSec, ...styles.bottomSec }}>
        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate("login")}>
          <Text style={styles.loginTxt}>Login</Text>
          <Image source={imagePath.leftArrow}/>
        </TouchableOpacity>


        <TouchableOpacity
          style={{ ...styles.loginBtn, ...styles.register }}
          onPress={() => navigation.navigate("register")}
        >
          <Text style={{ ...styles.loginTxt, ...styles.registerTxt }}>
            Sign Up
          </Text>
         <Image source={imagePath.whiteRightArrow}/>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  registerTxt: {
    color: 'white',
  },
  register: {
    backgroundColor: '#654cfd',
    marginTop: 15,
  },
  loginTxt: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
    fontWeight:'500',
    lineHeight:20
  },
  loginBtn: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor: '#ffe254',
    padding: 15,
    borderRadius: 8,
  },
  midSec: {
    marginTop: 'auto',
  },
  bottomSec: {
    marginBottom: 40,
    width: '100%',
    paddingHorizontal: 20,
  },
  homeWrapper: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'black',
    paddingHorizontal: 20,
    textAlign: 'center',
    marginTop: 20,
  },
  subHeading: {
    color: '#654cfd',
    fontSize: 26,
  },
  container: {
    
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '7%',
    width:'76%'
  },
  text: {
    textAlign: 'center',
    color: 'gray',
    lineHeight:24,
    fontSize:14,
    fontWeight:'400',
    fontFamily:'Ubuntu'
  },
});

export default HomeScreen;
