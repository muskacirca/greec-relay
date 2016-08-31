import Relay from 'react-relay';

class AddOrUpdateWreckMutation extends Relay.Mutation {

    static fragments = {
        wreck: () => Relay.QL`
          fragment on WreckType {
            id
          }
        `
    };

    getMutation() {
        return Relay.QL`mutation{addOrUpdateWreck}`
    }

    getFatQuery() {
        return Relay.QL`
          fragment on AddOrUpdateWreckPayload {
             wreck
          }
        `
    }
    getConfigs() {
        return [
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    wreck: this.props.wreck.id
                }
            },
        ]
    }

    getFiles() {
        return {
            image: this.props.file,
        };
    }
    
    getVariables() {
        return {
            id: this.props.id,
            name: this.props.name,
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            shortDescription: this.props.shortDescription,
            description: this.props.latitude,
            sinkDate: this.props.sinkDate,
            imagePath: this.props.imagePath,
            fileName: "test.yo"
        };
    }

    getOptimisticResponse() {
        return {
            id: this.props.id,
            name: this.props.name,
            latitude: this.props.latitude,
            longitude: this.props.longitude,
            shortDescription: this.props.shortDescription,
            description: this.props.latitude,
            sinkDate: this.props.sinkDate,
            imagePath: this.props.imagePath
        }
    }
}

export default AddOrUpdateWreckMutation
