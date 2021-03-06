import { LAUNCH_PAGE_STATE, LAUNCH_LINK_STATE, AUTH_ERROR, AUTH_USER, UN_AUTH_USER,
    SAVE_CLASSIFICATION_TAG_DATA, GET_CLASSIFICATION_TAG_DATA, TAG_INCOMPLETE_USER
        } from './types';
import axios from 'axios';
import { browserHistory } from 'react-router';

const ROOT_URL = 'http://127.0.0.1:3000';

export function launchUpdatePageState(pageState){
    return function(dispatch){
        dispatch({
            type:LAUNCH_PAGE_STATE,
            payload:pageState
        })
    }

}

export function launchUpdateLinkState(linkState){
    return function(dispatch){
        dispatch({
            type:LAUNCH_LINK_STATE,
            payload:linkState
        })
    }

}




export function signinUser({ email, password }) {
    return function(dispatch) {
        // Submit email/password to the server
        axios.post(`${ROOT_URL}/signin`, { email, password })
            .then(response => {
                // If request is good...
                if(response.data.userStatus==TAG_INCOMPLETE_USER){
                    dispatch({ type: TAG_INCOMPLETE_USER });
                    // - Save the JWT token
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('status', response.data.userStatus);
                    // - redirect to the route '/feature'
                    browserHistory.push('/classification');

                }
                else{
                    // - Update state to indicate user is authenticated
                    dispatch({ type: AUTH_USER });
                    // - Save the JWT token
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('status', response.data.userStatus);
                    // - redirect to the route '/feature'
                    browserHistory.push('/home');
                }

            })
            .catch(() => {

                dispatch(authError('Bad Login Info'));
            });
    }
}

export function signupUser({ email, password }) {
    return function(dispatch) {
        axios.post(`${ROOT_URL}/signup`, { email, password })
            .then(response => {

                dispatch({ type: response.data.userStatus });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('status', response.data.userStatus);
                browserHistory.push('/classification');
            })
            .catch(response => {

                dispatch(authError(response.response.data.error))
            });
    }
}

export function authError(error) {
    return {
        type: AUTH_ERROR,
        payload: error
    };
}

export function signoutUser() {
    localStorage.removeItem('token');

    return { type: UNAUTH_USER };
}

export function getClassificationTagData(keyword, callback) {
    return function (dispatch) {


        axios.post(`${ROOT_URL}/getClassification`,{keyword:keyword}, {
            headers: {
                authorization: localStorage.getItem('token')
            }
        })
            .then(response => {
                dispatch({
                    type: GET_CLASSIFICATION_TAG_DATA,
                    payload: response.data
                });
                callback();
            })
            .catch(response => {
                console.log("whywhy?", response.response.data);
            });
    }
}

export function saveClassificationSearchData(tags) {
    return function(dispatch) {

        let tagNames=[];
        for(var tag in tags){
            tagNames.push(tags[tag].text);
        }

        axios.post(`${ROOT_URL}/saveClassification`, { tag:tagNames, token: localStorage.getItem('token')},{
            headers: { 'authorization': localStorage.getItem('token'),
                        'Content-Type': 'application/json'}
        })
            .then(response => {
                // dispatch({ type: AUTH_USER });
                // localStorage.setItem('token', response.data.token);
                // browserHistory.push('/classification');
                console.log("good", response);
                dispatch({ type: AUTH_USER });
                // - Save the JWT token
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('status', response.data.userStatus);
                // - redirect to the route '/feature'
                browserHistory.push('/home');
            })
            .catch(response => {
                console.log("bad");
                // dispatch(authError(response.data.error))
            });
    }
}



