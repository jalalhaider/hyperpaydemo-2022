import React, { Component } from 'react';
import {
    Text,
    View,
    Animated
} from 'react-native';
import { styles } from './styles'
import { calcWidth, calcHeight } from '../../config/metrics';
var currentThread = null

export class CustomToast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0),
            transAnim: new Animated.Value(0),
            errorMessage: "",
            state: "check",
        };
    }
    componentDidMount() {
        global.openToast = this.open
    }
    open = (message, state) => {
        let _state = {
            e: "error",
            s: "check",
            w: 'info'
        }
        // this.setState({ massage, state: _state[state] })
        if (currentThread) clearTimeout(currentThread);
        this.setState({
            fadeAnim: new Animated.Value(0),
            transAnim: new Animated.Value(0),
        }, () => {


            this.setState({ errorMessage: message, state: _state[state] }, () => {
                delayTime = 0
                Animated.parallel([
                    Animated.timing(
                        this.state.fadeAnim,
                        { toValue: 1, duration: 800, delay: delayTime, useNativeDriver: true },
                    ),
                    Animated.timing(
                        this.state.transAnim,
                        { toValue: -calcHeight(130), duration: 800, delay: delayTime, useNativeDriver: true },
                    )
                ]).start(() => {
                    currentThread = setTimeout(this.close, 2500)
                })
            })
        })

    }
    close = () => {
        Animated.parallel([
            Animated.timing(
                this.state.fadeAnim,
                { toValue: 0, duration: 800, useNativeDriver: true },
            ),
            Animated.timing(
                this.state.transAnim,
                { toValue: 0, duration: 800, useNativeDriver: true },
            )
        ]).start(() => {
            this.setState({
                transAnim: new Animated.Value(0)
            })
        })
    }
    render() {
        return (
            <Animated.View
                style={{
                    transform: [{ translateY: this.state.transAnim }],
                    position: "absolute",
                    bottom: -calcHeight(50),
                    zIndex: 5,
                    opacity: this.state.fadeAnim,
                    width: calcWidth(375),
                    height: calcHeight(50),
                    backgroundColor: "transparent",
                    justifyContent: "center",
                    alignItems: "center"
                }}>

                <View style={[
                    styles.contentContainer(this.state.state)
                    , {
                        height: calcHeight(42),
                        flexDirection: 'row'
                    }
                ]}>
                    <Text style={styles.toastText}>{this.state.errorMessage} </Text>
                </View>
            </Animated.View>

        )
    }
}