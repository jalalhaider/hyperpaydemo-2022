const {Component} = require('react');
const {
  View,
  NativeModules,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} = require('react-native');

class App extends Component {
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

    let data = await fetch(
      'https://dev.hyperpay.com/hyperpay-demo/getcheckoutid.php?phoneNumber=' +
        phoneNumber,
    );
    let data_json = await data.json();
    if (data.status == 200) {
      await this.setState({checkoutID: data_json.id});
    } else this.setState({loading: false});
  };

  checkout = () => {
    let paymentParams = {
      checkoutID: '719662C0266AE6D9B191C362856C545.uat01-vm-tx03',
      paymentBrand: 'VISA',
      cardNumber: '4111111111111111',
      holderName: 'Test',
      expiryMonth: '11',
      expiryYear: '2023',
      cvv: '123',
    };
    NativeModules.Hyperpay.transactionPayment(paymentParams)
      .then(transactionResult => {
        console.log('transactionResult', transactionResult);
        if (transactionResult) {
        }
      })
      .catch(ex => {
        console.log(ex);
      });
  };

  render() {
    console.log('Natibe mooule', NativeModules);
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <Text style={styles.text}>
            Hello World {JSON.stringify(NativeModules)}
          </Text>
          <TouchableOpacity onPress={this.checkout}>
            <Text>Press</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'black',
  },
});
export default App;
