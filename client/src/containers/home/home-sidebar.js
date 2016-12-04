import React, { Component } from 'react';
import axios from 'axios';
import { SERVER_URL } from '../../../config';
import HomeSiderbarFosterBox from './home-sidebar-fosterbox';

class HomeSidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fosters: {}
        };

    }

    componentWillMount() {
        console.log("recteam");
        axios.post(`${SERVER_URL}/recommandTeam`,null, {
            headers: {
                authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            //팀 정보가 넘어옴

            //dispatch({ type: response.data.userStatus });
            // console.log("recteam-data");
            // console.log(response);

        }).catch(response => {

        });
        console.log("recfoster");
        axios.post(`${SERVER_URL}/recommandFoster`,null, {
            headers: {
                authorization: localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        }).then(response => {
            // console.log("recfoster-response");
            //  // dispatch({ user: response.data.user});
              console.log(response);
            // console.log(date);
            this.setState({
                fosters:response
            })
            console.log(this.state.fosters);


        }).catch(response => {

        });
    }


    render(){
        let fosterInfo = this.state.fosters.data?this.state.fosters.data.map((i, index)=>{
            return <HomeSiderbarFosterBox foster={i}/>
        }):<div>no data</div>;
        return(
            <div className="home-sidebar-box">
                포스터 추천
                <div className="home-sidebar-line" />
                {fosterInfo}
                <ul className="teamRecommanded">
                    <li>good</li>
                    <li>good2</li>
                    <li>good3</li>
                </ul>
            </div>
        )
    }
}


export default HomeSidebar;

