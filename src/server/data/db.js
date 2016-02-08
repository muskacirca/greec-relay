import Sequelize from 'sequelize'

const connection = new Sequelize(
    'greec',
    'greec',
    'test',
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
