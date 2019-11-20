/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';

import file from 'react-native-fs';

import Geolocation from 'react-native-geolocation-service';

import { Text, View, StyleSheet } from 'react-native';

import moment from 'moment';

export default class GpsSensor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: { lat: 0, lon: 0, speed: 0},
    };
    let timest = Date.now();
    file
      .mkdir(file.ExternalStorageDirectoryPath + '/TrafficData/GPS/' + timest)
      .then(success => {
        console.log('Successfully create gps file path');
      })
      .catch(error => {
        console.log('Error gps file path: ' + error);
      });
    this.path = file.ExternalStorageDirectoryPath + '/TrafficData/GPS/' + timest + '/data';
    this.gpsData = [];
    this.gpsfileidx = 0;
  }

  componentDidUpdate() {

  }
 
  componentDidMount() {
      Geolocation.watchPosition(
        position => {
          this.setState({
            data: {
              lat: position.coords.latitude,
              lon: position.coords.longitude,
              speed: position.coords.speed * 3.6,
            },
          });
          this.gpsData.push(this.state.data);
          let timest = moment(Date.now()).format('dddd DD-MM-YY hh:mm:ss');
          this.gpsData.push(timest);
          console.log(this.gpsData.length);
          if (this.gpsData.length == 100) {
            file
              .writeFile(this.path + this.gpsfileidx + '.txt', JSON.stringify(this.gpsData), 'utf8')
              .then(success => {
                console.log('Successfully create gps file: ' + success);
                this.gpsData = [];
                this.gpsfileidx++;
              })
              .catch(error => {
                console.log('Error: ' + error);
              });
          }
        },
        error => console.log(error.code, error.message),
        {
          enableHighAccuracy: true,
          forceRequestLocation: true,
          interval: 2000,
          fastestInterval: 1000,
          distanceFilter: 0,
        },
      );
  }

  render() {
    return (
      <>
        <Value name="lat" value={this.state.data.lat} />
        <Value name="lon" value={this.state.data.lon} />
        <Value name="speed" value={this.state.data.speed} />
      </>
    );
  }
}

const Value = ({ name, value }) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text style={styles.valueValue}>{new String(value).substr(0, 15)}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headline: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
  valueContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  valueValue: {
    width: 150,
    fontSize: 20,
  },
  valueName: {
    width: 100,
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
