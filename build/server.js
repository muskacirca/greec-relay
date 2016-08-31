module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _path = __webpack_require__(2);

	var _path2 = _interopRequireDefault(_path);

	var _schema = __webpack_require__(3);

	var _expressGraphql = __webpack_require__(12);

	var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

	var _multer = __webpack_require__(13);

	var _multer2 = _interopRequireDefault(_multer);

	var _fs = __webpack_require__(14);

	var _fs2 = _interopRequireDefault(_fs);

	var _lodash = __webpack_require__(11);

	var _lodash2 = _interopRequireDefault(_lodash);

	var _sanitizeFilename = __webpack_require__(15);

	var _sanitizeFilename2 = _interopRequireDefault(_sanitizeFilename);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var server_port = process.env.PORT || 3000;

	var app = (0, _express2.default)();

	app.get('/', function (req, res) {
	    res.sendFile(_path2.default.resolve(__dirname, "../src/frontend/index.html"));
	});

	app.use('/style', _express2.default.static(_path2.default.resolve(__dirname, '../src/style')));
	app.use('/utils', _express2.default.static(_path2.default.resolve(__dirname, '../src/utils')));
	app.use('/public', _express2.default.static(_path2.default.resolve(__dirname, '../src/public')));
	app.use('/images', _express2.default.static(_path2.default.resolve(__dirname, '../images')));

	app.get('/bundle.js', function (req, res) {
	    res.sendFile(_path2.default.resolve(__dirname, "../src/frontend/public/bundle.js"));
	});

	var storage = _multer2.default.memoryStorage();
	var multerMiddleware = (0, _multer2.default)({ storage: storage }).fields([{ name: 'file' }]);
	var uploadMiddleWare = function uploadMiddleWare(req, res, next) {
	    multerMiddleware(req, res, function () {
	        // request contains file data in req.files in format
	        // {
	        //   key: [{
	        //     fieldname,
	        //     originalname,
	        //     encoding,
	        //     mimetype,
	        //     buffer,
	        //     size
	        //   }]
	        // }

	        // convert to array in format
	        // [
	        //   [fieldname, originalname ...]
	        // ]
	        var files = _lodash2.default.values(req.files);

	        if (!files || files.length === 0) {
	            next();
	            return;
	        }

	        // Parse variables so we can add to them. (express-graphql won't parse them again once populated)
	        req.body.variables = JSON.parse(req.body.variables);

	        files.forEach(function (fileArray) {
	            var file = fileArray[0];
	            var filename = (0, _sanitizeFilename2.default)(file.originalname.replace(/[`~!@#$%^&*()_|+\-=÷¿?;:'",<>\{\}\[\]\\\/]/gi, ''));

	            // save file to disk
	            var filePath = _path2.default.join(__dirname, '../images', filename);
	            _fs2.default.writeFileSync(filePath, file.buffer);

	            // add files to graphql input. we only support single images here
	            req.body.variables.input_0[file.fieldname] = '/images/' + filename;
	        });

	        next();
	    });
	};

	app.use('/graphql', uploadMiddleWare);

	app.use('/graphql', (0, _expressGraphql2.default)(function (req) {
	    return {
	        schema: _schema.Schema,
	        pretty: true,
	        graphiql: true
	    };
	}));

	app.listen(server_port, function (err) {
	    if (err) return console.log(err);
	    console.log('Server is now running on port ' + server_port);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Schema = undefined;

	var _graphql = __webpack_require__(4);

	var _WrecksMutation = __webpack_require__(5);

	var _WreckModel = __webpack_require__(7);

	var Mutations = new _graphql.GraphQLObjectType({
	    name: 'Mutation',
	    description: 'Mother of all mutations',
	    fields: function fields() {
	        return {
	            addOrUpdateWreck: _WrecksMutation.AddOrUpdateWreckMutation
	        };
	    }
	});

	var Schema = exports.Schema = new _graphql.GraphQLSchema({
	    query: _WreckModel.GraphQLRoot,
	    mutation: Mutations
	});

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("graphql");

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.AddOrUpdateWreckMutation = undefined;

	var _graphql = __webpack_require__(4);

	var _graphqlRelay = __webpack_require__(6);

	var _WreckModel = __webpack_require__(7);

	var _db = __webpack_require__(8);

	var _db2 = _interopRequireDefault(_db);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AddOrUpdateWreckMutation = exports.AddOrUpdateWreckMutation = new _graphqlRelay.mutationWithClientMutationId({
	    name: 'AddOrUpdateWreck',
	    description: 'Function to add a comment to an item',
	    inputFields: {
	        id: { type: _graphql.GraphQLString },
	        name: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
	        latitude: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat) },
	        longitude: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLFloat) },
	        shortDescription: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
	        description: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
	        sinkDate: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLString) },
	        imagePath: { type: _graphql.GraphQLString },
	        file: { type: _graphql.GraphQLString }
	    },
	    outputFields: {
	        wreck: {
	            type: _WreckModel.GraphQLWreckType,
	            resolve: function resolve(wreck) {
	                return wreck;
	            }
	        }
	    },
	    mutateAndGetPayload: function mutateAndGetPayload(wreck) {

	        console.log("yoooo : " + JSON.stringify(wreck));

	        if (wreck.file) {
	            var imageName = wreck.file.substring(0, wreck.file.lastIndexOf('.'));
	            var mimeType = wreck.file.substring(wreck.file.lastIndexOf('.'));
	            console.log("imageName : " + JSON.stringify(imageName));
	            console.log("mineType : " + JSON.stringify(mimeType));
	        }

	        if (!wreck.id) {
	            console.log("creating : " + JSON.stringify(wreck));
	            return _db2.default.models.wreck.create(wreck).then(function (r) {
	                return r;
	            });
	        } else {
	            var id = (0, _graphqlRelay.fromGlobalId)(wreck.id).id;
	            wreck.id = id;
	            console.log("updating : " + JSON.stringify(wreck));
	            return _db2.default.models.wreck.update(wreck, { where: { id: wreck.id } }).then(function (r) {
	                return wreck;
	            });
	        }
	    }
	});

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("graphql-relay");

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.GraphQLRoot = exports.GraphQLViewer = exports.WrecksConnection = exports.GraphQLWreckType = undefined;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _graphql = __webpack_require__(4);

	var _graphqlRelay = __webpack_require__(6);

	var _db = __webpack_require__(8);

	var _db2 = _interopRequireDefault(_db);

	var _WreckStore = __webpack_require__(10);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	/**
	 * The first argument defines the way to resolve an ID to its object.
	 * The second argument defines the way to resolve a node object to its GraphQL type.
	 */

	var _nodeDefinitions = (0, _graphqlRelay.nodeDefinitions)(function (globalId) {
	    var _fromGlobalId = (0, _graphqlRelay.fromGlobalId)(globalId);

	    var id = _fromGlobalId.id;
	    var type = _fromGlobalId.type;

	    if (type === 'WreckType') {
	        return _db2.default.models.wreck.findById(id);
	    } else if (type === "Viewer") {
	        return (0, _WreckStore.getViewer)(id);
	    }
	    return null;
	}, function (obj) {
	    if (obj.latitude) {
	        return GraphQLWreckType;
	    } else {
	        return GraphQLViewer;
	    }
	});

	var nodeInterface = _nodeDefinitions.nodeInterface;
	var nodeField = _nodeDefinitions.nodeField;
	var GraphQLWreckType = exports.GraphQLWreckType = new _graphql.GraphQLObjectType({
	    name: 'WreckType',
	    fields: {
	        id: (0, _graphqlRelay.globalIdField)('WreckType'),
	        wreckId: {
	            type: _graphql.GraphQLString,
	            resolve: function resolve(obj) {
	                return obj.id;
	            }
	        },
	        name: {
	            type: _graphql.GraphQLString,
	            resolve: function resolve(obj) {
	                return obj.name;
	            }
	        },
	        shortDescription: {
	            type: _graphql.GraphQLString,
	            resolve: function resolve(obj) {
	                return obj.shortDescription;
	            }
	        },
	        description: {
	            type: _graphql.GraphQLString,
	            resolve: function resolve(obj) {
	                return obj.description;
	            }
	        },
	        latitude: {
	            type: _graphql.GraphQLFloat,
	            resolve: function resolve(obj) {
	                return obj.latitude;
	            }
	        },
	        longitude: {
	            type: _graphql.GraphQLFloat,
	            resolve: function resolve(obj) {
	                return obj.longitude;
	            }
	        },
	        sinkDate: {
	            type: _graphql.GraphQLString,
	            resolve: function resolve(obj) {
	                return obj.sinkDate;
	            }
	        },
	        imagePath: {
	            type: _graphql.GraphQLString,
	            resolve: function resolve(obj) {
	                return obj.imagePath;
	            }
	        }
	    },
	    interfaces: [nodeInterface]
	});

	var _connectionDefinition =
	// ,edgeType: GraphQLSimTypesEdge,
	(0, _graphqlRelay.connectionDefinitions)({
	    name: 'WreckType',
	    nodeType: GraphQLWreckType
	});

	var WrecksConnection = _connectionDefinition.connectionType;
	exports.WrecksConnection = WrecksConnection;
	var GraphQLViewer = exports.GraphQLViewer = new _graphql.GraphQLObjectType({
	    name: 'Viewer',
	    fields: function fields() {
	        return {
	            id: (0, _graphqlRelay.globalIdField)('Viewer'),
	            wrecks: {
	                type: WrecksConnection,
	                args: _extends({}, _graphqlRelay.connectionArgs),
	                resolve: function resolve(obj, _ref) {
	                    var args = _objectWithoutProperties(_ref, []);

	                    return _db2.default.models.wreck.findAll().then(function (response) {
	                        return (0, _graphqlRelay.connectionFromArray)(response, args);
	                    });
	                }
	            },
	            wreck: {
	                type: GraphQLWreckType,
	                args: {
	                    id: {
	                        type: _graphql.GraphQLString
	                    }
	                },
	                resolve: function resolve(obj, _ref2) {
	                    var id = _ref2.id;
	                    return _db2.default.models.wreck.findById(id).then(function (response) {
	                        return response;
	                    });
	                }
	            }
	        };
	    },
	    interfaces: [nodeInterface]
	});

	var GraphQLRoot = exports.GraphQLRoot = new _graphql.GraphQLObjectType({
	    name: 'Root',
	    fields: {
	        viewer: {
	            type: GraphQLViewer,
	            resolve: function resolve() {
	                return _WreckStore.getViewer;
	            }
	        },
	        node: nodeField
	    }
	});

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _sequelize = __webpack_require__(9);

	var _sequelize2 = _interopRequireDefault(_sequelize);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var mysql_schema = process.env.CLEARDB_DATABASE_SCHEMA || "greec";
	var mysql_user = process.env.CLEARDB_DATABASE_USER || "greec";
	var mysql_pass = process.env.CLEARDB_DATABASE_PASS || "test";

	var connection = process.env.CLEARDB_DATABASE_URL !== undefined ? new _sequelize2.default(process.env.CLEARDB_DATABASE_URL) : new _sequelize2.default(mysql_schema, mysql_user, mysql_pass, { dialect: "mysql", host: "localhost" });

	var Wreck = connection.define('wreck', {

	    name: {
	        type: _sequelize2.default.STRING,
	        allowNull: false
	    },
	    latitude: {
	        type: _sequelize2.default.DOUBLE,
	        allowNull: false
	    },
	    longitude: {
	        type: _sequelize2.default.DOUBLE,
	        allowNull: false
	    },
	    shortDescription: {
	        type: _sequelize2.default.STRING,
	        allowNull: false
	    },
	    description: {
	        type: _sequelize2.default.STRING,
	        allowNull: false
	    },
	    sinkDate: {
	        type: _sequelize2.default.DATE,
	        allowNull: false
	    },
	    imagePath: {
	        type: _sequelize2.default.STRING,
	        allowNull: false
	    }
	},

	// Options
	{
	    timestamps: false
	});

	// Relationship
	//Wreck.hasMany(Media)
	//Media.belongsTo(Wreck)

	connection.sync({ force: false });

	exports.default = connection;

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("sequelize");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

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

	var _lodash = __webpack_require__(11);

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

	    var wreck = wrecksStore.filter(function (elt) {
	        if (elt.id == wreck.id) {
	            return elt;
	        }
	    });

	    if (!wreck[0]) wrecksStore.push(wreck);
	}

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("lodash");

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = require("express-graphql");

/***/ },
/* 13 */
/***/ function(module, exports) {

	module.exports = require("multer");

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 15 */
/***/ function(module, exports) {

	module.exports = require("sanitize-filename");

/***/ }
/******/ ]);