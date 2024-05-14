import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import imagePath from '../../utils/imagePath';
import GlobalStyle from '../../assets/css/style';


const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View
        style={{
          padding: 20,
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Image
          source={imagePath.DELIVERY_ILLUSTRATION}
          style={styles.deliveryImage}
        />
        <Text style={styles.heading}>Welcome</Text>
        <Text style={styles.subHeading}>
          Get ready to streamline your deliveries and
        </Text>
        <Text style={styles.subHeading}>
          optimize your routes. Let's hit the road!"
        </Text>
      </View>

      <TouchableOpacity style={styles.driverButton} onPress={() => navigation.navigate('login')}>
        <Text style={styles.buttonText}>Continue as Driver</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.technicianButton}>
        <Text style={styles.buttonText}>Continue as Technician</Text>
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
    height: 220,
    width: 320,
    marginBottom: '5%',
  },
  heading: {
    color: '#000',
    fontWeight: '500',
    fontSize: 20,
    marginBottom: '4%',
    fontFamily: 'DM Sans',
  },
  subHeading: {
    color: '#505050',
    fontSize: 14,
    fontWeight: '400',
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
});

export default HomeScreen;
