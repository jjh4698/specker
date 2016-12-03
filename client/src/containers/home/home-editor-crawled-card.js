import React, { Component } from 'react';
import { EditorState,getDefaultKeyBinding, KeyBindingUtil,
    Modifier,RichUtils,  DefaultDraftBlockRenderMap,SelectionState,
    EditorBlock, AtomicBlockUtils, Entity,convertToRaw, convertFromRaw,ContentState,
} from 'draft-js';

import Card from 'react-material-card';
class CrawledCard extends React.Component {
    constructor(props) {
        super(props);

        this.onDelete = this.onDelete.bind(this);
        this.toSite = this.toSite.bind(this);
    }

    toSite(){
         window.open(this.props.url,'_blank')
    }
    onDelete(){
        var contentState = this.props.editorState.getCurrentContent();
        var convertState = convertToRaw(contentState);
        var contentKey = this.props.block.getKey();
        var selection = this.props.editorState.getSelection();

        for(var i=0; i<convertState.blocks.length; i++){
            if(convertState.blocks[i].key==contentKey){
                convertState.blocks.splice(i,1);
                break;
            }
        }

        let newContentState = convertFromRaw(convertState);
        var newState = EditorState.push(this.props.editorState, newContentState, null);
        this.props.onChange(
            EditorState.forceSelection(
                newState,selection)
        );

    }



    render() {
        console.log(this.props);
        return (
            <div className={'block-card-completed'}>
                <a onClick={this.onDelete} className="editor-crawled-card-close">X</a>
                <Card
                    onClick={this.toSite}
                    className="row editor-crawled-card"
                    onOver={c => c.setLevel(3)}
                    onOut={c => c.setLevel(2)}
                    onFocus={c => c.setLevel(4)}>

                        <img className="col-xs-4 editor-crawled-image" src={this.props.image} alt=""/>
                    <div className="col-xs-8">
                        <h4>
                            {this.props.title}
                        </h4>
                        <p>
                            {this.props.description}
                        </p>

                        <a src={this.props.url} >
                            {this.props.url}
                        </a>
                    </div>

                </Card>


            </div>
        );


    }
}

export default CrawledCard;