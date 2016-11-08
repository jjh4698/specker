import React, { Component } from 'react';
import ClassificationSearchForm from '../containers/classification/classification-search-form';


class Classification extends Component{
    render(){
        return(
            <div className="classification-background">
                <a href="/" className="launch-header-logo col-lg-1 col-md-1 col-sm-1 col-xs-1">SPECKER</a>
                <div className="launch-header-line"></div>
                <div className="classification-logo">목표 선택</div>
                <div className="classification-msg">정보를 받아보고 싶은 목표태그를 검색해 자유롭게 선택해주세요.</div>
                <div className="classification-msg">*최소 3개 입력, 마이페이지에서 변경가능</div>
                <ClassificationSearchForm />
            </div>

        );
    }
}

export default Classification;

