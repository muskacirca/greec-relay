'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Viewer = exports.Wreck = undefined;
exports.initState = initState;
exports.getById = getById;
exports.getViewer = getViewer;
exports.isInitialized = isInitialized;
exports.getWrecks = getWrecks;
exports.pushWreck = pushWreck;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Wreck = exports.Wreck = function (_Object) {
    _inherits(Wreck, _Object);

    function Wreck() {
        _classCallCheck(this, Wreck);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Wreck).apply(this, arguments));
    }

    return Wreck;
}(Object);

var Viewer = exports.Viewer = function (_Object2) {
    _inherits(Viewer, _Object2);

    function Viewer() {
        _classCallCheck(this, Viewer);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(Viewer).apply(this, arguments));
    }

    return Viewer;
}(Object);

var VIEWER_ID = 'me';

var viewer = new Viewer();
viewer.id = VIEWER_ID;

var wrecksStore = [];

var usersById = _defineProperty({}, VIEWER_ID, viewer);

function initState(wrecks) {

    //var typedWrecks = wrecks.map((elt) => {
    //    const todo = new Wreck();
    //    Object.assign(todo, elt);
    //    return todo
    //})

    wrecksStore = wrecks;
    return wrecksStore;
}

function getById(id) {

    var wreck = wrecksStore.filter(function (elt) {
        if (elt.id == id) {
            return elt;
        }
    });

    return wreck[0];
}

function getViewer() {

    console.log("getting viewer : " + JSON.stringify(usersById[VIEWER_ID]));
    return usersById[VIEWER_ID];
}

function isInitialized() {
    if (wrecksStore.length === 0) {
        return false;
    } else {
        return true;
    }
}

function getWrecks() {

    console.log("wrecksStore: " + wrecksStore.length);

    return wrecksStore;
}

function pushWreck(wreck) {

    var typedWreck = new Wreck();
    Object.assign(typedWreck, wreck);
    wrecksStore.push(typedWreck);
}