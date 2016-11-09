import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getClassificationTagData, saveClassificationSearchData } from '../../actions/index';

let currentSuggest;
//한글자 이상 쳐야만 가져오게끔
class ClassificationSearchForm extends Component{

    handleCompleteBtn(e){
        e.preventDefault();
        this.props.saveClassificationSearchData(this.state.tags);

    }

    renderCompleteBtn(){              //여기서 에러처리 ex. 10개 이상 선택
        if(this.state.tags.length>2){
            return(
                <div>
                    <a onClick={this.handleCompleteBtn.bind(this)
                    } className="classificationCompleteBtn">NEXT</a>
                    <div className="classification-arrow">
                        <img src="../images/Next_Arrow_A.png"/>
                    </div>
                </div>
            )
        }
        return(
            <div className="row">
                <div className="classificationCompleteBtn-false">NEXT</div>
                <div className="classification-arrow">
                    <img src="../images/Next_Arrow_UA.png"/>
                </div>
            </div>
        )
    }
    constructor(props){
        super(props);
        this.state={
            suggestions:[],
            tags:[]
        };


    }
    componentDidMount(){
        this.props.getClassificationTagData('');
    }


    shouldComponentUpdate(nextProps, nextState){
        if(nextProps.tagData!==this.props.tagData){
            this.setState({
                suggestions:nextProps.tagData
            });
            return false;
        }
        return true;

    }


    handleFilterSuggestions(textInputValue, possibleSuggestionsArray){
        var lowerCaseQuery = textInputValue.toLowerCase();
        let tags = this.state.tags;
        // console.log(possibleSuggestionsArray);

        // for(var i=0; i<tags.length; i++){
        //     console.log("tags[i]:", tags[i]);
        //
        //     var index = possibleSuggestionsArray.indexOf(tags[i]);
        //     console.log("index:", index);
        //     if(index!=-1){
        //         possibleSuggestionsArray.splice(index, 1);
        //     }
        // }
        var resultSuggestion=[];
        for(var i=0; i<possibleSuggestionsArray.length; i++){
            if(possibleSuggestionsArray[i].toLowerCase().includes(lowerCaseQuery)){
                resultSuggestion.push(possibleSuggestionsArray[i]);
            }
        }

        resultSuggestion.sort((a,b)=>{
                    let a_findIndex = a.toLowerCase().indexOf(textInputValue.toLowerCase());
                    let b_findIndex = b.toLowerCase().indexOf(textInputValue.toLowerCase());

                    if(a_findIndex>b_findIndex)
                        return 1;

                    else{
                        if(a_findIndex==b_findIndex){
                            if(a.toLowerCase()>b.toLowerCase())
                                return 1;
                        }
                return -1;
            }

        });
        currentSuggest=resultSuggestion;
        return resultSuggestion;
        // return possibleSuggestionsArray.filter(function(suggestion)  {
        //     return suggestion.toLowerCase().includes(lowerCaseQuery)
        // })
    }

    handleDelete(i) {

        let tags = this.state.tags;
        let suggestions = this.state.suggestions;
        suggestions.push({
            id: suggestions.length + 1,
            name: tags[i].text
        });
        tags.splice(i, 1);
        console.log(tags);
        this.setState({tags: tags, suggestions: suggestions});

    }
    handleAddition(tag) {
        let tags = this.state.tags;
        let suggestions = this.state.suggestions;
        let deleteIndex = -1;
        if(tags.length>15){

        }
        else if(currentSuggest.length>0) {
            console.log("name :", tag);
            for (var i = 0; i < suggestions.length; i++) {
                if (suggestions[i].name == tag) {
                    deleteIndex = i;
                    break;
                }
            }
            if (deleteIndex > 0) {
                suggestions.splice(deleteIndex, 1);
                console.log("hello");
            }
            tags.push({
                id: tags.length + 1,
                text: tag
            });
            this.setState({tags: tags, suggestions: suggestions});
        }

    }
    handleDrag(tag, currPos, newPos) {
        let tags = this.state.tags;

        // mutate array
        tags.splice(currPos, 1);
        tags.splice(newPos, 0, tag);

        // re-render
        this.setState({ tags: tags });
    }

    render() {
        let tags = this.state.tags;
        let suggestions = this.state.suggestions;
        let searchProcessedData = [];
        if(suggestions) {

            suggestions.map(function (result) {
                searchProcessedData.push(result.name);
            });
        }

        return (

            <div className="row">
                <ReactTags tags={tags}
                           handleFilterSuggestions={this.handleFilterSuggestions.bind(this)}
                           suggestions={searchProcessedData}
                           handleDelete={this.handleDelete.bind(this)}
                           handleAddition={this.handleAddition.bind(this)}
                           autocomplete={true}
                           autofocus={true}
                           minQueryLength={1}/>
                {this.renderCompleteBtn()}
            </div>
        )
    }
}


function mapStateToProps(state){

    return { tagData: state.classificationTagData.tagData };
}

function mapDispatchToProps(dispatch){
    return bindActionCreators({ getClassificationTagData, saveClassificationSearchData }, dispatch);
}




export default connect(mapStateToProps, mapDispatchToProps)(ClassificationSearchForm);
