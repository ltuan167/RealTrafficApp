/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  PermissionsAndroid
} from 'react-native';

import AccSensor from './component/accelerometer-sensor';
import GpsSensor from './component/gps-sensor';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {accSensor: {x: 0, y:0, z: 0, a: 0}};
    requestPermission();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headline}>I'm collecting some useful data for my thesis project (as shown below). Don't worry! Your personal data would not be collected. Thank you for your co.operation. I'm really appreciate it. </Text>
        <AccSensor updateFunc = {(data) => this.setState({accSensor: data})}/>
        <GpsSensor/>
      </View>
    );
  }
}

async function requestPermission() {
  try {
    const storageGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,          // writing on external storage permission
      {
        title: 'Write External storage permission',
        message:
          'We need permission to write to external storage',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (storageGranted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can write external storage now');
    } else {
      console.log('Write external storage permission denied');
    }
    const gpsGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,             // location permission
      {
        title: 'Cool GPS Permission',
        message:
          'Cool Photo App needs access to your GPS ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (gpsGranted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the GPS');
    } else {
      console.log('GPS permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headline: {
    fontSize: 20,
    textAlign: 'center',
    margin: 1,
    color: 'red'
  },
  valueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueValue: {
    width: 150,
    fontSize: 20
  },
  valueName: {
    width: 100,
    fontSize: 20,
    fontWeight: 'bold'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

