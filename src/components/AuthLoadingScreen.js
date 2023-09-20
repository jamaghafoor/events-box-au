import React, {Component} from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import getToken from '../api/getToken';
import checkLogin from '../api/checkLogin';

export default class AuthLoadingScreen extends Component{
  
  constructor(props){
    super(props);
    this._loadData();
  }

  render(){
    return(
      <View style={ styles.container }>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
      </View>
    );
  }


  _loadData = async() => {

    getToken()
    .then(token => checkLogin(token))
    .then( (res) => { this.props.navigation.navigate( res.status === 'SUCCESS' ? 'App' : 'Login' ); } )
    .catch(err => this.props.navigation.navigate('Login') );

  }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        backgroundColor: '#c0d6f1'
    },
    
});
