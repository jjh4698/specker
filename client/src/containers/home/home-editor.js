import React, { Component } from 'react';
import { EditorState,getDefaultKeyBinding, KeyBindingUtil,
    Modifier, RichUtils,  DefaultDraftBlockRenderMap,SelectionState,
    EditorBlock, AtomicBlockUtils, Entity,convertToRaw, convertFromRaw,ContentState,
} from 'draft-js';
import { saveFeed } from '../../actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Card from 'react-material-card';
import Editor from 'draft-js-plugins-editor'; // eslint-disable-line import/no-unresolved
import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin'; // eslint-disable-line import/no-unresolved
import { fromJS, Map } from 'immutable';
import editorStyles from 'draft-js-mention-plugin/lib/plugin.css';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createEmojiPlugin from 'draft-js-emoji-plugin';
import FileInput from 'react-file-input';

import ImageComponent from './home-editor-image';
import axios from 'axios';
import CrawledCard from './home-editor-crawled-card';
import 'draft-js-emoji-plugin/lib/plugin.css';
import {
    getSelectionRange,
    getSelectedBlockElement,
    getSelectionCoords
} from '../launch/util/selection';

import { SERVER_URL, UTIL_SERVER_URL } from '../../../config'



// Include 'paragraph' as a valid block and updated the unstyled element but
// keep support for other draft default block types




const PersonMentions = fromJS([
    {
        name: 'matthew',
        title: 'Senior Software Engineer',
        avatar: 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
        _id:'57237ae7fabf6f5125bab22d'
    },
    {
        name: 'julian',
        title: 'United Kingdom',
        avatar: 'https://pbs.twimg.com/profile_images/477132877763579904/m5bFc8LF_400x400.png',
        _id:'574e24e7fabf6f5125bab22d'
    },
    {
        name: 'jyoti',
        title: 'New Delhi, India',
        avatar: 'https://pbs.twimg.com/profile_images/705714058939359233/IaJoIa78_400x400.jpg',
        _id:'574e8ae7fabf6f5125bab32d'
    },

]);
const TagMentions = fromJS([

]);
const PersonMentionPlugin = createMentionPlugin({
    PersonMentions,
    entityMutability: 'IMMUTABLE',
    mentionPrefix: '@',
    mentionTrigger:'@',
    mentionComponent:(props) => (
        <span
            className={props.className}
            target={props.mention._root.entries[3][1]}
            // eslint-disable-next-line no-alert
            onClick={() => console.log(props.mention._root.entries[3][1])}
        >
      @{props.decoratedText}
    </span>
    ),
});
const TagMentionPlugin = createMentionPlugin({
    TagMentions,
    entityMutability: 'IMMUTABLE',
    mentionPrefix: '#',
    mentionTrigger:'#',
    mentionRegExp:'(.*)',
    mentionComponent:(props) => (
        <span
            className={props.className}
            target={props.mention._root.entries[3][1]}
            // eslint-disable-next-line no-alert
            onClick={() => console.log(props.mention._root.entries[3][1])}
        >
      #{props.decoratedText}
    </span>
    ),
});

const PersonEntry = (props) => {
    const {
        mention,
        theme,
        searchValue, // eslint-disable-line no-unused-vars
        ...parentProps
    } = props;

    return (
        <div {...parentProps}>
            <div className="mentionSuggestionsEntryContainer">
                <div className="mentionSuggestionsEntryContainerLeft">
                    <img
                        className="mentionSuggestionsEntryAvatar"
                        src={mention.get('avatar')}
                        role="presentation"
                    />
                </div>

                <div className="mentionSuggestionsEntryContainerRight">
                    <div className="mentionSuggestionsEntryText">
                        {mention.get('name')}
                    </div>

                    <div className="mentionSuggestionsEntryTitle">
                        {mention.get('title')}
                    </div>
                </div>
            </div>
        </div>
    );
};
const TagEntry = (props) => {
    const {
        mention,
        theme,
        searchValue, // eslint-disable-line no-unused-vars
        ...parentProps
    } = props;
    console.log(mention);
    return (
        <div {...parentProps}>
            <div className="mentionSuggestionsEntryContainer">
                <div className="mentionSuggestionsEntryContainerLeft">
                    <img
                        className="mentionSuggestionsEntryAvatar"
                        src={mention.get('avatar')}
                        role="presentation"
                    />
                </div>

                <div className="mentionSuggestionsEntryContainerRight">
                    <div className="mentionSuggestionsEntryText">
                        {mention.get('name')}
                    </div>

                    <div className="mentionSuggestionsEntryTitle">
                        {mention.get('like')}명이 관심을 가지고 있습니다.
                    </div>
                </div>
            </div>
        </div>
    );
};

