import React,{ Component } from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import renderField from './renderField'

// const renderError = ({ meta: { touched, error } }) => touched && error ?
//     <span>{error}</span> : false

class WizardFormThirdPage extends Component{
    componentDidMount(){
        console.log(this.props.email);
    }



    componentDidUpdate(){
        console.log("asdsad");
        console.log(this.props);
    }
    render(){
        console.log("hello");
        const { handleSubmit, previousPage, invalid ,pristine, submitting } = this.props;
        return(
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
                <div className="SignUp-white">
                    입력하신 {this.props.email}으로 메일 전송을 완료했습니다. 확인해주세요.
                </div>

            </form>
        );
    }
}


export default reduxForm({
    form: 'wizard',  //Form name is same
    destroyOnUnmount: false,
    validate
})(WizardFormThirdPage)