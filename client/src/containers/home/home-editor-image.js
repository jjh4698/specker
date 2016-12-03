import React from 'react';
import { Entity } from 'draft-js';


export default ({ block }) => {
    const imgContent = Entity.get(block.getEntityAt(0)).data.src;
    const imgSize = Entity.get(block.getEntityAt(0)).data.srcSize;
    const imgFile = Entity.get(block.getEntityAt(0)).data.srcFile;
    const imgType = Entity.get(block.getEntityAt(0)).data.srcType;
    console.log(imgSize);
    console.log(imgFile);
    console.log(imgType);
    console.log( Entity.get(block.getEntityAt(0)).data);
    return <img className="editor-image" src={imgContent} itemProp={imgFile}  itemType = {imgType}  />;
};
