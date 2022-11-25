import React, { Component } from 'react';
import ThankYouView from './ThankYouView';


class ThankYou extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    onBack = () => {
        this.props.navigation.navigate("Payment")
    }
    render() {
        return (
            <ThankYouView
                onBack={this.onBack}
                {...this.state}
                {...this.props}
            />
        );
    }

}



export default ThankYou
