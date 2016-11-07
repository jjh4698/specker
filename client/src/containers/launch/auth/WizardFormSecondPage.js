import React from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './validate'
import renderField from './renderField'
import address_search from './address_search';

const renderError = ({ meta: { touched, error } }) => touched && error ?
    <span>{error}</span> : false

const WizardFormSecondPage = (props) => {
    const { handleSubmit, previousPage, invalid ,pristine, submitting } = props
    return (
        <form onSubmit={handleSubmit} className="SignUpBox">
            <div className="SignUpLogo">
                SIGN UP
            </div>
            <div className="SignUp-Line"></div>
            <div>
                <label className="SignUp-white">성별</label>
                <div className="SignUp-letter">
                    <label><Field name="sex" component="input" type="radio" value="male"/> Male</label>
                    <label><Field name="sex" component="input" type="radio" value="female"/> Female</label>
                </div>
                <div className="SignUp-letter">
                    <Field name="age" type="text" component={renderField} label="나이" placeholder="ex)23"/>
                </div>
                <div className="SignUp-letter">
                    <Field name="address" type="text" component={address_search} label="주소" placeholder="ex)마두동,신논현동,청담동"/>
                </div>

            </div>
            {invalid===true && <button className="next-button-false" >Next</button> }
            {invalid===false && <button className="next-button-true" >Next</button> }

        </form>
    )
}

export default reduxForm({
    form: 'wizard',  //Form name is same
    destroyOnUnmount: false,
    validate
})(WizardFormSecondPage)