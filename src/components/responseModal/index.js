import React, { useEffect,useState } from 'react';
import { Modal, View, Text,Image, TouchableOpacity, StyleSheet } from 'react-native';
import imagePath from '../../utils/imagePath';
import GlobalStyle from '../../assets/css/style';
const ResponseModel=({visible, title, message})=>{
    const [modalVisible, setModalVisible] = useState(false);
    // useEffect(()=>{
    //     setModalVisible(visible);
    // },[])
    return(
        <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
        setModalVisible(!modalVisible);
        }}>
        <View
        style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        }}>
        <View
            style={{
            backgroundColor: 'white',
            width: '95%',
            padding: 20,
            borderRadius: 8,
            position: 'relative',
            marginVertical: 30,
            alignItems: 'center',
            }}>
            <Text style={{ fontWeight: '600',fontSize:18, color: '#000',alignItems:'flex-start' }}>{title}</Text>
            <Image source={imagePath.LOGOUT} style={{ marginVertical: 30 }} />
            <Text style={{ fontWeight: '600', color: '#000' }}>{message}</Text>
        </View>
        </View>
        </Modal>
);
};
const styles = StyleSheet.create({
    registerAcceptTxt: {
        color: 'white',
      },
      registerTxt: {
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
      },
      registerCancelTxt: {
        color: GlobalStyle.colors.themeGreen,
      },
    registerAccept: {
        backgroundColor: GlobalStyle.colors.themeGreen,
      },
      register: {
        marginTop: 15,
        padding: 15,
        borderRadius: 8,
        flex: 1,
      },
});
export default ResponseModel;