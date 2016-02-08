"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require("sequelize");

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mysql_user = process.env.CLEARDB_DATABASE_USER || "greec";
var mysql_pass = process.env.CLEARDB_DATABASE_PASS || "test";

var connection = new _sequelize2.default('greec', 'greec', 'test', {
    dialect: "mysql",
    host: process.env.CLEARDB_DATABASE_URL || "localhost"
});

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
        type: _sequelize2.default.STRING,
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
});

// Relationship
//Wreck.hasMany(Media)
//Media.belongsTo(Wreck)

connection.sync({ force: true });

exports.default = connection;