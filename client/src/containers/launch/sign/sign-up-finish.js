import React,{ Component } from 'react'
import { reduxForm } from 'redux-form'


// const renderError = ({ meta: { touched, error } }) => touched && error ?
//     <span>{error}</span> : false

class WizardFormThirdPage extends Component{
    componentDidMount(){
        console.log(this.props.email);
    }



    componentDidUpdate(){
    }
    render(){
        console.log("hello");
        return(
            <form className="SignUpBox">
                <div className="SignUpLogo">
                    SIGN UP
                </div>
                <div className="SignUp-Line"></div>
                <div className="pro-container row">
                    <ul className="progressbar">
                        <li className="active"></li>
                        <li className="active"></li>
                        <li className="active"></li>
                    </ul>
                </div>

                <div className="SignUp-mail-image">
                </div>
                <div className="SignUp-third-white">
                    <img src="../images/confirmed_check.png"/>인증메일 전송 완료
                </div>
                <div className="SignUp-white">
                    {localStorage.getItem('name')}님께서 입력하신 {localStorage.getItem('email')}으로 메일 전송을 완료했습니다.
                </div>
                <div className="SignUp-fourth-white">
                    확인해주세요.
                </div>
            </form>
        );
    }
}


export default reduxForm({
    form: 'wizard',  //Form name is same
    destroyOnUnmount: false
})(WizardFormThirdPage)