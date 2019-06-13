const path = require('path');
const Sequelize = require('sequelize');

const DEFAULT_LENGTH = 100;

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../', './db') + '/app.db'
});

const Model = sequelize.define('users', {
    username: {
        type: Sequelize.STRING(DEFAULT_LENGTH),
        allowNull: false,
        defaultValue: null,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: null,
        validate: {
            notEmptyWhenAdd(value) {
                console.log('masuk sini', this.id)
                if (value === null && (this.id === null || this.id === undefined)) {
                    throw new Error("users.password cannot be null");
                }
            }
        }
    },
fullname: {
    type: Sequelize.STRING(DEFAULT_LENGTH),
        allowNull: false,
            defaultValue: null,
                validate: {
        notEmpty: true
    }
},
city: {
    type: Sequelize.STRING(DEFAULT_LENGTH),
        allowNull: false,
            defaultValue: null,
                validate: {
        notEmpty: true
    }
},
status: {
    type: Sequelize.TINYINT,
        allowNull: false,
            defaultValue: 1,
                validate: {
        notEmpty: true
    }
}
});

Model.sync();

module.exports = Model;