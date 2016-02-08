'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fetchAllWrecks = fetchAllWrecks;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _graphqlRelay = require('graphql-relay');

var _graphqlRelay2 = _interopRequireDefault(_graphqlRelay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var loaded = false;
var wrecks = [];

function fetchAllWrecks() {

    return (0, _graphqlRelay2.default)(_axios2.default.get("http://greec-muskacirca.rhcloud.com/greec/rs/wrecks/lightweight").then(function (response) {
        return response.data;
    }), args);
}