import React, { Component } from 'react';
import {  TouchableOpacity, Text ,StyleProp,ViewStyle,TextStyle} from 'react-native';
import styles from './styles';

type ButtonProps = {
    style?: StyleProp<ViewStyle>,
    text: String,
    icon: String,
    iconColor: String,
    gradient: Boolean,
    textColor: String,
    disabled: Boolean,
    onPress: Function,
    iconSize:Number,
    textStyle:StyleProp<TextStyle>,
}

export function
    Button(props: ButtonProps) {
    return (
        <TouchableOpacity
            onPress={props.onPress}
            disabled={props.disabled}
            activeOpacity={.8}
            style={[styles.container,
            props.style]}>
            <Text
                style={[styles.text, { color: props.textColor || "white" },props.textStyle]}>
                {props.text}
            </Text>


        </TouchableOpacity>
    );
}
