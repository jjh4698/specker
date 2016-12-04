const pretty = require('pretty');
const fs = require("fs");
const async = require('async');
const config = require('../config');

var imageSaver = require('./imageProcessor');
// custom optag for parser
const open = {
    name:'('
};
const close = {
    name:')'
};
const add = {
    name:'+'
};

const PERSON_MENTION = 'PERSON_MENTION';
const TAG_MENTION = 'TAG_MENTION';
const NO_FLAG = 'NO_FLAG';
const URL = 'URL';
const EMPTY = 'EMPTY';
const IMAGE = 'IMAGE';


function imgTag(tag, userId){

    var result = `<${tag.name} `;

    if(tag.hasOwnProperty('attrs')){

        if(tag.attrs.hasOwnProperty('class')&&tag.attrs.class!="")
            result += `class="${tag.attrs.class}" `;
        if(tag.attrs.hasOwnProperty('style'))
            result += `style="${tag.attrs.style}" `;

        if(tag.attrs.hasOwnProperty('itemprop')){            //이미지 일시
            var filePath = `${config.serverUrl}/feeds/${userId}/${new Date()}.${tag.attrs.itemtype.split("/")[1]}`.replace(/ /gi, '');
            console.log(filePath);
            var base64Data = tag.attrs.itemprop.replace(/^data:image\/png;base64,/, "");
            imageSaver.imageSaver(base64Data, filePath);
            result+= `src="http://${filePath}" `;

        }
        else {                          //임베드 이미지 일시
            result+= `src="${tag.attrs.src}" `;
        }
    }

    result+=`/>`;
    return result;


}
function isMention(tag){
    var regexHtml = /^(((http(s?))\:\/\/)?)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/;
    if(tag.content=='@'){
        return PERSON_MENTION;
    }
    else if(tag.content=='#'){
        return TAG_MENTION;
    }
    else if(regexHtml.test(tag.content)){
        return URL;
    }
    else if(tag.content.trim()==''){
        return EMPTY;
    }
    else{
        return NO_FLAG;
    }

}

function singleTag(tag){
    var result = `<${tag.name} `;
    if(tag.hasOwnProperty('attrs')){
        if(tag.attrs.hasOwnProperty('class')&&tag.attrs.class!="")
            result += `class="${tag.attrs.class}" `;
        if(tag.attrs.hasOwnProperty('style'))
            result += `style="${tag.attrs.style}" `;
    }
    result+=` />`;
    return result;
}

function doubleTag(c,p){
    var result = `<${p.name} `;
    if(p.hasOwnProperty('attrs')){
        if(p.attrs.hasOwnProperty('class')&&p.attrs.class!="")
            result += `class="${p.attrs.class}" `;
        if(p.attrs.hasOwnProperty('style'))
            result += `style="${p.attrs.style}" `;
    }
    result+=`>${c}</${p.name}>`;
    return result;
}

function resultTag(tag){
    return tag.content;
}



function addTag(firstTag, secondTag, userId){
    if(firstTag.name=='img')
        return `${imgTag(firstTag, userId)}${secondTag.content}`;
    else if(secondTag.name=='img')
        return `${firstTag.content}${imgTag(secondTag, userId)}`;

    else if(firstTag.content=='@'){
        return `<span class="mention">@${secondTag.content.replace(/(<([^>]+)>)/ig,'')}</span>`
    }
    else if(firstTag.content=='#'){
        return `<span class="tag">#${secondTag.content.replace(/(<([^>]+)>)/ig,'')}</span>`
    }
    return `${firstTag.content}${secondTag.content}`;
}

