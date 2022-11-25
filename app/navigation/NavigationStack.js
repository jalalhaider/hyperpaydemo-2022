
import * as React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import NavigationService from './NavigationService';
import ThankYou from '../screens/ThankYou';
import Payment from '../screens/Payment';
const Stack = createStackNavigator()

export default function RNApp() {
    return (
        <View style={{ width: "100%", height: "100%" }}>
            <NavigationContainer
                ref={navigatorRef => {
                    NavigationService.setTopLevelNavigator(navigatorRef);
                }}
            >
                <Stack.Navigator
                    initialRouteName="Payment"
                    headerMode="none" >
                    <Stack.Screen
                        options={{ animationEnabled: true }}
                        name="Payment"
                        component={Payment}
                    />
                    <Stack.Screen
                        options={{ animationEnabled: true }}
                        name="ThankYou"
                        component={ThankYou}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </View>


    );
}

