"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _sequelize = require("sequelize");

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