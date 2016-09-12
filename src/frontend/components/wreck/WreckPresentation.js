import React from 'react'
import Relay from 'react-relay'
import ReactMarkdown from 'react-markdown'

import Lightbox from 'react-images'

class PresentationComponent extends React.Component {

    constructor(props) {
        
        super(props);

        this.state = {
            lightboxIsOpen: false
        };
    }

    getThumbnail(src) {

        var dot = src.indexOf(".jpeg")
        var name = src.substring(0, dot)
        var extension = src.substring(dot)

        var suffix = "";
        return name + suffix +  extension
    }

    gotoPrevLightboxImage() {

    }


    gotoNextLightboxImage() {

    }

    toggleLightBox() {
        this.setState({lightboxIsOpen: !this.state.lightboxIsOpen})
    }

    renderPhotoGallery(images) {

        let imageList = [{src: images}];

        return  <Lightbox images={imageList}
                        isOpen={this.state.lightboxIsOpen}
                        onClickPrev={this.gotoPrevLightboxImage.bind(this)}
                        onClickNext={this.gotoNextLightboxImage.bind(this)}
                        onClose={this.toggleLightBox.bind(this)} />
    }
    

    render() {

        console.log("wreck in PresentationComponent ")
        var wreck = this.props.wreck

        var thumbnailPath = this.getThumbnail(wreck.imagePath);

        let gallery = this.renderPhotoGallery(wreck.imagePath)

        return  <div  data-framework="relay">
                    {gallery}
                  <div className="media">
                      <div className="pointer media-left" onClick={this.toggleLightBox.bind(this)}>
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
                              <ReactMarkdown source={wreck.description} />
                          </div>

                      </div>
                  </div>
              </div>
    }
}

export default PresentationComponent
