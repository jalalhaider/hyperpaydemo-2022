import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  NativeModules,
  ActivityIndicator,
  Text,
} from 'react-native';
import styles from './styles';
import {Header} from '../../components/Header/Header';
import images from '../../config/images';
import {calcHeight, calcWidth} from '../../config/metrics';
import {Button} from '../../components/Button/Button';
import {config} from '../../config/appConfig';
import {RFValue} from 'react-native-responsive-fontsize';
import {InputWithLabel} from '../../components/InputWithLabel/InputWithLabel';
import {Platform, StyleSheet} from 'react-native';

class PaymentView extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {

    let {selected_paymetType} = this.props;
    return (
      <View style={styles.container}>
        <Header hideMenu onBack title={'Payment'} />
        <InputWithLabel
          maxLength={30}
          onChangeText={value => this.props.onChangeText('holderName', value)}
          minLength={12}
          style={{marginTop: calcHeight(15)}}
          placeholder={'Holder Name'}
          label={'Holder Name'}
          iconName={'credit-card'}
          value={this.props.holderName}
          iconSize={RFValue(25, 812)}
          iconColor={'gray'}
        />
        <InputWithLabel
          flag={
            this.props.paymentType[this.props.selected_paymetType].icon_name
          }
          keyboardType={'phone-pad'}
          maxLength={16}
          onChangeText={value => this.props.onChangeText('cardNumber', value)}
          minLength={12}
          style={{marginTop: calcHeight(10)}}
          placeholder={'0000 0000 0000 0000'}
          label={'Card Number'}
          iconName={'credit-card'}
          value={this.props.cardNumber}
          iconSize={RFValue(25, 812)}
          iconColor={'gray'}
        />

        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            paddingHorizontal: calcWidth(15),
          }}>
          <View
            style={{
              flexDirection: 'row',
              width: calcWidth(150),
              justifyContent: 'space-between',
            }}>
            <InputWithLabel
              keyboardType={'phone-pad'}
              maxLength={2}
              onChangeText={value =>
                this.props.onChangeText('expiryMonth', value)
              }
              minLength={12}
              style={{marginTop: calcHeight(10), width: calcWidth(70)}}
              placeholder={'00'}
              label={'MM'}
              iconName={'credit-card'}
              value={this.props.expiryMonth}
              iconSize={RFValue(25, 812)}
              iconColor={'gray'}
            />
            <InputWithLabel
              keyboardType={'phone-pad'}
              maxLength={2}
              onChangeText={value =>
                this.props.onChangeText('expiryYear', value)
              }
              minLength={12}
              style={{marginTop: calcHeight(10), width: calcWidth(70)}}
              placeholder={'00'}
              label={'YY'}
              iconName={'credit-card'}
              value={this.props.expiryYear}
              iconSize={RFValue(25, 812)}
              iconColor={'gray'}
            />
          </View>

          <InputWithLabel
            keyboardType={'phone-pad'}
            maxLength={3}
            onChangeText={value => this.props.onChangeText('cvv', value)}
            minLength={12}
            style={{marginTop: calcHeight(10), width: calcWidth(165)}}
            placeholder={'000'}
            label={'CVV'}
            iconName={'credit-card'}
            value={this.props.cvv}
            iconSize={RFValue(25, 812)}
            iconColor={'gray'}
          />
        </View>

        <View style={{width: '100%'}}>
          <View
            style={{
              width: '75%',
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: calcHeight(15),
              justifyContent: 'space-between',
              paddingHorizontal: calcWidth(15),
            }}>
            {this.props.paymentType.map((item, index) => (
              <TouchableOpacity key={`${index}`}
                activeOpacity={0.9}
                onPress={() => this.props.onSelectPaymetType(index)}
                style={{
                  width: calcWidth(80),
                  height: calcHeight(40),
                  borderRadius: RFValue(10, 812),
                  backgroundColor: 'white',
                  borderColor:
                    selected_paymetType === index
                      ? 'green'
                      : config.colors.rgbaBlack(0.2),
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={images[item.icon_name]}
                  style={{width: '50%', height: '50%'}}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          onPress={this.props.onCheckOut}
          textStyle={{fontSize: RFValue(12, 812)}}
          text={'PAY'}
          style={{
            width: calcWidth(345),
            height: calcHeight(45),
            backgroundColor: config.colors.baseColor,
            borderRadius: calcHeight(20 / 2),
            marginTop: calcHeight(15),
          }}
        />

        <View>
          {Platform.OS == 'ios' && (
            <Button
              onPress={this.props.onCheckOutApplepay}
              textStyle={{fontSize: RFValue(12, 812)}}
              text={'APPLEPAY'}
              style={{
                width: calcWidth(345),
                height: calcHeight(45),
                backgroundColor: '#000000',
                borderRadius: calcHeight(20 / 2),
                marginTop: calcHeight(15),
              }}
            />
          )}
        </View>

        <InputWithLabel
          keyboardType={'phone-pad'}
          maxLength={10}
          onChangeText={value => this.props.onChangeText('phoneNumber', value)}
          minLength={12}
          style={{marginTop: calcHeight(10)}}
          placeholder={'05XXXXXXXX'}
          label={'Phone Number'}
          value={this.props.phoneNumber}
          style={{
            marginTop: calcHeight(25),
          }}
        />

        <Button
          onPress={this.props.onCheckOutStcpay}
          textStyle={{fontSize: RFValue(12, 812)}}
          text={'PAY STCPAY'}
          style={{
            width: calcWidth(345),
            height: calcHeight(45),
            backgroundColor: '#552D81',
            borderRadius: calcHeight(20 / 2),
            marginTop: calcHeight(15),
          }}
        />

        <Button
          onPress={this.props.onCheckOutReadyUI}
          textStyle={{fontSize: RFValue(12, 812)}}
          text={'READY UI'}
          style={{
            width: calcWidth(345),
            height: calcHeight(45),
            backgroundColor: '#FF4500',
            borderRadius: calcHeight(20 / 2),
            marginTop: calcHeight(15),
          }}
        />

        {this.props.loading && (
          <View
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              backgroundColor: config.colors.rgbaBlack(0.1),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={'large'} color={'red'} />
          </View>
        )}
      </View>
    );
  }
}

export default PaymentView;
