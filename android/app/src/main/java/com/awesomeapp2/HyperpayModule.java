package com.awesomeapp2;

import android.app.Activity;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.net.Uri;
import android.os.IBinder;
import android.util.Log;
import android.widget.Toast;
import androidx.annotation.NonNull;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.oppwa.mobile.connect.checkout.dialog.CheckoutActivity;
import com.oppwa.mobile.connect.checkout.meta.CheckoutSettings;
import com.oppwa.mobile.connect.exception.PaymentError;
import com.oppwa.mobile.connect.payment.BrandsValidation;
import com.oppwa.mobile.connect.payment.CheckoutInfo;
import com.oppwa.mobile.connect.payment.ImagesRequest;
import com.oppwa.mobile.connect.payment.card.CardPaymentParams;
import com.oppwa.mobile.connect.provider.ITransactionListener;
import com.oppwa.mobile.connect.provider.OppPaymentProvider;
import com.oppwa.mobile.connect.provider.Transaction;
import com.oppwa.mobile.connect.provider.TransactionType;
import com.oppwa.mobile.connect.service.IProviderBinder;
import com.oppwa.mobile.connect.service.ConnectService;
import com.oppwa.mobile.connect.provider.Connect;
import com.oppwa.mobile.connect.exception.PaymentException;

import java.util.LinkedHashSet;
import java.util.Set;

public class HyperpayModule extends ReactContextBaseJavaModule implements ITransactionListener {

    private IProviderBinder binder;
    private Context mApplicationContext;
    private Intent bindIntent;
    private static ReactApplicationContext reactContext1 = null;


    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            Log.d("Hyperpay","notify");

            switch (resultCode) {

                case CheckoutActivity.RESULT_OK:
                    Log.d("Hyperpay","notify");

                    /* transaction completed */
                    Transaction transaction = data.getParcelableExtra(CheckoutActivity.CHECKOUT_RESULT_TRANSACTION);

                    /* resource path if needed */
                    String resourcePath = data.getStringExtra(CheckoutActivity.CHECKOUT_RESULT_RESOURCE_PATH);

                    if (transaction.getTransactionType() == TransactionType.SYNC) {

                        /* check the result of synchronous transaction */
                    } else {

                        /* wait for the asynchronous transaction callback in the onNewIntent() */
                    }

                    break;
                case CheckoutActivity.RESULT_CANCELED:
                    /* shopper cancelled the checkout process */
                    Log.d("Hyperpay","User Cancel");
                    WritableMap data1 = Arguments.createMap();

                    data1.putString("status","canceled");

                    getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit("transactionStatus",data1);
                    break;
                case CheckoutActivity.RESULT_ERROR:
                    /* error occurred */
                    PaymentError error = data.getParcelableExtra(CheckoutActivity.CHECKOUT_RESULT_ERROR);
            }

        }
    };


    public HyperpayModule(@NonNull ReactApplicationContext reactContext) {
        super(reactContext);

        mApplicationContext = reactContext.getApplicationContext();


        reactContext.addActivityEventListener(mActivityEventListener);

        reactContext1 = reactContext;

//        Intent intent = new Intent(mApplicationContext, ConnectService.class);
//
//        mApplicationContext.startService(intent);
//        mApplicationContext.bindService(intent, serviceConnection, Context.BIND_AUTO_CREATE);
    }
