/**
 * React Native App
 * Everthing starts from the entrypoint
 */
import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import Navigator from '../app/navigation';
import {CustomToast} from './components/CustomToast';
export default class Entrypoint extends Component {
  componentDidMount = () => {};
  render() {
    console.disableYellowBox = true;
    return (
      <View style={{flex: 1}}>
        <StatusBar
          backgroundColor="transparent"
          translucent={true}
          barStyle="light-content"
        />
        <Navigator />
        <CustomToast />
      </View>
    );
  }
}
