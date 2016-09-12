import React from 'react'
import Relay from 'react-relay';

import PresentationComponent from '../wreck/WreckPresentation'
import WreckForm from '../wreck/WreckForm'
//import AdminStore from  '../stores/AdminStore'
//import AdminAction from  '../actions/AdminAction'

//import MapStore from  '../stores/MapStore'

class Admin extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            wreck: {imagePath: ""},
            wrecks: [],
            file : {},
            selectedCoordinates: {lat: "", lng: ""},
            status: "",
            wreckToEditId: ""
        };

        this.router = context.router
    }

    onWreckListClick(id, e) {

        e.preventDefault();
        this.router.push('/admin/wreck/edit/' + this.props.viewer.wrecks.edges[id].node.wreckId)
    }

    handleAddWreck(e) {
        e.preventDefault();
        this.router.push('/admin/wreck/create')
    }


    render() {

        let wrecks = this.props.viewer.wrecks;

        if(this.state.wreckToEditId == "") {
            let wrecksList = wrecks.edges.map(function(wreck, id) {
                return <a key={wreck.node.wreckId} href="#" className="list-group-item" onClick={this.onWreckListClick.bind(this, id)}>
                            <h4 className="list-group-item-heading">{wreck.node.name}</h4>
                            <img src={wreck.node.imagePath} className="img-thumbnail" alt={wreck.node.name} width="80" height="80"/>
                            <p className="list-group-item-text">{wreck.node.shortDescription}</p>
                       </a>
            }.bind(this));

            return  <div>
                        <div className="row">
                            <div className="col-md-2">
                                <h1>Wreck list</h1>
                            </div>
                            <div className="col-md-1">
                                <div className="pointer" onClick={this.handleAddWreck.bind(this)}>
                                    <i className="fa fa-2x fa-plus" aria-hidden="true" />
                                </div>
                            </div>
                        </div>

                        <div className="list-group">
                            {wrecksList}
                        </div>
                    </div>
        }
    }
}


Admin.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Relay.createContainer(Admin, {
    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
            wrecks(first: 100) {
              edges {
                node {
                  wreckId,
                  name,
                  imagePath,
                  shortDescription
                }
              }
            }
          }
        `
    }
});

