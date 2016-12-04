/**
 * Created by wjdwn on 2016-12-04.
 */
import React, { Component } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../../config';


class HomeSiderbarFosterBox extends Component{



    render(){
        const { foster } = this.props;
        return (
        <div className="home-foster-box">
             <div className="main-name">{foster.user}</div>
             <div className="sub-name">{foster.date}</div>
             <div className="lines"/>
        </div>
        );
    }
}

export default HomeSiderbarFosterBox;