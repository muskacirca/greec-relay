import React from 'react'
import Relay from 'react-relay'

import AddOrUpdateWreckMutation from '../../mutations/AddOrUpdateWreckMutation'
import Alert from '../utils/Alert'

import sanitize from 'sanitize-filename';

import _ from 'lodash'

import ReactMarkdown from 'react-markdown'


class WreckForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            wreck: {description: ''},
            file: {},
            fileUri: "",
            editionMode: false,
            showForm: true
        }
    }

    onChangeInAdmin(state) {
        this.setState({wreck: state.wreck})
    }

    componentWillReceiveProps(nextprops) {
        this.setState({wreck: nextprops.viewer.wreck})
    }

    componentDidMount() {
        this.setState({wreck: this.props.viewer.wreck})
    }

    displayDate() {
        $('#datepicker').datepicker({
            viewMode: 'years',
            format: 'yyyy-MM-dd'
        });
    }

    updateAlert(message, type) {
        let alert = {message: message, type: type};
        this.setState({alert: alert})
    }

    computeAlerts() {
            return <Alert alert={this.state.alert}/>
    }

    submitForm(e) {

        e.preventDefault();

        let file = this.refs.fileInput.files.item(0);
        let imagePath = file
            ? "/images/" + sanitize(file.name.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''))
            : this.state.wreck.imagePath;

        const addOrUpdateWreckMutation = new AddOrUpdateWreckMutation({
            wreck: this.props.viewer.wreck,
            id: this.props.viewer.wreck.id,
            name: this.refs.name.value,
            file: file,
            shortDescription: this.refs.shortDescription.value,
            description: this.refs.description.value,
            sinkDate: this.refs.sinkDate.value,
            latitude: this.refs.latitude.value,
            longitude: this.refs.longitude.value,
            imagePath: imagePath
        });

        let onSuccess = (response) => {
            this.updateAlert("Wreck added successfully", "success");
        };

        let onFailure = (transaction) => {
            let error = transaction.getError() || new Error('Mutation failed.');
            this.updateAlert(error, "error");
        };

        Relay.Store.commitUpdate(addOrUpdateWreckMutation, {onSuccess, onFailure});

        //MapAction.toggleEditionMode()

        if(this.state.editionMode) {
            console.log("updating wreck in WreckForm")
            //AdminAction.updateWreck(wreck)
        } else {
            //AdminAction.createWreck({wreck: wreck, file: this.state.file})
        }
    }

    drawThumbnail(filePath) {

        var image = new Image();
        image.src = filePath;

        image.onload = function() {
            var maxWidth = 300,
                maxHeight = 300,
                imageWidth = image.width,
                imageHeight = image.height;


            if (imageWidth > imageHeight) {
                if (imageWidth > maxWidth) {
                    imageHeight *= maxWidth / imageWidth;
                    imageWidth = maxWidth;
                }
            }
            else {
                if (imageHeight > maxHeight) {
                    imageWidth *= maxHeight / imageHeight;
                    imageHeight = maxHeight;
                }
            }

            var canvas = document.createElement('canvas');
            canvas.width = imageWidth;
            canvas.height = imageHeight;
            image.width = imageWidth;
            image.height = imageHeight;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0, 0, imageWidth, imageHeight);

            document.getElementById('imagePreview').src = canvas.toDataURL();
        }
    }

    handleFile(e) {

        var file = this.refs.fileInput.files.item(0);
        var reader = new FileReader();

        reader.onload = function(event) {
            this.drawThumbnail(event.target.result, file);
        }.bind(this);

        this.setState({file: file});
        reader.readAsDataURL(file)
    }

    validateCoordinates(e) {
        var coordinate = e.target.value
    }

    selectCoordinate(e) {
        e.preventDefault()
        //MapAction.toggleEditionMode()
    }

    onFieldChange(field, e) {
        var newWreck = _.set(this.state.wreck, field, e.target.value)
        this.setState({wreck: newWreck})
    }

    computePageTitle() {
        return this.state.editionMode ? "Mise à jour de l'épave" : "Ajout d'une nouvelle épave"
    }

    render() {

        let wreck = this.state.wreck;

        let latitude = this.state.wreck.latitude;
        let longitude = this.state.wreck.longitude;
        if(this.props.selectedCoordinates) {
            console.log("not edition mode")
            latitude = this.props.selectedCoordinates.lat;
            longitude = this.props.selectedCoordinates.lng
        }

        let pageTitle = this.computePageTitle();
        let alerts = this.computeAlerts();
        this.drawThumbnail(this.state.wreck.imagePath);

        return  <div className="col-md-10 col-md-offset-1">
                    {alerts}
                    <h2>{pageTitle}</h2>
                    <br />
                    <div className="row">
                        <div className="col-md-6">
                            <form encType="multipart/form-data" method="post" className="form-horizontal" onSubmit={this.submitForm.bind(this)}>
                                <div className="form-group">
                                    <label htmlFor="nameWreckInput" className="col-md-2 control-label">Nom</label>
                                    <div className="col-md-10">
                                        <input id="nameWreckInput" ref="name" className="form-control"  placeholder="Nom"
                                               type="text" value={this.state.wreck.name} onChange={this.onFieldChange.bind(this, 'name')}/>
                                    </div>
                                </div>
                                <div className="form-group" >
                                    <label htmlFor="sinkDateWreckInput" className="col-md-2 control-label">Coulé le</label>
                                    <div className="col-md-10">
                                        <div className="input-group">
                                            <input id="sinkDateWreckInput" ref="sinkDate"type="text" className="form-control"
                                                   placeholder="22-07-1975" value={this.state.wreck.sinkDate}
                                                   onChange={this.onFieldChange.bind(this, "sinkDate")} />
                                                        <span className="input-group-btn">
                                                            <button className="btn btn-default" type="button">
                                                                <i className="fa fa-1x fa-calendar"></i>
                                                            </button>
                                                        </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="shortDescriptionWreckTextArea" className="col-md-2 control-label">Description courte</label>
                                    <div className="col-md-10">
                                        <input id="shortDescriptionWreckTextArea" ref="shortDescription" placeholder="Description courte"
                                               type="textarea"  className="form-control" value={this.state.wreck.shortDescription}
                                               onChange={this.onFieldChange.bind(this, "shortDescription")}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="descriptionWreckTextArea" className="col-md-2 control-label">Description</label>
                                    <div className="col-md-10">
                                            <textarea id="descriptionWreckTextArea" ref="description" placeholder="Description"
                                                      className="form-control" value={this.state.wreck.description}
                                                        onChange={this.onFieldChange.bind(this, 'description')} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gpsCoordinates" className="col-md-2 control-label">Coordonées GPS</label>

                                    <div className="col-md-10">
                                        <div className="form-inline">
                                            <div className="form-group">

                                                <label htmlFor="wreckLatitude" >Lat</label>
                                                <input id="wreckLatitude" ref="latitude" name="latitude"
                                                       type="text" className="form-control"
                                                       value={latitude}
                                                       onChange={this.validateCoordinates.bind(this)} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="wreckLongitude">Lng</label>
                                                <input id="wreckLongitude" ref="longitude" name="longitude"
                                                       type="text" className="form-control"
                                                       value={longitude}
                                                       onChange={this.validateCoordinates.bind(this)} />
                                            </div>
                                            <button id="selectCoordinate" ref="selectCoordinate" name="selectCoordinate"
                                                    className="btn btn-default" onClick={this.selectCoordinate.bind(this)}>
                                                Select coordinate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="imageInputFile" className="col-md-2 control-label">Image</label>
                                    <div className="col-md-5">
                                        <input ref="fileInput" type="file" name="uploadedFile" id="imageInputFile"
                                               onChange={this.handleFile.bind(this)} />
                                        <p className="help-block">Taille maximum: 160Ko</p>
                                    </div>
                                    <div className="col-md-4">
                                        <img id="imagePreview" />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-md-offset-2 col-md-10">
                                        <button type="submit" onClick={this.submitForm.bind(this)} className="btn btn-primary">
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-6">
                            <ReactMarkdown source={this.state.wreck.description} />
                        </div>

                    </div>
            </div>


    }
}

// <div className="col-md-3">
//     <label htmlFor="selectCoordinate" className="control-label">{' '}</label>
//     <button id="selectCoordinate" ref="selectCoordinate" name="selectCoordinate"
//             className="btn btn-default" onClick={this.selectCoordinate.bind(this)}>
//         Select coordinate
//     </button>
// </div>

export default Relay.createContainer(WreckForm, {

    initialVariables: {
        id: null
    },

    prepareVariables({ id }) {

        console.log("id in WreckForm : " + id)
        return {
            id: id
        }
    },
    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
            wreck(id: $id) {
              ${AddOrUpdateWreckMutation.getFragment('wreck')}
              wreckId,
              id,
              name,
              shortDescription,
              description,
              imagePath,
              latitude,
              longitude,
              sinkDate
            }
          }
       `
    }
})
