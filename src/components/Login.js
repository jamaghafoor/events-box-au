import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginApi from '../api/LoginApi';

class Login extends Component {
  static navigationOptions = {
    title: 'TicketRoof - Vendor App',
  };

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      pass: '',
      selectedUrl: 'https://eventsbox.com.au/', // Default URL
    };
  }

  async _onLogin() {
    const { navigate } = this.props.navigation;
    const { user, pass, selectedUrl } = this.state;

    if (this._validate()) {
      try {
        const resjson = await LoginApi(selectedUrl, user, pass);
        if (resjson.status === 'SUCCESS' && this.saveToStorage(resjson.token)) {
          alert(resjson.msg);
          navigate('Events');
        } else if (resjson.status === 'FAIL') {
          alert(resjson.msg);
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  async saveToStorage(token) {
    if (token) {
      await AsyncStorage.setItem('@token', token);
      await AsyncStorage.setItem('@isLoggedIn', '1');
      await AsyncStorage.setItem('@url', this.state.selectedUrl);
      return true;
    }
    return false;
  }

  _validate() {
    const { user, pass } = this.state;
    if (user === '') {
      alert('Enter User');
      return false;
    }

    if (pass === '') {
      alert('Enter Password');
      return false;
    }
    return true;
  }

  render() {
    const { user, pass, selectedUrl } = this.state;
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="User"
          autoCapitalize="none"
          onChangeText={(user) => this.setState({ user })}
          value={user}
          placeholderTextColor="#666666"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(pass) => this.setState({ pass })}
          value={pass}
          secureTextEntry
          keyboardType="default"
          placeholderTextColor="#666666"
        />

        {/* Checkbox to select URL */}
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              selectedUrl === 'https://eventsbox.com.au/'
                ? styles.activeCheckbox
                : null,
            ]}
            onPress={() =>
              this.setState({
                selectedUrl: 'https://eventsbox.com.au/',
              })
            }
          >
            <Text
              style={[
                styles.label,
                selectedUrl === 'https://eventsbox.com.au/'
                  ? styles.activeLinkText
                  : styles.linkText,
              ]}
            >
             Events Box Australia
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              selectedUrl === 'https://eventsbox.nz/'
                ? styles.activeCheckbox
                : null,
            ]}
            onPress={() =>
              this.setState({
                selectedUrl: 'https://eventsbox.nz/',
              })
            }
          >
            <Text
              style={[
                styles.label,
                selectedUrl === 'https://eventsbox.nz/'
                  ? styles.activeLinkText
                  : styles.linkText,
              ]}
            >
              Events Box New Zealand
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.btn}
          onPress={this._onLogin.bind(this)}
        >
          <Text style={styles.btn_text}>Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    backgroundColor: '#c0d6f1',
  },
  input: {
    height: 40,
    width: 250,
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#333333',
  },
  btn: {
    height: 40,
    width: 120,
    backgroundColor: '#e86c60',
    borderColor: '#e86c60',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  btn_text: {
    color: '#fff',
    fontSize: 16,
    borderRadius: 5,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderRadius: 5,
    marginRight: 10,
  },
  activeCheckbox: {
    backgroundColor: '#FF6666',
  },
  linkText: {
    color: 'black',

  },
  activeLinkText: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#FF6666', // Background color for active link
  },
  label: {
    margin: 4,
    padding: 4,
  },
});

export default Login;
