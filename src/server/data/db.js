import Sequelize from 'sequelize'

var mysql_schema = process.env.CLEARDB_DATABASE_SCHEMA || "greec"
var mysql_user = process.env.CLEARDB_DATABASE_USER || "greec"
var mysql_pass = process.env.CLEARDB_DATABASE_PASS || "test"

const connection = new Sequelize(
    mysql_schema,
    mysql_user,
    mysql_pass,
    {
        dialect: "mysql",
        host: process.env.CLEARDB_DATABASE_URL  || "localhost"
    }
)

const Wreck = connection.define('wreck',  {

    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    latitude: {
        type: Sequelize.DOUBLE,
        allowNull: false
    },
    longitude: {
        type: Sequelize.STRING,
        allowNull: false
    },
    shortDescription: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sinkDate: {
        type: Sequelize.DATE,
        allowNull: false
    },
    imagePath: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

// Relationship
//Wreck.hasMany(Media)
//Media.belongsTo(Wreck)


connection.sync({force: true})


export default connection
