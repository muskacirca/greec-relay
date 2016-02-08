import Wreck from './Wreck';
import Relay from 'react-relay';

export default Relay.createContainer(Wreck, {
    fragments: {
        viewer: () => Relay.QL`
          fragment on Viewer {
            wrecks(first: 100) {
              edges {
                node {
                  name,
                  shortDescription,
                  description,
                  imagePath
                }
              }
            }
          }
        `
    }
});
