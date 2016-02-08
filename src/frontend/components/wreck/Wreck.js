import React from 'react'
import Relay from 'react-relay'

import PresentationComponent from './WreckPresentation'
//import WreckAction from  '../../actions/WreckAction'
//import WreckStore from  '../../stores/WreckStore'

class Wreck extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            wreck: {imagePath: ""},
            isLoading: false
        }
    }

    onChange(state) {
        this.setState(state)
    }

    componentDidMount() {
        //WreckStore.listen(this.onChange.bind(this))

        //var id = this.props.params.id
        //if(id == null) id = "1"
        //
        //if(id != this.state.wreck.id) {
        //    // WreckAction.fetchWreck(id)
        //}
    }

    componentWillUnmount() {
        //WreckStore.unlisten();
    }

    componentWillReceiveProps(nextprops, nextstate) {
        //if(this.state.wreck.id != nextprops.params.id) {
        //    // WreckAction.fetchWreck(nextprops.params.id)
        //    // this.setState({isLoading: true})
        //}
    }

    render() {

        //if (this.state.isLoading) {
        //    console.log("wreck is loading ...")
        //    return   <div>
        //                <img src="./app/stylesheets/images/ajax-loader.gif" />
        //            </div>
        //
        //}

        console.log("render in Wreck")

        return  <div className="row">
                    <div className="col-md-10 col-md-offset-1">
                        <PresentationComponent wreck={this.props.viewer.wreck}/>
                    </div>
                </div>
    }
}

export default Relay.createContainer(Wreck, {

   //fragments: {
   //  viewer: () => Relay.QL`
   //    fragment on Viewer {
   //      ${PresentationComponent.getFragment('viewer')}
   //    }
   //  `
   //}

    initialVariables: {
        id: null
    },

    prepareVariables({ id }) {

        console.log("id in WreckPresentation : " + id)
        return {
            id: id
        }
    },
    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
            wreck(id: $id) {
              id,
              name,
              shortDescription,
              description,
              imagePath
            }
          }
       `
    }
 })

// "query WreckQueries{wrecks{id,...F1}} fragment F0 on Wreck{name,latitude,longitude,shortDescription,description,imagePath,id} fragment F1 on Wreck{id,...F0}"
