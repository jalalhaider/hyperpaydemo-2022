


import { StyleSheet } from 'react-native';
import { calcWidth, calcHeight } from '../../config/metrics';
import { config } from '../../config/appConfig';
import { RFValue } from 'react-native-responsive-fontsize';

const styles = StyleSheet.create({
    container: {
        width: calcWidth(345),
        height: calcHeight(50),
        backgroundColor: config.colors.white,
        borderRadius: RFValue(10, 812),
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: calcWidth(10),
        justifyContent: "space-between"
    },
    lebel: {
        fontSize: RFValue(10, 812),
        fontFamily: config.fontStyle.fonts.regular,
        color: config.colors.gray
    },
    label: {
        fontSize: RFValue(10, 812),
        fontFamily: config.fontStyle.fonts.regular,
        color: config.colors.gray
    },
    valueText: {
        paddingVertical: 1,
        fontSize: RFValue(12, 812),
        fontFamily: config.fontStyle.fonts.regular,
        color: config.colors.black,
        marginTop: 3,
        width: calcWidth(220),
        height:calcHeight(18),
        textAlign: "left"
    }
});

export default styles;




