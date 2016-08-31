import React from 'react'
import Relay from 'react-relay'

import AddOrUpdateWreckMutation from '../../mutations/AddOrUpdateWreckMutation'

import _ from 'lodash'

import ReactMarkdown from 'react-markdown'


class WreckForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            wreck: {},
            file: {},
            fileUri: "",
            editionMode: false,
            status: ""
        }
    }

    onChangeInAdmin(state) {
        console.log("on change in wreckForm : " + JSON.stringify(state))
        this.setState({wreck: state.wreck})
    }

    componentDidMount() {

    }

    componentWillMount() {
        //console.log("WreckForm componentWillMount(). params.id : " + this.props.params.id + ", state wreck: " + JSON.stringify(this.state.wreck))
        //console.log("yooo: " + JSON.stringify(this.props))
        //if(this.props.params.id) this.setState({editionMode: true})
        //this.setState({wreck: this.props.location.state.wreck})
    }

    displayDate() {
        $('#datepicker').datepicker({
            viewMode: 'years',
            format: 'yyyy-MM-dd'
        });
    }

    updateAlert(message, type) {
        let alert = {message: message, type: type}
        this.setState({alert: alert})
    }

    submitForm(e) {

        console.log("hello");

        e.preventDefault();

        console.log("this.refs.fileInput.files.item(0) : " + JSON.stringify(this.refs.fileInput.files.item(0)));

        var addOrUpdateWreckMutation = new AddOrUpdateWreckMutation({
            wreck: this.props.viewer.wreck,
            id: this.props.viewer.wreck.id,
            name: this.refs.name.value,
            file: this.refs.fileInput.files.item(0),
            shortDescription: this.refs.shortDescription.value,
            description: this.refs.description.value,
            sinkDate: this.refs.sinkDate.value,
            latitude: this.refs.latitude.value,
            longitude: this.refs.longitude.value
        });

        var onSuccess = (response) => {
            console.log("response : " + JSON.stringify(response));
            this.updateAlert("Wreck added successfully", "success");
        }

        var onFailure = (transaction) => {
            let error = transaction.getError() || new Error('Mutation failed.');
            console.log("wreckform mutation error ...: " );
            this.updateAlert(error, "error");
        }

        Relay.Store.commitUpdate(addOrUpdateWreckMutation, {onSuccess, onFailure});

        //MapAction.toggleEditionMode()

        if(this.state.editionMode) {
            console.log("updating wreck in WreckForm")
            //AdminAction.updateWreck(wreck)
        } else {
            //AdminAction.createWreck({wreck: wreck, file: this.state.file})
        }
    }

    handleFile(e) {

        var file = this.refs.fileInput.files.item(0);
        // var file = e.target.value.split(/(\\|\/)/g).pop()
        var file2 = e.target.files[0]

        var reader = new FileReader();

        reader.onload = function(event) {

            var image = new Image();
            image.src = event.target.result;

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

                document.getElementById('imagePreview').src = canvas.toDataURL(file.type);

            }

        }

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

    computeAlerts() {

        if(this.state.status != "") {
            return <div class="panel panel-default">
                        <div class="panel-body">
                            Panel content
                        </div>
                        <div class="panel-footer">Panel footer</div>
                    </div>
        }
    }

    componentWillReceiveProps(nextprops) {

        console.log("componentWillReceiveProps WreckForm : " + nextprops)
        this.setState({wreck: nextprops.viewer.wreck})

    }

    componentDidMount() {

        console.log("componentWillMount WreckForm :" + this.props.viewer)
        this.setState({wreck: this.props.viewer.wreck})
    }

    render() {

        var wreck = this.state.wreck

        var latitude = this.state.wreck.latitude
        var longitude = this.state.wreck.longitude
        if(this.props.selectedCoordinates) {
            console.log("not edition mode")
            latitude = this.props.selectedCoordinates.lat
            longitude = this.props.selectedCoordinates.lng
        }

        var pageTitle = this.computePageTitle()
        var alerts = this.computeAlerts()

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
                                    <label htmlFor="imageInputFile" className="col-md-2 control-label">Image</label>
                                    <div className="col-md-3">
                                        <input ref="fileInput" type="file" name="uploadedFile" id="imageInputFile"
                                               onChange={this.handleFile.bind(this)} />
                                        <p className="help-block">Taille maximum: 160Ko</p>
                                    </div>
                                    <div className="col-md-6">

                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="gpsCoordinates" className="col-md-2 control-label">Coordonées GPS</label>
                                    <div className="form-inline">
                                        <div className="form-group col-md-3">
                                            <label htmlFor="selectCoordinate" className="control-label">{' '}</label>
                                            <button id="selectCoordinate" ref="selectCoordinate" name="selectCoordinate"
                                                    className="btn btn-default" onClick={this.selectCoordinate.bind(this)}>
                                                Select coordinate
                                            </button>
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="wreckLatitude" className="control-label">Latitude</label>{' '}
                                            <input id="wreckLatitude" ref="latitude" name="latitude"
                                                   type="text" className="form-control"
                                                   value={latitude}
                                                   onChange={this.validateCoordinates.bind(this)} />
                                        </div>
                                        <div className="form-group col-md-4">
                                            <label htmlFor="wreckLongitude" className="control-label">Longitude</label>{' '}
                                            <input id="wreckLongitude" ref="longitude" name="longitude"
                                                   type="text" className="form-control"
                                                   value={longitude}
                                                   onChange={this.validateCoordinates.bind(this)} />
                                        </div>
                                    </div>

                                    <div className="col-md-6">

                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-md-offset-2 col-md-10">
                                        <button type="submit" onCLick={this.submitForm.bind(this)}className="btn btn-primary">Submit</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-6">
                            <ReactMarkdown source={this.state.wreck.description} />
                        </div>

                    </div>
                    <div>
                        <img id="imagePreview" src={wreck.imagePath}/>
                    </div>
            </div>


    }
}

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
