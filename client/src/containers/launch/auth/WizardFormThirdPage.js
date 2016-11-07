import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import renderField from './renderField'
import address_search from './address_search';

const renderError = ({ meta: { touched, error } }) => touched && error ?
    <span>{error}</span> : false

const WizardFormThirdPage = (props) => {
    const { handleSubmit, previousPage, invalid ,pristine, submitting } = props
    console.log("this err value");
    return (
        <form onSubmit={handleSubmit} className="SignUpBox">
            <div className="SignUpLogo">
                SIGN UP
            </div>
            <div className="SignUp-Line"></div>
            <div className="SignUp-mail-image">
            </div>
            <div className="SignUp-third-white">
                <img src="../images/confirmed_check.png"/>인증메일 전송 완료
            </div>
            <div className="SignUp-fourth-white">
                입력하신 {props.email}으로 메일 전송을 완료했습니다.
            </div>
            <div className="SignUp-fourth-white">
                확인해주세요.
            </div>

        </form>
    )
}

export default reduxForm({
    form: 'wizard',  //Form name is same
    destroyOnUnmount: false,
    validate
})(WizardFormThirdPage)