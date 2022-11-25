//
//  Hyperpay.m
//  hyperRn
//
//  Created by Hyperpay on 15/06/1441 AH.
//  Copyright © 1441 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "Hyperpay.h"
#import <React/RCTLog.h>
@implementation Hyperpay

OPPPaymentProvider *provider;
NSString *applepayCheckoutId;
NSDictionary *transactionResult;
RCTPromiseResolveBlock resolveG;
NSString *CheckoutId;
NSString *isRedirect;



RCT_EXPORT_MODULE(Hyperpay)

-(instancetype)init
{
    self = [super init];
    if (self) {
      #ifdef DEBUG
        provider = [OPPPaymentProvider paymentProviderWithMode:OPPProviderModeTest];
     #else
        provider = [OPPPaymentProvider paymentProviderWithMode:OPPProviderModeTest];
     #endif
    }
    
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return @[@"onTransactionComplete"];
}



/**
 React Native functions
 */

- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller
                       didAuthorizePayment:(PKPayment *)payment
                                completion:(void (^)(PKPaymentAuthorizationStatus))completion {
   OPPApplePayPaymentParams *params = [OPPApplePayPaymentParams applePayPaymentParamsWithCheckoutID:applepayCheckoutId tokenData:payment.token.paymentData error:nil];
  
  params.shopperResultURL = @"mosab.hyperpay://result";
    
    //submit transaction
    [provider submitTransaction:[OPPTransaction transactionWithPaymentParams:params] completionHandler: ^(OPPTransaction *transaction, NSError *error){
      
      if(error){
        
        NSLog(@"%@", error.localizedDescription);

        completion(PKPaymentAuthorizationStatusFailure);
               transactionResult = @{
               @"status":@"error",
               @"checkoutId":applepayCheckoutId
               };
        resolveG(transactionResult);

        
      }else{
        NSLog(@"sucess");
        NSLog(applepayCheckoutId);
       completion(PKPaymentAuthorizationStatusSuccess);
        transactionResult = @{
        @"status":@"completed",
        @"checkoutId":applepayCheckoutId
        };
        resolveG(transactionResult);
      }
    }];
}
 
- (void)paymentAuthorizationViewControllerDidFinish:(PKPaymentAuthorizationViewController *)controller {
    [controller dismissViewControllerAnimated:YES completion:nil];
  transactionResult = @{
                @"status":@"error",
                @"checkoutId":applepayCheckoutId
                };
         resolveG(transactionResult);
}



