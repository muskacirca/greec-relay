import React from 'react'

class Advice extends React.Component {

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        console.log("Advice componentDidMount()")
    }

    componentWillUnmount() {
        console.log("Advice componentDidMount()")
    }

    render() {

        return  <div>ADVICE</div>
    }
}

export default Advice
