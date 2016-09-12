import React from 'react'
import ReactDOM from 'react-dom'

//import MapStore from '../../stores/MapStore'
//import MapAction from '../../actions/MapAction'

class MainMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            latitude: "",
            longitude: "",
            initialZoom: 4,
            mapCenterLat: 30.04442,
            mapCenterLng: 31.235712,
            editionMode: true
        }
    }

    onChange(state) {
        this.setState(state)
    }

    componentDidMount() {
        console.log("MainMap componentDidMount()")

        // MapStore.listen(this.onChange.bind(this))
        // MapAction.fetchWrecksLightweight()
        this.prepareMapRender()


    }

    componentWillUnmount() {
        //MapStore.unlisten();
        console.log("MainMap componentWillUnmount()")
    }

    handleMarkerClick(id) {
        console.log("handle marker click: " + id)
        this.props.router.push('/wreck/' + id)
    }

    prepareMapRender() {

        var styleArray = [
            {
                featureType: "all",
                stylers: [
                    { saturation: -80 }
                ]
            },{
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                    { hue: "#00ffee" },
                    { saturation: 50 }
                ]
            },{
                featureType: "poi.business",
                elementType: "labels",
                stylers: [
                    { visibility: "off" }
                ]
            }
        ];

        var mapContainer = document.getElementById('map');
        var map = new google.maps.Map(mapContainer, {
            center: {lat: this.state.mapCenterLat, lng: this.state.mapCenterLng},
            streetViewControl: false,
            disableDefaultUI: true,
            zoom: this.state.initialZoom
        });

        google.maps.event.addListener(map, 'click', function(e) {
            if(this.state.editionMode) {
                this.placeMarker(e.latLng);
            }
        }.bind(this));

        map.setOptions({styles: styleArray });

        this.setState({map: map});
    }

    placeMarker(location) {

        if(this.state.selectCoordinatesMarker) {
            this.state.selectCoordinatesMarker.setMap(null)
        }

        let marker = new google.maps.Marker({
            position: location,
            map: this.state.map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
        });

        marker.addListener('click', () => this.handleNewMarkerClick(marker));

        this.setState({selectCoordinatesMarker: marker}, () => { console.log("calling setState in main map end") })

        var coordinates = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()}
        // MapAction.selectCoordinates(coordinates)
    }

    saveData() {
        console.log("save data");
    }

    handleNewMarkerClick(marker) {

        var contentString = "<input type='text' class='form-control' placeholder='hello' onchange='saveData()' />";

        let infowindow = new google.maps.InfoWindow({
            content: contentString
        });

        infowindow.open(map, marker);
    }

    drawMarkers(map) {

        if(this.props.viewer.wrecks) {
            this.props.viewer.wrecks.edges.map(function (element, id) {

                let elt = element.node

                console.log("draw marker")
                var myLatLng = {lat: elt.latitude, lng: elt.longitude};
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    title: elt.name
                });

                marker.addListener('click', function() {
                    map.setZoom(7);
                    map.setCenter(marker.getPosition());
                    this.handleMarkerClick(elt.wreckId)
                }.bind(this));

            }.bind(this))
        }
    }


    render() {

        this.drawMarkers(this.state.map);

        return  <div id="map"></div>
    }
}


export default MainMap
