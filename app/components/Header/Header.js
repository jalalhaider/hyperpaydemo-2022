import React, { Component } from 'react';
import { View,  Text } from 'react-native';
import {  calcHeight } from '../../config/metrics';
import styles from './styles';
import { config } from '../../config/appConfig';
import { RFValue } from 'react-native-responsive-fontsize';




type HeaderProps = {
    style: Object,
    text: String,
    icon: String,
    iconColor: String,
    gradient: Boolean,
    textColor: String,
    disabled: Boolean,
    onPress: Function,
    title: String
}

export function
    Header(props: HeaderProps) {
    return (
        <View
            onPress={props.onPress}
            disabled={props.disabled}
            style={[styles.container,
            props.style]}>
            <Text
                style={{
                    color: config.colors.white,
                    fontSize: RFValue(16, 812),
                    fontFamily: config.fontStyle.fonts.tajawalMedium,
                    position: "absolute", bottom: calcHeight(15)
                }}>{props.title}
            </Text>

        </View>
    );
}
