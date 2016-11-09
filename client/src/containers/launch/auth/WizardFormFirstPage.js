import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import renderField from './renderField'
import asyncValidate from './asyncValidate'
import StepZilla from 'react-stepzilla'
/*

 <div className="SignInBox">

 <form className="SignUp-Form" onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
 <fieldset className="SignUp-row-Box">
 <label className="SignUp-Label">이름</label>
 <br/>
 <input {...name} className="SignUp-Input" />
 {name.touched && name.error && <div className="error">{name.error}</div>}
 </fieldset>
 <fieldset className="SignUp-row-Box">
 <label className="SignUp-Label">Email</label>
 <br/>
 <input {...email} className="SignUp-Input" />
 {email.touched && email.error && <div className="error">{email.error}</div>}
 </fieldset>
 <fieldset className="SignUp-row-Box">
 <label className="SignUp-Label">Password:</label>
 <br/>
 <input {...password} className="SignUp-Input" type="password" />
 {password.touched && password.error && <div className="error">{password.error}</div>}
 </fieldset>
 <fieldset className="SignUp-row-Box">
 <label className="SignUp-Label">Confirm Password:</label>
 <br/>
 <input  {...passwordConfirm}  className="SignUp-Input" type="password" />
 {passwordConfirm.touched && passwordConfirm.error && <div className="error">{passwordConfirm.error}</div>}
 </fieldset>
 {this.renderAlert()}
 <button className = "btn btn-primary" disabled={pristine}>Next</button>
 </form>
 */
const WizardFormFirstPage = (props) => {
    const { handleSubmit ,invalid ,pristine, submitting, asyncValidating} = props;

    //console.log("hello", props);
    return (

            <form onSubmit={handleSubmit} className="SignUpBox">
                <div className="SignUpLogo">
                    SIGN UP
                </div>
                <div className="SignUp-Line"></div>
                        <div>
                            asjdljsakldjalsldf;jl;sadgjlsag
                        </div>


                <div>
                    <label className="SignUp-white">이름</label>
                    <div className="SignUp-letter">
                        <Field name="name" type="text" className="test" component={renderField} label="이름"/>
                    </div>
                    <label className="SignUp-white">이메일</label>
                    <div className="SignUp-letter">
                        <Field  name="email" type="email" component={renderField} label="이메일"/>
                    </div>
                    <label className="SignUp-white">비밀번호</label>
                    <div className="SignUp-letter">
                        <Field name="password" type="password" component={renderField} label="비밀번호"/>
                    </div>
                    <label className="SignUp-white">비밀번호 확인</label>
                    <div className="SignUp-letter">
                    <Field name="passwordconfirm" type="password" className="SignUp-letter" component={renderField} label=""/>
                    </div>


                    {invalid==true&&asyncValidating==false? <button className="next-button-false" >Next</button>  : <button className="next-button-true" >Next</button>}


                </div>


            </form>

    )
}


/*
*
 <div>
 <button className="next-button" disabled={pristine}>Next</button>
 </div>

 * */
export default reduxForm({
    form: 'wizard',              // <------ same form name
    destroyOnUnmount: false,     // <------ preserve form data
    asyncValidate,
    validate,
    asyncBlurFields: [ 'email' ]
})(WizardFormFirstPage)