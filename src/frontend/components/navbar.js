import React from 'react'
import {Link} from 'react-router'

class Navbar extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {

        return (
            <nav id="navbar-main" className="navbar navbar-fixed-top">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand" href="/greec">
                           GREEC
                        </a>
                    </div>

                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="nav navbar-nav">
                            <li role="presentation">
                                <Link to="/wreck/1" activeClassName="link-active">Les Epaves</Link>
                            </li>
                            <li role="presentation">
                                <Link to="/team" activeClassName="link-active">L'Equipe</Link>
                            </li>
                            <li role="presentation">
                                <Link to="/advice" activeClassName="link-active">Conseils</Link>
                            </li>
                            <li role="presentation">
                                <Link to="/admin" activeClassName="link-active">Admin</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}

export default Navbar
