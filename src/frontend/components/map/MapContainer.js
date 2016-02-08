import Map from './Map';
import Relay from 'react-relay';

export default Relay.createContainer(Map, {
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
});
