import React, {Component} from 'react';
import PaymentView from './PaymentView';
import {Linking, DeviceEventEmitter, NativeModules} from 'react-native';
import {validatePaymentForm} from '../../utils/functions';
import {validateSTCPAY} from '../../utils/functions';
//import AsyncStorage from '@react-native-async-storage/async-storage';
class Payment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentType: [
        {
          icon_name: 'visa',
          type: 'VISA',
        },
        {
          icon_name: 'master_card',
          type: 'MASTER_CARD',
        },
        {
          icon_name: 'mada',
          type: 'MADA',
        },
        {
          icon_name: 'applepay',
          type: 'APPLEPAY',
        },
      ],
      selected_paymetType: 0,

      checkoutID: '',
      paymentBrand: '',
      cardNumber: '',
      holderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      phoneNumber: '',
      loading: false,
    };
  }

  generateCheckoutID = async phoneNumber => {
    this.setState({loading: true});

    let requestObj = {
      "amount": "1.00",
      "card_type": "applepay",
      "address": {
          "street": "str1",
          "city": "Jeddah",
          "state": "stat1"
      }
    };
    let data = await fetch(
      'http://192.168.1.104:3000/api/v1/payment/request-checkout',{
             method: "POST",
             headers: {
               "content-type": "application/json",
               "Authorization":"Bearer 09567c1b7a00e4231b1900679b64fece182926ba"
             },
             body: JSON.stringify(requestObj)
         });
    let data_json = await data.json();
    console.log("data_json",data_json);
    if (data.status == 200) {
      await this.setState({checkoutID: data_json.data.id});
    } else this.setState({loading: false});
  };
  onCheckOut = async () => {
    let {
      holderName,
      cardNumber,
      expiryMonth,
      expiryYear,
      cvv,
      checkoutID,
      paymentType,
      selected_paymetType,
    } = this.state;
    try {
      if (
        validatePaymentForm(
          holderName,
          cardNumber,
          expiryMonth,
          expiryYear,
          cvv,
        )
      ) {
        await this.generateCheckoutID();

        if (this.state.checkoutID) {
          const paymentParams = {
            checkoutID: this.state.checkoutID,
            paymentBrand: paymentType[selected_paymetType].type,
            cardNumber: cardNumber,
            holderName: holderName,
            expiryMonth: expiryMonth,
            expiryYear: '20' + expiryYear,
            cvv: cvv,
          };
          console.log(
            '01',
            'transactionResult',
            this.state.checkoutID,
            paymentParams,
            NativeModules.Hyperpay,
          );

          NativeModules.Hyperpay.transactionPayment(paymentParams)
            .then(transactionResult => {
              if (transactionResult) {
                console.log('02', 'paymentParams', transactionResult);

                if (transactionResult.status === 'completed') {
                  // resourcePath = encodeURIComponent("/v1/checkouts/" + transactionResult.checkoutId + "/payment");
                  this.getPaymentStatus(transactionResult.checkoutId);
                } else if (transactionResult.status === 'pending') {
                  Linking.openURL(transactionResult.redirectURL)
                    .then(() => {
                      this.setState({loading: false});
                    })
                    .catch(err => {
                      console.log('03', 'paymentParams2', err);
                      this.setState({loading: false});
                      global.openToast(err.toString(), 'e');
                      console.log('04', err);
                    });
                } else if (!transactionResult.redirectURL) {
                  return this.setState({loading: false}, () => {
                    global.openToast('The card data is incorrect', 'e');
                  });
                }
              }
            })
            .catch(err => {
              this.setState({loading: false});
              console.log('05', 'toStringtoString', err);
              global.openToast(err.toString(), 'e');
            });
        }
      } else {
        this.setState({loading: false});
      }
    } catch (e) {
      console.log('06', 'error', e);
    }
  };
  onCheckOutApplepay = async () => {
    let {checkoutID} = this.state;
    try {
      await this.generateCheckoutID();


      if (this.state.checkoutID) {
        const paymentParams = {
          checkoutID: this.state.checkoutID,
          amount: 1.0
        };
        console.log(
          '01',
          'transactionResult',
          this.state.checkoutID,
          paymentParams,
          NativeModules.Hyperpay,
        );

        NativeModules.Hyperpay.applepayPayment(paymentParams)
          .then(transactionResult => {
            if (transactionResult) {
              console.log("02","transactionResult from hyperpay",transactionResult);
              //resourcePath = "?checkoutId=" + transactionResult.checkoutId + "&cardType="+ this.state.paymentType[3].icon_name;
              //this.getPaymentStatus(resourcePath);
              this.getPaymentStatus(transactionResult.checkoutId);
              if (transactionResult.status === 'completed') {
                //resourcePath = encodeURIComponent("?checkoutId=" + transactionResult.checkoutId + "cardType="+ this.state.paymentType[3].icon_name);
                //this.getPaymentStatus(resourcePath);
                this.getPaymentStatus(transactionResult.checkoutId);
              } else {
                return this.setState({loading: false}, () => {
                  global.openToast('The payment is not completed', 'e');
                });
              }
            }
          })
          .catch(err => {
            this.setState({loading: false});
            console.log('05', 'toStringtoString', err);
            global.openToast(err.toString(), 'e');
          });
      }
    } catch (e) {
      console.log('06', 'error', e);
    }
  };
  onCheckOutStcpay = async () => {
    let {checkoutID, phoneNumber} = this.state;
    try {
      if (validateSTCPAY(phoneNumber)) {
        await this.generateCheckoutID(phoneNumber);

        if (this.state.checkoutID) {
          const paymentParams = {
            checkoutID: this.state.checkoutID,
          };
          console.log(
            '01',
            'transactionResult',
            this.state.checkoutID,
            paymentParams,
            NativeModules.Hyperpay,
          );

          NativeModules.Hyperpay.stcpayPayment(paymentParams)
            .then(transactionResult => {
              if (transactionResult) {
                console.log('02', 'paymentParams', transactionResult);

                if (transactionResult.status === 'completed') {
                  //  resourcePath = encodeURIComponent("/v1/checkouts/" + transactionResult.checkoutId + "/payment");
                  this.getPaymentStatus(transactionResult.checkoutId);
                } else if (transactionResult.status === 'pending') {
                  Linking.openURL(transactionResult.redirectURL)
                    .then(() => {
                      this.setState({loading: false});
                    })
                    .catch(err => {
                      console.log('03', 'paymentParams2', err);
                      this.setState({loading: false});
                      global.openToast(err.toString(), 'e');
                      console.log('04', err);
                    });
                } else if (!transactionResult.redirectURL) {
                  return this.setState({loading: false}, () => {
                    global.openToast('The phone number is incorrect', 'e');
                  });
                }
              }
            })
            .catch(err => {
              this.setState({loading: false});
              console.log('05', 'toStringtoString', err);
              global.openToast(err.toString(), 'e');
            });
        }
      }
    } catch (e) {
      console.log('06', 'error', e);
    }
  };

  onCheckOutReadyUI = async () => {
    let {checkoutID} = this.state;
    try {
      await this.generateCheckoutID();

      // payment type = credit_card , stc_pay ,  apple_pay , mada_card

      if (this.state.checkoutID) {
        const paymentParams = {
          checkoutID: this.state.checkoutID,
          paymentType: 'credit_card',
        };
        console.log(
          '01',
          'transactionResult',
          this.state.checkoutID,
          paymentParams,
          NativeModules.Hyperpay,
        );

        NativeModules.Hyperpay.readyuiPayment(paymentParams)
          .then(transactionResult => {
            if (transactionResult) {
              console.log('02', 'paymentParams', transactionResult);

              if (transactionResult.status === 'completed') {
                //  resourcePath = encodeURIComponent("/v1/checkouts/" + transactionResult.checkoutId + "/payment");
                this.getPaymentStatus(transactionResult.checkoutId);
              } else if (transactionResult.status === 'sync') {
                this.getPaymentStatus(transactionResult.checkoutId);
              } else if (transactionResult.status === 'canceled') {
                this.getPaymentStatus(transactionResult.checkoutId);
              }
            }
          })
          .catch(err => {
            this.setState({loading: false});
            console.log('05', 'toStringtoString', err);
            global.openToast(err.toString(), 'e');
          });
      }
    } catch (e) {
      console.log('06', 'error', e);
    }
  };

  onSessionConnect = event => {
    console.log('07', 'onSessionConnect', event);
    if (event.redirectUrl) {
      Linking.openURL(event.redirectUrl);
    } else if (event.status === 'complated') {
      // resourcePath = encodeURIComponent("/v1/checkouts/" + event.checkoutID + "/payment");
      this.getPaymentStatus(event.checkoutID);
    } else if (event.status === 'canceled') {
      this.setState({loading: false});

      global.openToast('Canceled', 'e');
    } else {
      this.setState({loading: false});
    }
    // DeviceEventEmitter.removeListener("transactionStatus")
  };
  getPaymentStatus = async resourcePath => {
    try {
      // this.setState({
      //     checkoutID: "",
      //     paymentBrand: "",
      //     cardNumber: "",
      //     holderName: "",
      //     expiryMonth: "",
      //     expiryYear: "",
      //     cvv: "",
      //     selected_paymetType: 0,
      //     loading: true
      // })

      this.setState({loading: true});

      // let response = await fetch("http://tstname.xyz/phpapi/api/v1/results", {
      //     method: "POST",
      //     headers: {
      //         "content-type": "application/json"
      //     },
      //     body: JSON.stringify({ resourcePath })
      // })
      let url = "https://dev.hyperpay.com/hyperpay-demo/getpaymentstatus.php?id="+ resourcePath
      console.log('08', url);

      let response = await fetch(url);
      let responseJson = await response.json();
      console.log("09","responseJson",responseJson)
      const successPattern = /^(000\.000\.|000\.100\.1|000\.[36])/;
      const manuallPattern = /^(000\.400\.0[^3]|000\.400\.100)/;
      const match1 = successPattern.test(responseJson.result.code);
      const match2 = manuallPattern.test(responseJson.result.code);
      console.log("22",match1, match2);

      if (match1 || match2) {
        this.props.navigation.navigate('ThankYou');
        this.setState({loading: false});
      } else {
        global.openToast('The payment was not successful ');

        this.setState({loading: false});
      }
      console.log("10","responseJson", responseJson.result.code, match2, match1)

      console.log("11","responseJson",responseJson.paymentResult)
    } catch (e) {
      this.setState({loading: false});
      global.openToast(e.toString(), 'e');
    }
  };

  componentDidMount = () => {
    Linking.getInitialURL().then(async url => {
      let deepLinkUrl = ''; //await AsyncStorage.getItem('deepLinkUrl');
      if (url && url !== deepLinkUrl) {
        let regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;
        while ((match = regex.exec(url))) {
          params[match[1]] = match[2];
          console.log('10', match[1], match[2]);
        }

        const {id, resourcePath} = params;
        console.log('11', 'getInitialURL', resourcePath, url, id);
        if (id) {
          //   this.props.navigation.navigate("ThankYou")
          //await AsyncStorage.setItem('deepLinkUrl', url);
          this.getPaymentStatus(id);
        }
      } else {
      }
    });
    let subscription = DeviceEventEmitter.addListener(
      'transactionStatus',
      this.onSessionConnect,
    );

    Linking.addEventListener('url', e => {
      const {url} = e;
      if (url) {
        let regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;

        while ((match = regex.exec(url))) {
          params[match[1]] = match[2];
          console.log('16', match[1], match[2]);
        }

        const {id, resourcePath} = params;
        this.getPaymentStatus(id);
      } else {
        console.log('12', 'outside getintialUrl metho');
      }
    });
  };

  onSelectPaymetType = index => {
    this.setState({selected_paymetType: index});
  };

  detectingCreditCardType = (key, value) => {
    let ptMadaVExp = new RegExp(
      '4(0(0861|1757|7(197|395)|9201)|1(0685|7633|9593)|2(281(7|8|9)|8(331|67(1|2|3)))|3(1361|2328|4107|9954)|4(0(533|647|795)|5564|6(393|404|672))|5(5(036|708)|7865|8456)|6(2220|854(0|1|2|3))|8(301(0|1|2)|4783|609(4|5|6)|931(7|8|9))|93428)',
    );
    let ptMadaMExp = new RegExp(
      '5(0(4300|8160)|13213|2(1076|4(130|514)|9(415|741))|3(0906|1095|2013|5(825|989)|6023|7767|9931)|4(3(085|357)|9760)|5(4180|7606|8848)|8(5265|8(8(4(5|6|7|8|9)|5(0|1))|98(2|3))|9(005|206)))|6(0(4906|5141)|36120)|9682(0(1|2|3|4|5|6|7|8|9)|1(0|1))',
    );
    if (
      key === 'cardNumber' &&
      (value.match(ptMadaVExp) || value.match(ptMadaMExp))
    )
      this.setState({selected_paymetType: 2});
    else if (key === 'cardNumber' && value[0] == '5')
      this.setState({selected_paymetType: 1});
    else if (key === 'cardNumber' && value[0] == '4')
      this.setState({selected_paymetType: 0});
    else this.setState({selected_paymetType: 0});
    this.setState({[key]: value});
  };
  onChangeText = (key, value) => {
    this.detectingCreditCardType(key, value);
  };
  render() {
    return (
      <PaymentView
        onChangeText={this.onChangeText}
        onSelectPaymetType={this.onSelectPaymetType}
        onBackToHome={this.onBackToHome}
        onCheckOut={this.onCheckOut}
        onCheckOutApplepay={this.onCheckOutApplepay}
        onCheckOutStcpay={this.onCheckOutStcpay}
        onCheckOutReadyUI={this.onCheckOutReadyUI}
        {...this.state}
        {...this.props}
      />
    );
  }
}

export default Payment;
