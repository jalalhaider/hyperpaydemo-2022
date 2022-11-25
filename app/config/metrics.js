/*
 * platform/application wide metrics for proper styling
*/
import { Dimensions, Platform } from 'react-native';
const { width, height } = Dimensions.get('window');

const metrics = {
    screenWidth: width < height ? width : height,
    screenHeight: width < height ? height : width,
    navBarHeight: Platform.OS === 'ios' ? 54 : 66
};

export const calcWidthRatio = (target, parent = 375) => {
    let ratio = ((target / parent) * 100.0).toString() + "%"
    return ratio
}

export const calcWidth = (target=375) => {
    
    return metrics.screenWidth*(target/375)
}

export const calcHeight = (target=812) => {


    return metrics.screenHeight * (target / 812)

}

export default metrics;
