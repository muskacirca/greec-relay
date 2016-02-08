import React from 'react';
import { IndexRoute, Route } from 'react-router';

import WreckQueries from '../queries/ViewerQueries'
import WreckUnitQuery from '../queries/WreckUnitQuery'

import MainApp from '../components/MainApp';
import Wreck from '../components/wreck/Wreck'
import Team from '../components/team/Team'
import Advice from '../components/advice/Advice'
import Admin from '../components/admin/Admin'
import WreckForm from '../components/wreck/WreckForm'


function prepareWidgetListParams(params, route) {
    return {
        ...params,
        id: params.id ? params.id : "1"
    };
};


export default <Route path="/" component={MainApp} queries={WreckQueries} >
                    <IndexRoute component={MainApp} queries={WreckQueries}/>
                    <Route path="wreck(/:id)" component={Wreck} queries={WreckUnitQuery}
                            prepareParams={prepareWidgetListParams} />

                    <Route path="advice" component={Advice} />
                    <Route path="team" component={Team} />

                    <Route path="admin" component={Admin} queries={WreckQueries} />

                    <Route path="admin/wreck/create" component={WreckForm} />
                    <Route path="admin/wreck/edit/:id" component={WreckForm} queries={WreckUnitQuery}
                           prepareParams={prepareWidgetListParams} />/>
                </Route>
