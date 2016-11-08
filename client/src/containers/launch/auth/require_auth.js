import React, { Component } from 'react';
import { connect } from 'react-redux';

export default function(ComposedComponent) {
    class Authentication extends Component {
        static contextTypes = {
            router: React.PropTypes.object
        };

        componentWillMount() {
            if (!this.props.authenticated) {
                console.log("ra1");
                this.context.router.push('/');
            }

        }

        componentWillUpdate(nextProps) {
            if (!nextProps.authenticated) {
                console.log("ra2");
                this.context.router.push('/');
            }
        }

        render() {
            return <ComposedComponent  {...this.props} />
        }
    }

    function mapStateToProps(state) {
        console.log("ra",state.auth.authenticated);
        return { authenticated: state.auth.authenticated };
    }

    return connect(mapStateToProps)(Authentication);
}
