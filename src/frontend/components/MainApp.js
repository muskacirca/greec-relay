import React from 'react'
import Relay from 'react-relay'

import Map from './map/Map'

import Navbar from './navbar'
import MapToolbox from './map/MapToolbox'

class MainApp extends React.Component {

    constructor(props, context) {
        super(props, context);
        this.router = context.router
    }

    render() {


        console.log("Mainapp render")
        const { viewer, children} = this.props;

        return  <div id="main" data-framework="relay">
                    <Navbar />
                    <div id="wrapper">
                        <div id="map-container" className="collapse in">
                            <Map router={this.router} viewer={viewer}/>
                        </div>
                        <MapToolbox />
                        <div id="data-container" className="container-fluid">
                            {children}
                        </div>
                    </div>
                </div>
    }
}

MainApp.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default Relay.createContainer(MainApp, {
    fragments: {
        viewer: () => Relay.QL`
           fragment on Viewer {
           
            wrecks(first: 100) {
              edges {
                node {
                  wreckId,
                  name,
                  latitude,
                  longitude
                }
              }
            }
          }
        `
    }
})