RCT_EXPORT_METHOD(readyuiPayment: (NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  
  
  resolveG = resolve;
  
    
    NSError * _Nullable error;
   
  for (NSString *key in options) {
        NSLog(@"key: %@, value: %@ \n", key, [options valueForKey:key]);
    }
  
 
  
    if (error) {
      NSLog(@"%s", "error");

      reject(@"transactionPayment",error.localizedDescription, error);
    } else {
      
      provider = [OPPPaymentProvider paymentProviderWithMode:OPPProviderModeTest];
      OPPCheckoutSettings *checkoutSettings = [[OPPCheckoutSettings alloc] init];
      PKPaymentRequest *paymentRequest = [OPPPaymentProvider paymentRequestWithMerchantIdentifier:@"merchant.com.maeda.client.app" countryCode:@"SA"];
                        if (@available(iOS 12.1.1, *)) {
                          paymentRequest.supportedNetworks = @ [ PKPaymentNetworkVisa, PKPaymentNetworkMasterCard, PKPaymentNetworkMada ];
                        } else {
                          // Fallback on earlier versions
                          paymentRequest.supportedNetworks = @ [ PKPaymentNetworkVisa, PKPaymentNetworkMasterCard ];
                        } // set up supported payment networks
                        


      // Set available payment brands for your shop
                        
                        CheckoutId = [options valueForKey:@"checkoutID"];


      // Set shopper result URL
      checkoutSettings.shopperResultURL = @"com.HyperPayApp.ReactNative.payments://result";
      checkoutSettings.displayTotalAmount = true;
      checkoutSettings.applePayPaymentRequest = paymentRequest;
    //  checkoutSettings.storePaymentDetails = OPPCheckoutStorePaymentDetailsModePrompt;
         //  checkoutSettings.storePaymentDetails = OPPCheckoutStorePaymentDetailsModePrompt;

      

      if ([[options valueForKey:@"paymentType"] isEqualToString:@"mada_card"])
                      {
                        checkoutSettings.paymentBrands = @[@"MADA"];
                      } else if
                        ([[options valueForKey:@"paymentType"] isEqualToString:@"credit_card"]){
                        checkoutSettings.paymentBrands = @[@"VISA", @"MASTER"];
                      } else if
                        ([[options valueForKey:@"paymentType"] isEqualToString:@"stc_pay"])
                      {
                        checkoutSettings.paymentBrands = @[@"STC_PAY"];
                      } else if
                        ([[options valueForKey:@"paymentType"] isEqualToString:@"apple_pay"])
                      {
                        checkoutSettings.paymentBrands = @[@"APPLEPAY"];
                      }
      
                        OPPCheckoutProvider *checkoutProvider = [OPPCheckoutProvider checkoutProviderWithPaymentProvider:provider checkoutID:CheckoutId settings:checkoutSettings];
      

                        
                      

      dispatch_async(dispatch_get_main_queue(), ^{
        [checkoutProvider presentCheckoutForSubmittingTransactionCompletionHandler:^(OPPTransaction * _Nullable transaction, NSError * _Nullable error) {
          NSDictionary *transactionResult;

          NSLog(@"TRANSACTION%@", transaction);
          if (error) {
            
            transactionResult = @{
            @"status":@"canceled",
            };
            resolve(transactionResult);
            // Executed in case of failure of the transaction for any reason
  
    //        self -> onCancelClick(@[@"error", events]);
            
          } else if (transaction.type == OPPTransactionTypeSynchronous) {
    //                  NSDictionary *responeDic = @{@"resourcePath" : transaction.resourcePath};
    //        NSDictionary *responeDic = @{@"resourcePath" : transaction.resourcePath};
            NSLog(@"%s", "sync");
            transactionResult = @{
            @"status":@"sync",
            @"checkoutId":transaction.paymentParams.checkoutID
            };
            resolve(transactionResult);
          } else if (transaction.type == OPPTransactionTypeAsynchronous) {
            // The SDK opens transaction.redirectUrl in a browser
            NSOperationQueue *mainQueue = [NSOperationQueue mainQueue];
            [
             [NSNotificationCenter defaultCenter] addObserverForName:@"getStatusOrder"
             object:nil
             queue:mainQueue
             usingBlock:^(NSNotification * _Nonnull note) {
              [checkoutProvider dismissCheckoutAnimated:YES completion:^{
                isRedirect = @"1";
              
                  
                  NSDictionary *transactionResult;

                  NSLog(@"%s", "sync");
                  transactionResult = @{
                  @"status":@"completed",
                  @"checkoutId":transaction.paymentParams.checkoutID
                  };
                  resolve(transactionResult);

                  
                  //                                                                  NSDictionary *responeDic = @{@"resourcePath": transaction.resourcePath};
    //              NSDictionary *responeDic = @{@"resourcePath" : transaction.resourcePath};
                 
    //              self -> onDoneClick(@[responeDic,events]);
                
              }];
            }
             ];
          }
        } cancelHandler:^{
         
          transactionResult = @{
          @"status":@"canceled",
          };
          resolve(transactionResult);
           
        }];
      });
    
    }
}



RCT_EXPORT_METHOD(stcpayPayment: (NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  
  
  resolveG = resolve;
  
    
    NSError * _Nullable error;
   
  for (NSString *key in options) {
        NSLog(@"key: %@, value: %@ \n", key, [options valueForKey:key]);
    }
  
 
  
    if (error) {
      NSLog(@"%s", "error");

      reject(@"transactionPayment",error.localizedDescription, error);
    } else {
    
      NSDictionary *transactionResult;

      
      applepayCheckoutId =[options valueForKey:@"checkoutID"] ;
    
      OPPPaymentParams *params = [OPPPaymentParams paymentParamsWithCheckoutID:[options valueForKey:@"checkoutID"] paymentBrand:@"STC_PAY" error:&error];
     
      params.shopperResultURL = @"com.HyperPayApp.ReactNative.payments://result";

      
       OPPTransaction *transaction = [OPPTransaction transactionWithPaymentParams:params];

            [provider submitTransaction:transaction completionHandler:^(OPPTransaction * _Nonnull transaction, NSError * _Nullable error) {
              NSDictionary *transactionResult;
              if (transaction.type == OPPTransactionTypeAsynchronous) {
                // Open transaction.redirectURL in Safari browser to complete the transaction
      //
      //          [self sendEventWithName:@"onSessionConnect" body:@{@"redirectURL": transaction.redirectURL.absoluteString, @"status":@"pending",
      //                                                             @"checkoutID":transaction.paymentParams.checkoutID
      //          }];
                NSLog(@"%s", "aysnc");
                NSLog(@"%@", transaction.redirectURL.absoluteString);
                
                 transactionResult = @{
                @"redirectURL":transaction.redirectURL.absoluteString,
                @"status":@"pending",
                @"checkoutId":transaction.paymentParams.checkoutID
                };
                resolve(transactionResult);
              }  else if (transaction.type == OPPTransactionTypeSynchronous) {
                NSLog(@"%s", "sync");
                transactionResult = @{
                @"status":@"completed",
                @"checkoutId":transaction.paymentParams.checkoutID
                };
                resolve(transactionResult);
              } else {
                NSLog(@"%s", "error payment");

                reject(@"transactionPayment",error.localizedDescription, error);
                // Handle the error
              }
            }];
      
   
    }
}

RCT_EXPORT_METHOD(applepayPayment: (NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
  
  
  resolveG = resolve;
  
    
    NSError * _Nullable error;
   
  for (NSString *key in options) {
        NSLog(@"key: %@, value: %@ \n", key, [options valueForKey:key]);
    }
  
 
  
    if (error) {
      NSLog(@"%s", "error");

      reject(@"transactionPayment",error.localizedDescription, error);
    } else {
    
      NSDictionary *transactionResult;

      
      applepayCheckoutId =[options valueForKey:@"checkoutID"] ;
      
      PKPaymentRequest *request = [OPPPaymentProvider paymentRequestWithMerchantIdentifier:@"merchant.Hyperpay.reactNative1" countryCode:@"SA"];

     // PKPaymentRequest *request = [OPPPaymentProvider paymentRequestWithMerchantIdentifier:@"merchant.Hyperpay.reactNative1" countryCode:@"SA"];

       // Set currency.
       request.currencyCode = @"SAR";
      if (@available(iOS 12.1.1, *)) {
        request.supportedNetworks = [NSArray arrayWithObjects: PKPaymentNetworkMada,PKPaymentNetworkVisa,PKPaymentNetworkMasterCard, nil];
      } else {
        // Fallback on earlier versions
               request.supportedNetworks = [NSArray arrayWithObjects: PKPaymentNetworkVisa,PKPaymentNetworkMasterCard, nil];
        
        
      }
       // Create total item. Label should represent your company.
       // It will be prepended with the word "Pay" (i.e. "Pay Sportswear $100.00")
      NSString *amount_String = [NSString stringWithFormat:@"%@", [options valueForKey:@"amount"]];
      double amount = [amount_String doubleValue];

      NSDecimalNumber *amount1 = [[NSDecimalNumber alloc] initWithDouble:amount];

      NSDecimalNumber *amount2 = [NSDecimalNumber decimalNumberWithMantissa:10000 exponent:-2 isNegative:NO];

       request.paymentSummaryItems = @[[PKPaymentSummaryItem summaryItemWithLabel:@"Hyperpay" amount:amount1]];
       

      if ([OPPPaymentProvider canSubmitPaymentRequest:request]) {
            PKPaymentAuthorizationViewController *vc = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:request];
        
 
        
        vc.delegate = self;
        
        dispatch_async(dispatch_get_main_queue(), ^{
          
          
          UIViewController *rootViewController = RCTPresentedViewController();


            [rootViewController presentViewController: vc animated: YES completion:nil];
           });
        } else {
            NSLog(@"Apple Pay not supported.");
          transactionResult = @{
          @"status":@"error",
          @"checkoutId":applepayCheckoutId
          };
          resolve(transactionResult);

        }
      
      
   
    }
}

RCT_EXPORT_METHOD(transactionPayment: (NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject) {
    
    NSError * _Nullable error;
   
  for (NSString *key in options) {
        NSLog(@"key: %@, value: %@ \n", key, [options valueForKey:key]);
    }
    OPPCardPaymentParams *params = [OPPCardPaymentParams cardPaymentParamsWithCheckoutID:[options valueForKey:@"checkoutID"]

                                                                        paymentBrand:[options valueForKey:@"paymentBrand"]
                                                                              holder:[options valueForKey:@"holderName"]
                                                                              number:[options valueForKey:@"cardNumber"]
                                                                         expiryMonth:[options valueForKey:@"expiryMonth"]
                                                                          expiryYear:[options valueForKey:@"expiryYear"]
                                                                                 CVV:[options valueForKey:@"cvv"]
                                                                               error:&error];
 


    if (error) {
      NSLog(@"%s", "error");

      reject(@"transactionPayment",error.localizedDescription, error);
    } else {
       params.shopperResultURL = @"com.HyperPayApp.ReactNative.payments://result";
      
      //params.tokenizationEnabled = YES;
      OPPTransaction *transaction = [OPPTransaction transactionWithPaymentParams:params];

      [provider submitTransaction:transaction completionHandler:^(OPPTransaction * _Nonnull transaction, NSError * _Nullable error) {
        NSDictionary *transactionResult;
        if (transaction.type == OPPTransactionTypeAsynchronous) {
          // Open transaction.redirectURL in Safari browser to complete the transaction
//
//          [self sendEventWithName:@"onSessionConnect" body:@{@"redirectURL": transaction.redirectURL.absoluteString, @"status":@"pending",
//                                                             @"checkoutID":transaction.paymentParams.checkoutID
//          }];
          NSLog(@"%s", "aysnc");
          NSLog(@"%@", transaction.redirectURL.absoluteString);
          
           transactionResult = @{
          @"redirectURL":transaction.redirectURL.absoluteString,
          @"status":@"pending",
          @"checkoutId":transaction.paymentParams.checkoutID
          };
          resolve(transactionResult);
        }  else if (transaction.type == OPPTransactionTypeSynchronous) {
          NSLog(@"%s", "sync");
          transactionResult = @{
          @"status":@"completed",
          @"checkoutId":transaction.paymentParams.checkoutID
          };
          resolve(transactionResult);
        } else {
          NSLog(@"%s", "error payment");

          reject(@"transactionPayment",error.localizedDescription, error);
          // Handle the error
        }
      }];
    }
}

RCT_EXPORT_METHOD(tokenizedTransaction: (NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  NSError * _Nullable error;
  
 
  OPPTokenPaymentParams *tokenParams = [OPPTokenPaymentParams tokenPaymentParamsWithCheckoutID:[options valueForKey:@"checkoutID"] tokenID:[options valueForKey:@"tokenID"] paymentBrand:[options valueForKey:@"paymentBrand"] error:&error];
  if (error) {
      // See error.code (OPPErrorCode) and error.localizedDescription to identify the reason of failure.
    reject(@"tokenizedTransaction",error.localizedDescription, error);
  }else{
    OPPTransaction *transaction = [OPPTransaction transactionWithPaymentParams:tokenParams];
    
    
    [provider submitTransaction:transaction completionHandler:^(OPPTransaction * _Nonnull transaction, NSError * _Nullable error) {
      if (transaction.type == OPPTransactionTypeAsynchronous) {
        // Open transaction.redirectURL in Safari browser to complete the transaction
      }  else if (transaction.type == OPPTransactionTypeSynchronous) {
       resolve(transaction);
      } else {
        reject(@"tokenizedTransaction",error.localizedDescription, error);
        // Handle the error
      }
    }];
    
    
  }
  
  
  
  
}


RCT_EXPORT_METHOD(validateCardInfo:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
  if(![OPPCardPaymentParams isHolderValid:[options valueForKey:@"cardNumber"]]){
    reject(@"validateCardInfo", @"invalid card number",nil);
  }else if(![OPPCardPaymentParams isCvvValid:[options valueForKey:@"cvv"]]){
    reject(@"validateCardInfo", @"invalid CVV", nil);
  }else if(![OPPCardPaymentParams isExpiryYearValid:[options valueForKey:@"expiryYear"]]){
             reject(@"validateCardInfo", @"invalid expiry Year", nil);
  }else if(![OPPCardPaymentParams isExpiryMonthValid:[options valueForKey:@"expiryMonth"]]){
    reject(@"validateCardInfo", @"invalid expiry month", nil);
  }else if(![OPPCardPaymentParams isExpiredWithExpiryMonth:[options valueForKey:@"expiryMonth"] andYear:[options valueForKey:@"expiryYear"]]){
    reject(@"validateCardInfo", @"Card is expiried", nil);
  }else{
    resolve([NSNull null]);
  }
}

@end
