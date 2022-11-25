


import { StyleSheet, AppState } from 'react-native';
import { calcWidth, calcHeight } from '../../config/metrics';
import { config } from '../../config/appConfig';

const styles = StyleSheet.create({
    container: {
        width: calcWidth(),
        height: calcHeight(90),
        backgroundColor: config.colors.baseColor,
        alignItems: "flex-end",
        justifyContent: "center",
        flexDirection: "row"


    }
});

export default styles;




