import { NavigationActions } from 'react-navigation';
import { StackActions } from '@react-navigation/native';
let _navigator;

function setTopLevelNavigator(navigatorRef) {
    console.log("_navigator_navigator", navigatorRef)

    _navigator = navigatorRef;
}

function navigate(routeName, params) {

    _navigator.navigate(routeName,params)
    // _navigator.dispatch(
    //     NavigationActions.navigate({
    //         routeName,
    //         params
    //     })
    // );
}

function replace(routeName, params) {
    console.log("_navigator_navigator_navigator", _navigator)
    // const resetAction = StackActions.reset({
    //     index: 0,
    //     actions: [NavigationActions.navigate({ routeName: routeName,params:params})],
    // });
    _navigator.dispatch(StackActions.replace(routeName, params));

}

function goBack(key) {
    _navigator.goBack()
        ;
}

// add other navigation functions that you need and export them

export default {
    navigate,
    goBack,
    replace,
    setTopLevelNavigator
};
