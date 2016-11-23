import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { signinUser, launchUpdateLinkState, launchUpdatePageState } from '../../actions/index'
import SignIn from './sign/sign-in';
import SignUp from './sign/sign-up';
import SignInAuthInvalid from './sign/sign-in-auth-invalid';
import {Section} from 'react-fullpage';

class LaunchBodyFirst extends Component{

    signinBtnClicked(){
        this.props.launchUpdateLinkState(1);
    }
    signupBtnClicked(){

        this.props.launchUpdateLinkState(2);
    }

    render(){

        if(this.props.linkState==2){
            return(
                        <SignUp />
            );
        }

        else if(this.props.isEmailing){
            return(

                    <SignInAuthInvalid />

            );
        }

        else if(this.props.linkState==1){
            return(
                    <SignIn signinUser={this.props.signinUser} />
            );
        }

        return(
            <Section>
            <div className="vertical-center">
                <div className="launch-body-title row">

                    <div className="launch-body-first-letter">SPECKER</div>
                    <div className="launch-body-second-letter">SPEC-UP-TOGETHER</div>
                </div>
                <div className="launch-body-content row">
                        <button className="SignInButton" onClick={this.signinBtnClicked.bind(this)}>Sign In</button>
                        <button className="SignUpButton" onClick={this.signupBtnClicked.bind(this)}>Sign Up</button>
                </div>
            </div>
            </Section>
        );


    }
}


function mapStateToProps(state){
    console.log("hahahoho!",state);
    return {isEmailing: state.auth.isEmailing, pageState:state.launch.pageState, linkState:state.launch.linkState};
}
function mapDispatchToProps(dispatch){

    return bindActionCreators({ signinUser, launchUpdatePageState, launchUpdateLinkState }, dispatch);
}




export default connect(mapStateToProps, mapDispatchToProps)(LaunchBodyFirst);