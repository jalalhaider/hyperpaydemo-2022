


import { StyleSheet, AppState } from 'react-native';
import { calcWidth, calcHeight } from '../../config/metrics';
import { config } from '../../config/appConfig';

const styles = StyleSheet.create({
    container:{
        width: calcWidth(192),
        height: calcHeight(21.5),
        backgroundColor: "white",
        borderRadius:3,
        overflow:'hidden', 
        alignItems: "center",
         justifyContent: "center",
          flexDirection: "row",
          elevation:2
    },
    gradient:{width:"100%",height:"100%",position:"absolute"},
    text:{
        fontFamily:config.fontStyle.fonts.bold,
        paddingHorizontal: calcWidth(2.5),
        fontSize: 19
    }
});

export default styles;




