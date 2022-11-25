import { StyleSheet } from 'react-native';
import { calcWidth, calcHeight } from '../../config/metrics';
import { config } from '../../config/appConfig';
import { RFValue } from 'react-native-responsive-fontsize';
const styles = {

  
    container: {
        width: "100%",
        height: "100%",
        backgroundColor: config.colors.white,
        alignItems: "center",
        opacity: 1,
        justifyContent:"center"
    },
    

};

export default styles;
