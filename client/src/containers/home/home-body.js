import React, { Component } from 'react';
import MasonryInfiniteScroller from 'react-masonry-infinite';
import qwest from 'qwest';
import Card from 'react-material-card';
import HomeEditor from './home-editor';
import Parser from 'html-react-parser';

import { SERVER_URL } from '../../../config';

var first_remove = true;

const sizes = ()=> {
    let size=[];
    size.push({columns:1, gutter:10});
    for(var i=0; i<30; i++){
        size.push({mq:50*i+'px', columns:1, gutter:10+i});
    }
    return size;
};




class HomeBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tracks: [],
            hasMoreItems: true,
            nextIndex: ''
        };

    }


    loadItems(page) {
        if(first_remove) {
            first_remove = false;
        }
        else{
            require('whatwg-fetch');
            var self = this;

            var nextIndex = this.state.nextIndex;

            fetch(`${SERVER_URL}/getHomeFeed`, {
                method: 'POST',
                headers: {
                    'Cahce-Control':"only-if-cached",
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    nextIndex
                })
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.nextIndex) {
                        self.setState({
                            hasMoreItems: false
                        });
                    }
                    else {
                        var tracks = self.state.tracks;
                        data.data.map((data)=> {
                            tracks.push(data);
                        });
                        self.setState({
                            tracks: tracks,
                            nextIndex: data.nextIndex
                        });
                    }

                })
                .catch(response => {
                    console.log("nb", response);

                });
        }
    }



    render() {
        const loader = <img src="../../../style/image/loader.gif" width="20%" height="auto" className="loader" />;
        const {editorState} = this.state;

        var items = [];
        this.state.tracks.map((track, i) => {
            console.log(track);
            items.push(
                <div className="homeCard row">
                    <div className="thumb">
                        <img src="http://lorempixel.com/400/800" alt="" />
                    </div>
                    <Card
                        onOver={card => card.setLevel(2)}
                        onOut={card => card.setLevel(1)}
                        key={i}>
                        {Parser(track.content)}
                        <a href={track.permalink_url} target="_blank">
                            <img width="100%" height="auto" src={track.artwork_url}  />
                            <p className="title">{track.title}</p>
                        </a>

                    </Card>
                </div>
            );
        });

        return (
            <div className="homeBody">

                <div className="thumb myThumb">
                    <img src={this.state.tracks.artwork_url? this.state.tracks[0].artwork_url:""} alt="" />
                </div>
                <HomeEditor />


                <MasonryInfiniteScroller    pageStart={0}
                                            loadMore={this.loadItems.bind(this)}
                                            hasMore={this.state.hasMoreItems}
                                            loader={loader}
                                            sizes={sizes()}
                                            style={{ width:'100% !important', margin:'0 0 15% 0 !important'}}>


                    {items}


                </MasonryInfiniteScroller>
            </div>
        )
    }
}
export default HomeBody;

