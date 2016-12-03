import React, { Component } from 'react';
import IndexNavbar from '../containers/index/index-navbar';
import IndexSidebar from '../containers/index/index-sidebar';
import io from 'socket.io-client'
import { SERVER_URL } from '../../config';

let socket = io(SERVER_URL);


class Index extends Component{
    constructor () {
        super();

        socket.emit('sang', 'good!');
    }
    render(){
        return(
            <div className="index">
                <IndexNavbar />
                {this.props.children}

                <IndexSidebar />
            </div>

        );
    }
}

export default Index;

