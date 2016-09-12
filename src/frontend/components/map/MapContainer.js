import React from 'react'
import GoogleApiComponent from 'google-maps-react'

import Map from './Map2'

export class Container extends React.Component {

    componentDidMount() {
        this.loadMap();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.google !== this.props.google) {
            this.loadMap();
        }
    }

    loadMap() {

        if (this.props && this.props.google) {
            // google is available
            const {google} = this.props;
            const maps = google.maps;

            const mapRef = this.refs.map;
            const node = ReactDOM.findDOMNode(mapRef);
        }
    }


    render() {

        if (!this.props.loaded) {
            return <div>Loading...</div>
        }

        const style = {
            width: '100vw',
            height: '100vh'
        }

        return (
            <div style={style}>
                <Map google={this.props.google} />
            </div>
        )
    }
}

export default GoogleApiComponent({
    apiKey: "AIzaSyAf67d67emXppB2zNEw2_KPIdzkY8Q1hiU&"
})(Container)
