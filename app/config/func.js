
import {Platform} from 'react-native'

export const isIos=()=>{
    if (Platform.OS=='ios')
    return true
    else return false
}