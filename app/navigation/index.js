import React, { Component } from 'react';
import NavigationStack from './NavigationStack';
import NavigationService from './NavigationService';
import { View } from 'react-native';
class AppNavigator extends Component {
    render() {
        return (
            <NavigationStack />
        );
    }
}

export default AppNavigator;
