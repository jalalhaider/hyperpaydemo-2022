import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import styles from './styles';
import images from '../../config/images';
import { config } from '../../config/appConfig';
import { RFValue } from 'react-native-responsive-fontsize';
import { Button } from '../../components/Button/Button';
import { calcWidth, calcHeight } from '../../config/metrics';
class ThankYouView extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    render() {
        return (
            <View
                source={images.bg_2}
                resizeMode={"repeat"}
                style={styles.container}
            >
                <Text
                    style={{
                        fontFamily: config.fontStyle.fonts.bold,
                        fontSize: RFValue(20, 812),
                        color: config.colors.baseColor,
                        fontWeight: "900"
                      
                    }}>
                    {'Thanks for your payment'}
                </Text>
<Button 
onPress={this.props.onBack}
text={"Back"}
 style={{
     width:calcWidth(200),
    height:calcHeight(50),
 backgroundColor:config.colors.baseColor,borderRadius:5,
 marginTop:calcHeight(50)}}  />
            </View>
        );
    }
}



export default ThankYouView;
