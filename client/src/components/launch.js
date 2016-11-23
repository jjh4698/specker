import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import {SectionsContainer, Section, Header, Footer} from 'react-fullpage';

import LaunchBodyFirst from '../containers/launch/launch-body-first';
import LaunchHeader from '../containers/launch/launch-header';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { launchUpdatePageState, launchUpdateLinkState } from '../actions/index';

let options = {
    sectionClassName:     'section',
    anchors:              ['sectionOne', 'sectionTwo', 'sectionThree'],
    scrollBar:            false,
    navigation:           false,
    verticalAlign:        false,
    sectionPaddingTop:    '0px',
    sectionPaddingBottom: '0px',
    arrowNavigation:      false
};

class Launch extends Component {

    componentWillMount() {
        if (this.props.authenticated&&this.props.tagAuthenticated) {
            this.context.router.push('/home');

        }
        else if(this.props.authenticated){
            this.context.router.push('/classification');
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.authenticated&&nextProps.tagAuthenticated) {
            this.context.router.push('/home');

        }
        else if(nextProps.authenticated){
            this.context.router.push('/classification');
        }
    }

    static contextTypes = {
        router:PropTypes.object
    };


    constructor(props) {
        super(props);

        this.props.launchUpdatePageState(0);
        this.props.launchUpdateLinkState(0);

    }

    shouldComponentUpdate(nextProps){
/*hello eveybody!!!!*/
        switch (nextProps.location.hash){
            case '#sectionOne':
                this.props.launchUpdatePageState(0);
                break;
            case '#sectionTwo':
                this.props.launchUpdatePageState(1);
                break;
            case '#sectionThree':
                this.props.launchUpdatePageState(2);
                break;
        }
        return true;
    }

    render() {
        if (this.props.authenticated&&this.props.tagAuthenticated||this.props.authenticated) {
            return(
                <div></div>
            )

        }
        return (

            <div>
                <LaunchHeader/>
                <SectionsContainer {...options}>
                    <div className="launch-body-background-image"/>
                    <Section  color="#69D2E7">
                        <LaunchBodyFirst />
                    </Section>
                    <Section color="#A7DBD8">
                        page 2
                    </Section>
                    <Section color="#E0E4CC">Page 3</Section>
                </SectionsContainer>
            </div>
        );
    }
}

function mapStateToProps(state){
    return {pageState:state.launch.pageState, linkState:state.launch.linkState, authenticated: state.auth.authenticated, tagAuthenticated: state.auth.tagAuthenticated};
}
function mapDispatchToProps(dispatch){
    return bindActionCreators({ launchUpdatePageState, launchUpdateLinkState }, dispatch);
}




export default connect(mapStateToProps, mapDispatchToProps)(Launch);
