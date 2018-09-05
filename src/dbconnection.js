const Sequelize = require('sequelize');

const sequelize = new Sequelize('test-schema', 'root', 'colemancs499', {
    host: '142.93.6.47',
    dialect: 'mysql',
    operatorsAliases: false,
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    }); 