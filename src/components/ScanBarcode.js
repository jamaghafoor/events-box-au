import React, {Component} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BarcodeMask from 'react-native-barcode-mask';
import { RNCamera } from 'react-native-camera';

import getToken from '../api/getToken';

class ScanBarcode extends Component {

  static navigationOptions = {
        title: 'Scan BarCode',
    };


    constructor(props) {
        
        super(props);
        
        this.state = {
          url: '',
          token: '',
          eid: '',
          valid_ticket: '',
          token_storate: 'true',
          name_customer : '',
          seat : '',
          checkin_time : '',
          e_cal: ''
        }

    }


    render() {

         let validJXS = <View></View>;

        if( this.state.valid_ticket === 'SUCCESS' ){
           validJXS = <View style={styles.success}>
            <Text style={styles.valid_text}>V</Text>
          </View>;
        }else if( this.state.valid_ticket === 'FAIL' ){
           validJXS = <View style={styles.fail}>
            <Text style={styles.valid_text}>X</Text>
          </View>;
        }

        const seatJXS = this.state.seat ? (
          
          <Text style={styles.label}>
            Seat: <Text style={styles.value}> { this.state.seat }</Text>
          </Text>

        ) : <View></View>;


        const customerJXS = this.state.name_customer ? (
          
          <Text style={styles.label}>
            Guest: <Text style={styles.value}> { this.state.name_customer }</Text>
          </Text>

        ) : <View></View>;


        const checkinJXS = this.state.checkin_time ? (
           
           <Text style={styles.label}>
              Check-in: <Text style={styles.value}> { this.state.checkin_time }</Text>
           </Text>

        ) : <View></View>;


        const ecalJXS = this.state.e_cal ? (
           
           <Text style={styles.label}>
              Date-Time: <Text style={styles.value}> { this.state.e_cal }</Text>
           </Text>

        ) : <View></View>;


         return (

          <View style={styles.container}>
            
            <RNCamera
              ref={ref => {
                this.camera = ref;
              }}
              style={styles.preview}
              type={RNCamera.Constants.Type.back}
              flashMode={RNCamera.Constants.FlashMode.on}
              androidCameraPermissionOptions={{
                title: 'Permission to use camera',
                message: 'We need your permission to use your camera',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              androidRecordAudioPermissionOptions={{
                title: 'Permission to use audio recording',
                message: 'We need your permission to use your audio',
                buttonPositive: 'Ok',
                buttonNegative: 'Cancel',
              }}
              
              onBarCodeRead={ this.onBarCodeRead.bind(this) }
            >
              
              <BarcodeMask />

            </RNCamera>
            

            <View style={styles.result}>
              
              <View style={ styles.result_left }>
                {validJXS}
              </View>

              <View style={ styles.result_right }>

                {customerJXS}

                {seatJXS}

                {ecalJXS}

                {checkinJXS}
              </View>
              
            </View>

          </View>
        ) 
      
        
    }

    reset(){

      this.setState({ 
        token_storate : '',
        valid_ticket: '', 
        name_customer: '', 
        seat: '', 
        checkin_time: '',
        e_cal: ''
      }); 

    }
    
    async onBarCodeRead( event ) {

      const token = await AsyncStorage.getItem('@token');
      const url = await AsyncStorage.getItem('@url');
      const eid = JSON.stringify(this.props.route.params.eid);
      

     if( event.data === this.state.token_storate ){

         

      }else if( event.data !== 'null' ){

        // Validate Ticket 
          fetch( url+'wp-json/meup/v1/validate_ticket/',
          {
              method: 'POST',
              headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  
              },
              body: JSON.stringify({ 
                  token: token,
                  qrcode: event.data,
                  eid: eid
              })
          })
          .then( res => res.json() )
          .then( ( resjson ) => {

            if( resjson.status === 'FAIL' ){
              Alert.alert( 
                'FAIL', 
                resjson.msg, 
                [
                  {

                    text: 'Continue',
                     onPress: () => this.reset()
                  } 
                ]
              );

            }else if (resjson.status === 'SUCCESS'){
              Alert.alert( 
                'SUCCESS', 
                resjson.msg, 
                [
                  {

                    text: 'Continue',
                    onPress: () => this.reset()
                  } 
                ]
              );
            }

            this.setState({ 
              valid_ticket: resjson.status, 
              name_customer: resjson.name_customer, 
              seat: resjson.seat, 
              checkin_time: resjson.checkin_time,
              e_cal: resjson.e_cal
            }); 

          } )
          .catch( (error) => {
              alert('error, please scan again');
          } );

          this.setState({ token_storate : event.data });
       
      }

    }

   
    
   

}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: 'column',
      
    },
    preview: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    
    result: {
      position: 'absolute',
      right: 0,
      left: 0,
      bottom: 0,
      alignItems: 'flex-start',
      flex: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center' 
    },
    result_left: {
      flex: 1,
      backgroundColor: '#000000',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 30,
      fontWeight: 'bold',
      color: '#fff'
    },
    result_right: {
      flex: 4,
      backgroundColor: '#000000',
      height: '100%',
      justifyContent: 'center',
      paddingLeft: 10,
      paddingTop: 5
    },
    success:{
      backgroundColor: '#90ba3e',
      flex: 1,
      width: '100%',
      height: '100%',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center'
    },
    fail:{
      backgroundColor: 'red',
      flex: 1,
      width: '100%',
      height: '100%',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center'
      
    },
    valid_text: {
      fontSize: 30,
      fontWeight: 'bold',
      color: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    label:{
      color: '#ccc',
    },
    value:{
      color: '#fff',
      fontWeight: 'bold'
    },
   
    
});


export default ScanBarcode;
