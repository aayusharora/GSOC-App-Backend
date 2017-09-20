/**
 * Created by aayusharora on 9/19/17.
 */

const Sequelize = require('sequelize');
var dbconfig;

try {
    dbconfig = require('../dbconfig.json');

} catch (e) {
    console.error('Create your own db file');
    dbconfig = require('../dbconfig-sample.json');
}

const DATABASE_URL = process.env.DATABASE_URL || ('postgres://' + dbconfig.USER + ":" + dbconfig.PASSWORD + "@" + dbconfig.HOST + ":5432/" + dbconfig.DB);

const sequelize = new Sequelize( DATABASE_URL, {
    host: dbconfig.HOST,
    dialect: dbconfig.dialect,
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

const Users = sequelize.define("users", {
    id: { type: Sequelize.DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: Sequelize.DataTypes.STRING,
    email: Sequelize.DataTypes.STRING,
    college: Sequelize.DataTypes.STRING,
    branch: Sequelize.DataTypes.STRING,
    isgsoc_mentor: Sequelize.DataTypes.BOOLEAN,
    isgsoc_participant: Sequelize.DataTypes.BOOLEAN
});


module.exports = {
    Users
};