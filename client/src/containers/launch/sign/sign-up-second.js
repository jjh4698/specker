import React,{Component} from 'react'
import { Field, reduxForm } from 'redux-form'
import validate from './sync-sign-up-second-validate'
import renderField from './render-field'
import Geosuggest from 'react-geosuggest';


var isAdressValid=true;
let address={
    label:"대한민국 서울특별시 관악구 서울대학교",
    lat:37.459882,
    lng:126.95190530000002,
    placeId:"ChIJpeKhoOiffDUR58XwBLzu4qE"
};

const renderError = ({ meta: { touched, error } }) => (
    touched && error ? <span>{error}</span> : <span className="row"> </span>);
class WizardFormSecondPage extends Component{

    handleFormSubmit(value) {
        value.address=address;
        this.props.signupUser(value);
    }

    constructor(props) {
        super(props);
        this.state = {
            queue: []
        };
    }
    onSuggestSelect(suggest) {
        isAdressValid=true;
        address.label = ""+suggest.label;
        address.lat = suggest.location.lat;
        address.lng = suggest.location.lng;
        address.placeId = ""+suggest.placeId;
        this.setState({queue:[]});

    }
    onBlur(value){

        var temp = this.state.queue.shift();
        if(value!=temp){
            // this.update(temp);
            isAdressValid=false;
        }
        else{
            isAdressValid=true;

        }
        address.label=""+value;
        console.log(this.props);
        this.setState({queue:[]});


    }
    onChange(suggest){
        isAdressValid=false;
    }


    onKeyPress(event){
        this.setState({ queue: [] });
    }

    onSuggestNoResults(userInput){
        isAdressValid=false;

    }
    getSuggestLabel(suggest){
        this.setState({queue: this.state.queue.concat(suggest.description)});
        return suggest.description;
    }

    render(){
        const { handleSubmit ,invalid ,pristine, submitting, previousPage } = this.props;
        console.log("hahaha!: "+isAdressValid+"sajdasd: "+invalid);
        return (
            <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} className="SignUpBox">
                <div className="SignUpLogo">
                    SIGN UP
                </div>
                <div className="SignUp-Line"></div>

                <div className="pro-container row">
                    <ul className="progressbar">
                        <li className="active"></li>
                        <li className="active"></li>
                        <li></li>
                    </ul>
                </div>
                <div>
                    <label className="SignUp-white">성별</label>
                    <div className="SignUp-letter">
                        <label><Field name="sex" component="input" type="radio" value="male"/> Male</label>
                        <label><Field name="sex" component="input" type="radio" value="female"/> Female</label>
                        <Field name="sex" component={renderError}/>
                    </div>
                    <div className="SignUp-letter">
                        <Field name="age" type="text" component={renderField} label="나이" placeholder="ex)23"/>
                    </div>
                    <Geosuggest
                        className="SignUp-letter"
                        placeholder="ex)마두동,신논현동,청담동"
                        initialValue={address.label}
                        onSuggestSelect={this.onSuggestSelect.bind(this)}
                        country="kr"
                        onKeyPress={this.onKeyPress.bind(this)}
                        onSuggestNoResults={this.onSuggestNoResults}
                        onChange={this.onChange.bind(this)}
                        onBlur={this.onBlur.bind(this)}
                        autoActivateFirstSuggest={true}
                        getSuggestLabel={this.getSuggestLabel.bind(this)}
                        location={new google.maps.LatLng(37.459882, 126.95190530000002)}
                        radius="20" />
                </div>

                {isAdressValid==false||invalid==true ?  <div><button type="button" disabled={pristine} className="next-button-false" >Next</button><img src="../images/Next_Arrow_UA.png"/> </div>  : <div><button type="submit" className="next-button-true" >Next</button> <img src="../images/Next_Arrow_A.png"/> </div>}
            </form>
        )
    }

}


export default reduxForm({
    form: 'wizard',  //Form name is same
    destroyOnUnmount: false,
    validate
})(WizardFormSecondPage)