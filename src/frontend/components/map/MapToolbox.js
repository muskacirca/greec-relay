import React from 'react'

class MapToolbox extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            isMapExpanded: true
        }
    }

    toggleMapExpansion() {
        this.setState({isMapExpanded: !this.state.isMapExpanded})
    }

    render() {

        var expandButtonClass = this.state.isMapExpanded ? "fa fa-chevron-up" : "fa fa-globe"

        return  <div className="map-toolbox">
                    <button className="btn btn-default" onClick={this.toggleMapExpansion.bind(this)}
                            data-toggle="collapse" data-target="#map-container" aria-expanded="true"
                            aria-controls="map-container">
                        <i className={expandButtonClass} />
                    </button>
                </div>

    }
}

export default MapToolbox
