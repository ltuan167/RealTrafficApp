/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import file from 'react-native-fs';

const Value = ({name, value}) => (
  <View style={styles.valueContainer}>
    <Text style={styles.valueName}>{name}:</Text>
    <Text style={styles.valueValue}>{new String(value).substr(0, 8)}</Text>
  </View>
);

export default class AccSensor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {x: 0, y: 0, z: 0, a: 0},
    };
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);

    const timest = Date.now();

    file
      .mkdir( file.ExternalStorageDirectoryPath + '/TrafficData/Accelerometer/' + timest)
      .then(success => {
        console.log('Successfully create accelerometer file path');
      })
      .catch(error => {
        console.log('Error accelerometer file path: ' + error);
      });
    this.path = file.ExternalStorageDirectoryPath + '/TrafficData/Accelerometer/' + timest + '/data';
    this.accelerometerData = [];
    this.accfileidx = 0;
  }

  setListener(listener) {
    this.listener = listener;
  }

  componentDidUpdate() {
    // let {x: prevX, y: prevY, z: prevZ} = prevState.data
    // let {x: newX, y: newY, z: newZ} = this.state.data
    // if (prevState.data && 
    //    (prevX !== newX ||
    //     prevY !== newY ||
    //     prevZ !== newZ)) {
                 
    //     }
    // let time = moment(Date.now()).format('dddd DD-MM-YY hh:mm:ss');
    // this.accelerometerData.push(time);
    // this.accelerometerData.push(this.state.data);
    // // console.log('Added new element in Acc array ')   
    // if (this.accelerometerData.length == 100) {
    //   file
    //     .writeFile(
    //       this.path + this.accfileidx + '.txt', JSON.stringify(this.accelerometerData), 'utf8')
    //     .then(success => {
    //       console.log('Successfully create accelerometer file: ');
    //       this.accelerometerData = [];
    //       this.accfileidx++;
    //     })
    //     .catch(error => {
    //       console.log('Error: ' + error);
    //     });
    // }
  }

  componentDidMount() {
    accelerometer.subscribe(({x, y, z}) => {
      // console.log(x, y, z);
      let a = (x + y + z) / 3;
      this.setState({data: {x, y, z, a}});
      
      this.state.data["time"] = Date.now();
      this.accelerometerData.push(this.state.data);
      
      console.log("Length of accelerometer data: " + this.accelerometerData.length);

      if (this.accelerometerData.length == 100) {
        file
          .writeFile(
            this.path + this.accfileidx + '.txt', JSON.stringify(this.accelerometerData), 'utf8')
          .then(success => {
            console.log('Successfully create accelerometer file: ');
            this.accelerometerData = [];
            this.accfileidx++;
          })
          .catch(error => {
            console.log('Error: ' + error);
          });
      }
      if (this.props.updateFunc) {
        this.props.updateFunc({x, y, z, a});
      }
    });
  }

  render() {
    return (
      <>
        <Value name="x" value={this.state.data.x} />
        <Value name="y" value={this.state.data.y} />
        <Value name="z" value={this.state.data.z} />
      </>
    );
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
