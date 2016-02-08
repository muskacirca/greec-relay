import React from 'react'
import Relay from 'react-relay'

class PresentationComponent extends React.Component {

    constructor(props) {
        super(props)
    }

    getThumbnail(src) {

        var dot = src.indexOf(".jpeg")
        var name = src.substring(0, dot)
        var extension = src.substring(dot)

        var suffix = "";
        return name + suffix +  extension
    }

    render() {

        console.log("wreck in PresentationComponent ")
        var wreck = this.props.wreck

        var thumbnailPath = this.getThumbnail(wreck.imagePath)

        return  <div  data-framework="relay">
                  <div className="media">
                      <div className="media-left">
                          <img className="media-object img-thumbnail" src={thumbnailPath} alt={wreck.name} />
                      </div>
                      <div className="media-body">

                          <h1 className="media-heading">{wreck.name}</h1>
                          <div>
                              <ul className="nav nav-tabs">
                                  <li role="presentation" className="active"><a href="#">Présentation</a></li>
                                  <li role="presentation"><a href="#">Sites de plongées</a></li>
                                  <li role="presentation"><a href="#">Media</a></li>
                              </ul>
                          </div>
                          <div className="presentation-body">
                              <p className="lead">{wreck.shortDescription}</p>
                              <p>{wreck.description}</p>
                          </div>

                      </div>
                  </div>
              </div>
    }
}

export default PresentationComponent
