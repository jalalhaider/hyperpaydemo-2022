import React, { Component } from 'react';
import { View, TouchableOpacity, Text, StyleProp, ViewStyle, TextStyle, TextInput } from 'react-native';
import { calcWidth } from '../../config/metrics';
import styles from './styles';
type InputWithLabelProps = {

    placeholder: String,
    onChangeText: Function,
    value: String,
    keyboardType: KeyboardTypeOptions,
    secureTextEntry: String,
    phone: Boolean,
    maxLength: Number,
    autoFocus: Boolean,
    style: StyleProp<ViewStyle>,
    textStyle: StyleProp<TextStyle>,
    text: String,
    iconName: String,
    iconColor: String,
    gradient: Boolean,
    textColor: String,
    disabled: Boolean,
    onPress: Function,
    iconSize: Number,
    label: String
}

export class
    InputWithLabel extends Component<InputWithLabelProps> {


    constructor(props) {
        super(props)
        this.state = {
            isFocus: false,
            isVerified: false,
            text: props.value
        }
    }



    render() {

        return (
            <TouchableOpacity

                onPress={() => {
                    this.input.focus()
                    if (this.props.onPress)
                    this.props.onPress()
                }}
                disabled={this.props.disabled}
                activeOpacity={.8}
                style={[styles.container, this.props.style]}
            >

                <View
                    style={{ flexDirection: "row", width: calcWidth(120) }}>
                 <View
                        style={{
                            alignItems: "flex-start",
                            paddingHorizontal: calcWidth(5)
                        }}>
                        <Text
                            style={styles.label}>{this.props.label}</Text>
                     <TextInput
                     
                     autoFocus={this.props.autoFocus}
                     secureTextEntry={this.props.secureTextEntry}
                     maxLength={this.props.maxLength}
                     keyboardType={this.props.keyboardType}
                        editable={!this.props.onPress}
                            ref={(input) => this.input = input}
                            onChangeText={this.props.onChangeText}
                            value={this.props.value}
                            style={styles.valueText}
                            placeholder={this.props.placeholder}
                        />

                    </View>
                </View>
        
            </TouchableOpacity>
        );
    }

}
