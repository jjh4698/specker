import axios from 'axios';
import { SERVER_URL } from '../../../../config';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const asyncValidate = (values, dispatch) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            axios.post(`${SERVER_URL}/isEmailExisted`, {email: values.email})
                .then(response => {
                    // If request is good...
                    const errors = {};
                    if(response.data.error){
                        errors.email = response.data.error;
                        reject(errors);
                    }
                    resolve();

                })
                .catch(response => {
                    reject('server error!');

                });
        }, 500)
    });
};

export default asyncValidate
