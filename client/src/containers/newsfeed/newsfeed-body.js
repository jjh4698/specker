import React, { Component } from 'react';
import MasonryInfiniteScroller from 'react-masonry-infinite';
import qwest from 'qwest';
import Card from 'react-material-card';

const api = {
    baseUrl: 'https://api.soundcloud.com',
    client_id: 'caf73ef1e709f839664ab82bef40fa96'
};
// const sizes = [
//     { columns: 3, gutter: 15 },
//     { mq: '768px', columns: 3, gutter: 25 },
//     { mq: '1024px', columns: 4, gutter: 35 }
// ];
const sizes = ()=> {
    let size=[];
    size.push({columns:3, gutter:10});
    for(var i=0; i<30; i++){
        if(i<=20)
        size.push({mq:50*i+'px', columns:3, gutter:10+i});
        else
            size.push({mq:50*i+'px', columns:4, gutter:10+i/2});
    }
    return size;
};



class NewsfeedBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tracks: [],
            hasMoreItems: true,
            nextHref: null
        };

    }

    loadItems(page) {
        var self = this;

        var url = api.baseUrl + '/users/8665091/favorites';
        if(this.state.nextHref) {
            url = this.state.nextHref;
        }

        qwest.get(url, {
            client_id: api.client_id,
            linked_partitioning: 1,
            page_size: 10
        }, {
            cache: true
        })
            .then(function(xhr, resp) {
                if(resp) {
                    var tracks = self.state.tracks;
                    resp.collection.map((track) => {
                        if(track.artwork_url == null) {
                            track.artwork_url = track.user.avatar_url;
                        }

                        tracks.push(track);
                    });

                    if(resp.next_href) {
                        self.setState({
                            tracks: tracks,
                            nextHref: resp.next_href
                        });
                    } else {
                        self.setState({
                            hasMoreItems: false
                        });
                    }
                }
            });
    }



    render() {
        const loader = <img src="../../../style/image/loader.gif" width="20%" height="auto" className="loader" />;

        var items = [];
        this.state.tracks.map((track, i) => {
            items.push(

                <Card className="feedCard"
                      onOver={card => card.setLevel(2)}
                      onOut={card => card.setLevel(1)}
                      key={i}>
                    <a href={track.permalink_url} target="_blank">
                        <h1>제목{i}</h1>
                        <p className="title">{track.title}</p>
                    </a>
                </Card>
            );
        });

        return (
                <div className="newsfeedBody">
                    <MasonryInfiniteScroller    pageStart={0}
                                                loadMore={this.loadItems.bind(this)}
                                                hasMore={this.state.hasMoreItems}
                                                loader={loader}
                                                sizes={sizes()}
                                                position={false}
                                                style={{width:'100% !important', margin:'0 0 15% 0 !important'}}>

                        {/*<div className="feedItem">*/}
                        {items}

                    </MasonryInfiniteScroller>
                </div>
        )
    }
}
export default NewsfeedBody;