const { MentionSuggestions } = PersonMentionPlugin;
const TagMentionSuggestions = TagMentionPlugin.MentionSuggestions;

const linkifyPlugin = createLinkifyPlugin({
    component: (props) => (
        // eslint-disable-next-line no-alert, jsx-a11y/anchor-has-content
        <a {...props} onClick={() => window.open(props.href,'_blank')} />
    )
});
const emojiPlugin = createEmojiPlugin({
});
const { EmojiSuggestions } = emojiPlugin;


const plugins = [PersonMentionPlugin, TagMentionPlugin, linkifyPlugin, emojiPlugin];
const patterns = {
    // FUCK THESE 3 w's! >:(
    protocol: '^(http(s)?(:\/\/))?(www\.)?',
    domain: '[a-zA-Z0-9-_\.]+',
    tld: '(\.[a-zA-Z0-9]{2,})',
    params: '([-a-zA-Z0-9:%_\+.~#?&//=]*)'
};




function mediaBlockRenderer(block) {

    console.log(block.getType());
    if (block.getType() === 'atomic') {
        switch(Entity.get(block.getEntityAt(0)).getType()){
            case "image":
                return {
                    component: ImageComponent
                };
            default:
                return {
                    component: Media,
                    props: {
                        onChange: this.onChange,
                        editorState: this.state.editorState,
                        block,
                    }


                };

        }

    }
    return null;
}

const Media = (props) => {
    const entity = Entity.get(props.block.getEntityAt(0));
    const data = entity.getData();
    console.log(props);

    return <CrawledCard block={props.blockProps.block}
                        editorState={props.blockProps.editorState}
                        onChange={props.blockProps.onChange}
                        image={data.image}
                        author={data.author}
                        description={data.description}
                        url={data.url}
                        title={data.title}/>;
};
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
    },
};

const styles = {
    root: {
        fontFamily: '\'Helvetica\', sans-serif',
        padding: 20
    },
    editor: {
        border: '1px solid #ccc',
        cursor: 'text',
        minHeight: 90,
        padding: 10,
    },
    button: {
        marginTop: 10,
        textAlign: 'center',
    },
    bold:{
        fontWeight:'bold !important'
    },
    italic:{
        fontStyle:'italic !important'
    },
    underline:{
        textDecoration: 'underline !important'
    },
    monospace:{
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace !important',
    },
    postBtn:{
        textDecoration: 'none !important'
    }


};

class HomeEditor extends Component {


    constructor(props){
        super(props);
        this.state = {
            editorState: EditorState.createEmpty(),
            personSuggestions: PersonMentions,
            tagSuggestions: TagMentions,
            url: '',
            urlType: '',
            readOnly:false,
        };

        this.confirmMedia = this._confirmMedia.bind(this);
        this.handleKeyCommand = this._handleKeyCommand.bind(this);
        this.onTab = (e) => this._onTab(e);
        this.updateSelection = () => this._updateSelection();
        this.toggleInlineStyle = (style) => this._toggleInlineStyle(style);
        this.handleFileInput = (e) => this._handleFileInput(e);
        this.handleUploadImage = () => this._handleUploadImage();
        this.insertImage = (file) => this._insertImage(file);
        this.readFile = this.readFile.bind(this);
        this.blockRenderMap = Map({
            person: {
                element: 'span',
            },
            tag: {
                element: 'span',
            },
            link: {
                element: 'div',
            },
            emoji: {
                element: 'div',
            },

        },()=>{
            console.log("here?");
        }).merge(DefaultDraftBlockRenderMap);

    }



