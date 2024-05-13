// import { View } from "native-base";
import {View,  TextInput, TouchableOpacity, Image } from "react-native";
import { Text } from "react-native-paper";
import AntDesign from 'react-native-vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/core';
// import { BackButton } from "./BackButton";
import { memo, useState } from "react";
import React from "react";
import imagePath from "../../utils/imagePath";

const ActionBar = ({ title, searchValue, onCloseSearch, search, onChangeText, containerStyle }) => {
  const navigation = useNavigation();
    const [toggleSearch, setToggleSearch] = useState(false);

    const makeSearchVisible = () => {
        setToggleSearch(toggle => !toggle);
        if (toggleSearch) {
            onCloseSearch()
        }
    }

    return (
        <View style={styles.headerBar}>
        <View style={{ marginHorizontal: 20, flexDirection: "row", justifyContent: 'space-between', flex: 1, alignItems: 'center', marginTop: '5%' }}>
        <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
              <AntDesign style={{color:'#fff'}} size={24} name={"left"}/>
                {/* <Image
                    style={{ height: 25, width: 25,color:'black' }}
                    resizeMode="contain"
                    source={imagePath.BACK_IMAGE}
                /> */}
            </TouchableOpacity>
          <Text style={styles.headText1}>Temporary Jobs</Text>
          <View style={{ flexDirection: 'row', alignItems: "center", }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('faq');
              }}
              style={styles.faqIcon}>
              <Image style={styles.icon} source={imagePath.FAQ} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('notification');
              }}
              style={styles.notificationIcon}>
              <Image style={styles.icon} source={imagePath.NOTIFICATION} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
}


const styles =({

  backButton: {
    // position: 'absolute',
    // top: 20,
    // left: 20,
    zIndex: 1,
    // backgroundColor: 'white',
    height: 35,
    width: 35,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
},
    headerBar: {
        flexDirection: 'row',
        height: 60,
        width: '100%',
        backgroundColor: '#654cfd',
        alignItems: 'center'
      },
      headText1: {
        color: '#fff',
        fontWeight: '500',
        fontSize: 18,
    
    
      },
      headCircle: {
        height: 40,
        width: 40,
        borderRadius: 20,
        backgroundColor: '#a9b7ff',
        marginLeft: '4%',
        marginTop: '2.5%',
      },
      faqIcon: {
        marginRight: 15
      },
    container: {
        height: 90,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: '#654CFD',
    },

    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    titleContainer: {
        alignItems: 'center'
    },

    title: {
        textAlign: 'center',
        fontSize: 22,
        color: '#FFFFFF',
        width: 200,
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        marginBottom: 10,
        marginHorizontal: 40
    },
    searchInput: {
        width: '85%',
        paddingLeft: 15
    },
    searchClose: {
        marginHorizontal: 20,
        justifyContent: 'center'
    }

})

export default memo(ActionBar);   