//    public void unBindService() {
//        if (serviceConnection != null) {
//            // Unbind from the In-app Billing service when we are done
//            // Otherwise, the open service connection could cause the device’s performance
//            // to degrade
//            mApplicationContext.unbindService(serviceConnection);
//        }
//    }
//    private ServiceConnection serviceConnection = new ServiceConnection() {
//        @Override
//        public void onServiceConnected(ComponentName name, IBinder service) {
//            binder = (IProviderBinder) service;
//            /* we have a connection to the service */
//            try {
//                binder.initializeProvider(Connect.ProviderMode.TEST);
//            } catch (PaymentException ee) {
//                /* error occurred */
//            }
//        }
//
//        @Override
//        public void onServiceDisconnected(ComponentName name) {
//            binder = null;
//        }
//
//    };


    @NonNull
    @Override
    public String getName() {
        return "Hyperpay";
    }

    @ReactMethod
    public void transactionPayment(ReadableMap options, Promise promise) {
        // promiseModule = promise;

        try {

            boolean isTokenizationEnabled = true;
            CardPaymentParams cardPaymentParams = new CardPaymentParams(options.getString("checkoutID"),
                    options.getString("paymentBrand"), options.getString("cardNumber"), options.getString("holderName"),
                    options.getString("expiryMonth"), options.getString("expiryYear"), options.getString("cvv"));

            //cardPaymentParams.setTokenizationEnabled(true);
             cardPaymentParams.setShopperResultUrl("hyperpayapp://result");
            Transaction transaction = null;

            try {

//                transaction = new Transaction(cardPaymentParams);
               // Log.d("Hyeprpay", transaction);
//                binder.submitTransaction(transaction);
//                binder.addTransactionListener( HyperpayModule.this);

                OppPaymentProvider paymentProvider = new OppPaymentProvider(mApplicationContext, Connect.ProviderMode.TEST);
                transaction = new Transaction(cardPaymentParams);
                paymentProvider.submitTransaction(transaction, HyperpayModule.this);
                promise.resolve(null);
                Log.d("Hyperpay", "android call");
            } catch (PaymentException ee) {
                Log.d("Hyperpay", ee.getMessage());

                promise.reject(null, ee.getMessage());
            }
        } catch (PaymentException e) {
            Log.d("Hyperpay", e.getMessage());
            promise.reject(null, e.getMessage());
        }

    }


    @ReactMethod
    public void readyuiPayment(ReadableMap options, Promise promise) {
        // promiseModule = promise;

        Set<String> paymentBrands = new LinkedHashSet<String>();


        if (options.getString("paymentType").equals("mada_card")) {
            paymentBrands.add("MADA");

        } else if (options.getString("paymentType").equals("credit_card")) {
            paymentBrands.add("VISA");
            paymentBrands.add("MASTER");
        } else if (options.getString("paymentType").equals("stc_pay")) {
            paymentBrands.add("STC_PAY");
        }



        CheckoutSettings checkoutSettings =  new CheckoutSettings(options.getString("checkoutID"),paymentBrands,
                Connect.ProviderMode.TEST);

        checkoutSettings.setShopperResultUrl("hyperpayapp://result");

        ComponentName componentName = new ComponentName(
                getCurrentActivity().getPackageName(), CheckoutBroadcastReceiver.class.getName());



        /* Set up the Intent and start the checkout activity. */
        Intent intent = checkoutSettings.createCheckoutActivityIntent(reactContext1, componentName);

reactContext1.startActivityForResult(intent,CheckoutActivity.REQUEST_CODE_CHECKOUT,null);

    }

    @Override
    public void brandsValidationRequestSucceeded(BrandsValidation brandsValidation) {

    }

    @Override
    public void brandsValidationRequestFailed(PaymentError paymentError) {

    }

    @Override
    public void imagesRequestSucceeded(ImagesRequest imagesRequest) {

    }

    @Override
    public void imagesRequestFailed() {

    }

    @Override
    public void binRequestSucceeded(@NonNull String[] strings) {

    }

    @Override
    public void binRequestFailed() {

    }

    @Override
    public void paymentConfigRequestSucceeded(CheckoutInfo checkoutInfo) {

    }

    @Override
    public void paymentConfigRequestFailed(PaymentError paymentError) {


    }

    @Override
    public void transactionCompleted(Transaction transaction) {

        WritableMap data = Arguments.createMap();
        Log.d("Hyperpay", "transaction complate");
        if (transaction.getTransactionType() == TransactionType.ASYNC){
//            Intent viewIntent =
//                    new Intent("android.intent.action.VIEW",
//                            Uri.parse("http://www.stackoverflow.com/"));

            data.putString("redirectUrl", transaction.getRedirectUrl());
            data.putString("status", "pending");
        }else{
            
            data.putString("status", "complated");
        }
        // shoud add listner



        data.putString("checkoutID", transaction.getPaymentParams().getCheckoutId());

        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("transactionStatus", data);

        // promiseModule.resolve(transaction);

    }

    @Override
    public void transactionFailed(Transaction transaction, PaymentError paymentError) {

    }



}
