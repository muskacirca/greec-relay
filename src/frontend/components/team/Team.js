import React from 'react'

class Team extends React.Component {

    constructor(props) {
        super(props)
    }
    componentDidMount() {
        console.log("Team componentDidMount()")
    }

    componentWillUnmount() {
        console.log("Team componentDidMount()")
    }

    render() {

        return  <div>Team</div>
    }
}

export default Team
