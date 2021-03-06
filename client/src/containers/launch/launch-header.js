import React, { Component } from 'react';
import * as actions from '../../actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { launchUpdatePageState, launchUpdateLinkState } from '../../actions/index';
import {Header} from 'react-fullpage';


class LaunchHeader extends Component {


    signInBtnClicked(){
        this.props.launchUpdateLinkState(1);
    }
    signUpBtnClicked(){

        this.props.launchUpdateLinkState(2);
    }
    render() {
        if(this.props.pageState!=undefined) {
            if (this.props.pageState !== 0) {
                return (
                    <Header className="launch-header">
                        <a href="/" className="launch-header-logo col-lg-1 col-md-1 col-sm-1 col-xs-1">LOGO</a>
                        <a onClick={this.signInBtnClicked.bind(this)} href="#sectionOne"
                           className="launch-header-btn col-lg-offset-9 col-lg-1 col-md-offset-9 col-md-1 col-sm-offset-9 col-sm-1 col-xs-offset-7 col-xs-2"
                           ref={0}>로그인</a>
                        <a onClick={this.signUpBtnClicked.bind(this)} href="#sectionOne" className="launch-header-btn col-lg-1 col-md-1 col-sm-1 col-xs-2" ref={0}>회원가입</a>
                    </Header>
                );

            }
            else {
                if (this.props.linkState == 0) {
                    return (
                        <Header className="launch-header">
                            <a href="/" className="launch-header-logo col-lg-1 col-md-1 col-sm-1 col-xs-1">LOGO</a>

                        </Header>

                    );
                }
                else if (this.props.linkState == 1) {
                    return (
                        <Header className="launch-header">
                            <a href="/" className="launch-header-logo col-lg-1 col-md-1 col-sm-1 col-xs-1">LOGO</a>
                            <a onClick={this.signUpBtnClicked.bind(this)}
                               href="#sectionOne"
                               className="launch-header-btn col-lg-offset-10 col-md-offset-10  col-sm-offset-10 col-xs-offset-9 col-lg-1 col-md-1 col-sm-1 col-xs-2"
                               ref={0}>회원가입</a>
                        </Header>
                    );
                }
                else {
                    return (
                        <Header className="launch-header">
                            <a href="/" className="launch-header-logo col-lg-1 col-md-1 col-sm-1 col-xs-1">LOGO</a>
                            <a onClick={this.signInBtnClicked.bind(this)}
                               href="#sectionOne"
                               className="launch-header-btn col-lg-offset-9 col-lg-1 col-md-offset-9 col-md-1 col-sm-offset-9 col-sm-1 col-xs-offset-7 col-xs-2"
                               ref={0}>로그인</a>
                        </Header>
                    );
                }


            }
        }
        else{
            return (
                <Header className="launch-header">
                    <a href="/" className="launch-header-logo col-lg-1 col-md-1 col-sm-1 col-xs-1">LOGO</a>
                </Header>

            );
        }
    }



}


function mapStateToProps(state){
    return {pageState:state.launch.pageState, linkState:state.launch.linkState};
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({ launchUpdatePageState, launchUpdateLinkState }, dispatch);
}




export default connect(mapStateToProps, mapDispatchToProps)(LaunchHeader);