    _handleUploadImage() {
        this.refs.fileInput.click();
    }
    readFile(file, onLoadCallback){
        var reader = new FileReader();
        reader.onload = onLoadCallback;
        reader.readAsDataURL(file);
    }

    _insertImage(file) {
        const {editorState} = this.state;
        const onChange = this.onChange;
        console.log(file.name);
        console.log(file.size);
        console.log(file.type);
        var reader = new FileReader();
        var imageType = /image.*/;
        if (file.type.match(imageType)) {
            this.readFile(file, function (e) {
                // use result in callback...
                console.log("hello!");
                console.log(e.target.result);

                const entityKey = Entity.create('image', 'IMMUTABLE',
                    {
                        srcType: file.type,
                        srcFile: e.target.result,
                        srcSize: file.size,
                        src: window.URL.createObjectURL(file)
                    });
                onChange(AtomicBlockUtils.insertAtomicBlock(
                    editorState,
                    entityKey,
                    ' '
                ));

            });

        }
    }



    _updateSelection() {
        const selectionRange = getSelectionRange();
        let selectedBlock;
        if (selectionRange) {
            selectedBlock = getSelectedBlockElement(selectionRange);
        }
        this.setState({
            selectedBlock,
            selectionRange
        });
    }

    _handleFileInput(e) {
        const fileList = e.target.files;
        const file = fileList[0];
        this.insertImage(file);
    }
    _onTab(e) {
        const maxDepth = 4;
        this.onChange(RichUtils.onTab(e, this.state.editorState, maxDepth));
    }


    _toggleInlineStyle(inlineStyle) {
        this.onChange(
            RichUtils.toggleInlineStyle(
                this.state.editorState,
                inlineStyle
            )
        );
    }