function includeTag(childTag,parentTag, userId){       //child==first
    var childHtml="";
    var statusFlag = NO_FLAG;
    var result="";
    switch (childTag.name){
        case 'br':
            childHtml = singleTag(childTag);
            break;
        case 'img':
            statusFlag=IMAGE;
            break;
        case 'result':
            childHtml = resultTag(childTag);
            break;
        default:                            //text일시
            statusFlag = isMention(childTag);
            childHtml = childTag.content;
            break;
    }

    switch (statusFlag){
        case PERSON_MENTION: case TAG_MENTION:
        result= `${childHtml}`;
        break;
        case URL:
            var regexHttp = /^((http(s?))\:\/\/)([0-9a-zA-Z\-]+\.)+[a-zA-Z]{2,6}(\:[0-9]+)?(\/\S*)?$/;
            if(!regexHttp.test(childHtml))
                childHtml=`http://${childHtml}`;

            result= `<a href="${childHtml}">${childHtml}</a>`;
            break;
        case NO_FLAG:
            result= doubleTag(childHtml, parentTag);
            break;
        case IMAGE:
            var temp1 = imgTag(childTag, userId);
            var temp2 = doubleTag(temp1, parentTag);
            result = temp2;
            break;
        default:
            result=" ";
    }
    return result;

}


exports.parser = function(dom, userId, callback){
    var result={
        content:'',
        mention:[],
        tag:[]
    };

    var stack = [];
    var queue = [];
    var operator_stack=[];
    var tag_stack=[];
    var tag1={};
    var tag2={};
    var tag1ToHtml="";
    var tag2ToHtml="";
    dom[0].attrs.class="feed-content";

    for(var i=0; i<dom[0].children.length; i++){
        dom[0].children[i].attrs.class="feed-content-row";
    }

    for(var i=dom[0].children.length-1; i>5; i--){
        dom[0].children[i].attrs.class+=" feed-content-invisible";
    }

    stack.push(dom[0]);
    while(stack.length!=0){

        var domElement  = stack.pop();
        switch (domElement.name){
            case '+':
                queue.push(domElement);
                break;
            case ')':
                queue.push(domElement);
                break;
            default:
                queue.push(domElement);

                if(domElement.children!=undefined&&domElement.children.length) {
                    queue.push(open);
                    stack.push(close);
                    for (var i = 0; i < domElement.children.length; i++) {
                        stack.push(domElement.children[i]);
                        if(i!=domElement.children.length-1){
                            stack.push(add);
                        }
                    }
                }
                break;
        }
    }


    async.whilst(
        function(){                          // 테스트 함수(여기서 true일 경우 다음 함수 진입)
            return queue.length!=0;
        },
        function(cb){// 테스트가 true일 경우
            var domElement  = queue.shift();
            switch (domElement.name){
                case '+':
                    operator_stack.push(domElement);
                    break;
                case ')':
                    var key=true;
                    async.whilst(
                        function(){
                            return key;
                        },
                        function(cb){
                            var opCode = operator_stack.pop();

                            switch(opCode.name){
                                case '+':
                                    var first = tag_stack.pop();
                                    var second = tag_stack.pop();

                                    var $html =addTag(first,second, userId);
                                    tag_stack.push({'name': 'result', 'content': $html});
                                    break;
                                case '(':
                                    var child = tag_stack.pop();
                                    var parent = tag_stack.pop();
                                    if(parent.hasOwnProperty('attrs')&&parent.attrs.hasOwnProperty('target')){
                                        if(child.content.replace(/(<([^>]+)>)/ig,'').indexOf('@')==0){
                                            result.mention.push(parent.attrs.target);
                                        }
                                        else if(child.content.replace(/(<([^>]+)>)/ig,'').indexOf('#')==0){
                                            result.tag.push(parent.attrs.target);
                                        }
                                    }
                                    var $html = includeTag(child, parent, userId);
                                    tag_stack.push({'name': 'result', 'content': $html});
                                    key=false;
                                    break;
                            }
                            cb();
                        },
                        function(err){
                            if(err)
                                return err;
                        }
                    );

                    break;
                case '(':
                    operator_stack.push(domElement);
                    break;
                default:
                    tag_stack.push(domElement);
                    break;
            }
            cb();
        },
        function(err){                       // Callback함수
            if(err){
                return err ;
            }
            result.content = pretty(tag_stack.pop().content.toString());
            result.mention = Array.from(new Set(result.mention));
            result.tag = Array.from(new Set(result.tag));
            console.log(result.content);
            console.log(result.mention);
            console.log(result.tag);
            callback(result);
        }
    );


};