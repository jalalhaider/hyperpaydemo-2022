import { I18nManager } from 'react-native'

export const getKey = (key) => {
    let isAr = I18nManager.isRTL
    if (isAr)
        return key + "_ar"
    else
        return key + "_en"
}


export const validateSTCPAY = (phoneNumber) => {

    if (phoneNumber === "") {
        global.openToast("Please enter the phone number", "w")
        return false
    }
    else if (phoneNumber.length < 10) {
        global.openToast("phone number should be 10 digits", "w")
        return false
    }

    else return true
}



export const validatePaymentForm = (holderName,
    cardNumber,
    expiryMonth,
    expiryYear,
    cvv
) => {

    if (holderName === "") {
        global.openToast("Please enter the holder name", "w")
        return false
    }
    else if (cardNumber === "") {
        global.openToast("Please enter the card number", "w")
        return false
    }
    else if (cardNumber.length < 16) {
        global.openToast("card number should be 16 digits", "w")
        return false
    }
    else if (expiryMonth === "") {
        global.openToast("Please enter the expiry month", "w")
        return false
    }
    else if (expiryMonth.length < 2) {
        global.openToast("expiry month should be 2 digits", "w")
        return false
    }
    else if (expiryYear === "") {
        global.openToast("Please enter the expiry year", "w")
        return false
    }
    else if (expiryYear.length < 2) {
        global.openToast("expiry year should be 2 digits", "w")
        return false
    }
    else if (cvv === "") {
        global.openToast("Please enter the CVV", "w")
        return false
    }
    else if (cvv.length < 3) {
        global.openToast("CVV should be 3 digits", "w")
        return false
    }
    else return true
}