    _confirmMedia(data) {

        const {editorState} = this.state;
        const entityKey = Entity.create(
            'crawl',
            'IMMUTABLE',
            data);

        const lastState =   AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' '
        );
        this.setState({
                editorState:EditorState.forceSelection(
                    lastState
                    ,lastState.getCurrentContent().getSelectionAfter())
            }
        )


    }



    myKeyBindingFn(e) {

        if (e.keyCode === 13) {
            var p = patterns;
            var pattern = new RegExp(p.protocol + p.domain + p.tld + p.params, 'gi');
            const contentState = this.state.editorState.getCurrentContent();
            const selectionState = this.state.editorState.getSelection();
            const key = selectionState.getStartKey();
            const blockMap = contentState.getBlockMap();
            const block = blockMap.get(key);
            var url = block.getText();

            var res = pattern.test(url);

            if(res==true) {


                var data = new FormData();
                data.append("url", url);
                axios.post(`${UTIL_SERVER_URL}`,data,{
                    'content-type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }).then(response => {

                    if(response.data.image==""&&response.data.site_name==""&&response.data.title==""){
                        return getDefaultKeyBinding(e);
                    }
                    else{
                        this.confirmMedia(response.data);
                    }
                    return 'thumbnail';
                }).catch(response => {
                    console.log("nb",response);
                });
            }
        }
        return getDefaultKeyBinding(e);
    }

    onChange = (editorState) => {


        this.setState({ editorState });
        setTimeout(this.updateSelection, 0);

    };

    onPersonSearchChange = ({ value }) => {
        console.log(this.state.personSuggestions);
        console.log(value);

        this.setState({
            personSuggestions: defaultSuggestionsFilter(value, PersonMentions),
        });
    };

    onTagSearchChange = ({ value }) => {
        console.log(value);
        require('whatwg-fetch');
        fetch(SERVER_URL+'/getSpec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                keyword: value
            })
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    tagSuggestions: fromJS(data),
                });
                console.log(data);
            });

    };



    focus = () => {
        this.editor.focus();
    };
    _handleKeyCommand(command) {
        const {editorState} = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        if (newState) {
            this.onChange(newState);
            return true;
        }
        return false;
    }
    post(){
        console.log(convertToRaw(this.state.editorState.getCurrentContent()));
        let rawHtmlArray = convertToRaw(this.state.editorState.getCurrentContent()).blocks;
        var checked = false;
        for(let i=0; i<rawHtmlArray.length; i++){
            console.log(rawHtmlArray[i].text.trim());
            if(rawHtmlArray[i].text.trim()!=""){
                checked=true;
            }
        }
        if(!checked){
            alert("내용을 입력해 주세요.");
        }
        else {
            if(confirm('글을 등록 하시겠습니까?')){
                var markup = document.documentElement.getElementsByClassName('DraftEditor-editorContainer')[0];
                this.props.saveFeed(markup);
                // this.setState({editorState:EditorState.createEmpty()});
                const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
                this.setState({editorState})
            }



        }

    }
    render() {
        const {editorState} = this.state;
        let className = 'RichEditor-editor';
        var contentState = editorState.getCurrentContent();
        if (!contentState.hasText()) {
            if (contentState.getBlockMap().first().getType() !== 'unstyled') {
                className += ' RichEditor-hidePlaceholder';
            }
        }
        return (

            <div>
                <Card className="row graphFeed"
                      onOver={card => card.setLevel(2)}
                      onOut={card => card.setLevel(1)}
                      key={-1}>

                        <div style={styles.editor} className={editorStyles.editor} onClick={this.focus}>
                            <Editor
                                readOnly = {this.state.readOnly}
                                editorState={this.state.editorState}
                                onChange={this.onChange}
                                plugins={plugins}
                                blockRenderMap={this.blockRenderMap}
                                handleKeyCommand={this.handleKeyCommand}
                                keyBindingFn={this.myKeyBindingFn.bind(this)}
                                blockRendererFn={mediaBlockRenderer.bind(this)}
                                customStyleMap={styleMap}
                                onTab={this.onTab}
                                ref={(element) => { this.editor = element; }}
                            />
                            <EmojiSuggestions />
                            <MentionSuggestions
                                onSearchChange={this.onPersonSearchChange}
                                suggestions={this.state.personSuggestions}
                                entryComponent={PersonEntry}
                            />
                            <TagMentionSuggestions
                                onSearchChange={this.onTagSearchChange}
                                suggestions={this.state.tagSuggestions}
                                entryComponent={TagEntry}
                            />

                    </div>
                </Card>

                <InlineStyleControls
                    onPost={this.post.bind(this)}
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                    onUploadImage = {this.handleUploadImage}
                />

                <input type="file" ref="fileInput" style={{display: 'none'}}
                       onChange={this.handleFileInput} />


            </div>

        );
    }
}
class StyleButton extends React.Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        let className = 'RichEditor-styleButton';
        if (this.props.active) {
            className += ' RichEditor-activeButton';
        }
        let style = '';
        switch (this.props.label){
            case 'B':
                style = styles.bold;
                break;
            case 'I':
                style = styles.italic;
                break;
            case 'U':
                style = styles.underline;
                break;
            case 'M':
                style = styles.monospace;
                break;
        }

        return (
            <span style = {styles.button} className={className} onMouseDown={this.onToggle}>
                <div style= {style}>
                    {this.props.label}
                </div>
            </span>
        );
    }
}



var INLINE_STYLES = [
    {label: 'B', style: 'BOLD'},
    {label: 'I', style: 'ITALIC'},
    {label: 'U', style: 'UNDERLINE'},
    {label: 'M', style: 'CODE'},
];

const InlineStyleControls = (props) => {
    var currentStyle = props.editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
               <span className="RichEditor-styleButton" style={styles.button} onClick={props.onUploadImage}>
                    <div style={styles.postBtn}>
                         파일
                    </div>
            </span>
            {INLINE_STYLES.map(type =>
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    onToggle={props.onToggle}
                    style={type.style}
                />
            )}
            <span className="RichEditor-styleButton" style={styles.button} onClick={props.onPost}>
                    <div style={styles.postBtn}>
                        올리기
                    </div>
            </span>




        </div>
    );
};

function mapDispatchToProps(dispatch){
    return bindActionCreators({saveFeed }, dispatch);
}

var Base64 = {

    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for encoding
    encode : function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

        }

        return output;
    },

    // public method for decoding
    decode : function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }

        }

        output = Base64._utf8_decode(output);

        return output;

    },

    // private method for UTF-8 encoding
    _utf8_encode : function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);

            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            }
            else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        }

        return string;
    }

}


export default connect(null, mapDispatchToProps)(HomeEditor);
