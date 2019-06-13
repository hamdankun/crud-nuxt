const express = require('express');
const Sequalize = require('sequelize');
const userModel = require('./model/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const router = express.Router();
const Op = Sequalize.Op;

router.get('/', function (req, res) {
    let limit = 10;
    let page = req.query.page;
    let keyword = req.query.keyword;
    let refColumn = req.query.ref_column;
    let options = {
        attributes: ['id', 'username', 'fullname', 'city', 'status'],
        limit: limit,
        offset: (((req.query.page || 1) - 1) * limit),
        order: [
            ['createdAt', 'DESC']
        ]
    };

    if (keyword) {
        if (refColumn === 'all') {
            let searchColumns = ['username', 'fullname', 'city', 'status'].map(function (column) { return Sequalize.where(column !== 'status' ? Sequalize.cast(Sequalize.col(userModel.getTableName() + '.' + column), 'char') : Sequalize.literal("CASE WHEN status = 1 THEN 'lajang' ELSE 'menikah' END"), { [Op.like]: '%' + keyword.toLowerCase() + '%' }) });
            options.where = {
                [Op.or]: searchColumns
            }
        } else {
            if (refColumn !== 'status') {
                options.where = {
                    [refColumn]: {
                        [Op.like]: '%' + keyword + '%'
                    }
                }
            } else {
                options.where = {
                    [Op.and]: Sequalize.where(Sequalize.literal("CASE WHEN status = 1 THEN 'lajang' ELSE 'menikah' END"), { [Op.like]: '%' + keyword.toLowerCase() + '%' })
                }
            }
        }
    }

    userModel.findAndCountAll(options)
        .then(function (data) {
            return res.status(200).json({ status: 'success', data: Object.assign({}, data, { page: page }) });
        })
        .catch(function () {
            return res.status(500).json({ 'error': 'Internal Server Error!' });
        });

});

router.get('/:id', function (req, res) {
    userModel.findByPk(req.params.id)
        .then(function (data) {
            if (!data) {
                throw 404;
            }
            return res.status(200).json({ status: 'success', data: data });
        })
        .catch(function (error) {
            return res.status(error === 404 ? error : 500).json({ 'error': error === 404 ? 'User Not Found' : error });
        });
});

router.post('/', function (req, res) {

    let mapData = req.body;

    bcrypt.hash(mapData.password, saltRounds, function (err, hash) {
        mapData.password = hash;
        userModel.create(mapData, { returning: true })
            .then(function (data) {
                return res.status(200).json({ status: 'success', data: data });
            })
            .catch(function (error) {
                return res.status(error.errors ? 412 : 500).json({ 'error': error.errors ? error.errors : 'Internal Server Error' });
            });
    });

});

router.put('/:id', function (req, res) {
    let mapData = req.body

    if (mapData.password) {
        bcrypt.hash(mapData.password, saltRounds, function (err, hash) {
            mapData.password = hash;
            userModel.update(mapData, { where: { id: req.params.id } })
                .then(function () {
                    return res.status(200).json({ status: 'success', data: Object.assign({}, { id: req.params.id }, req.body) });
                })
                .catch(function (error) {
                    return res.status(500).json({ 'error': error });
                });
        });
    } else {
        userModel.update(mapData, { where: { id: req.params.id } })
            .then(function () {
                return res.status(200).json({ status: 'success', data: Object.assign({}, { id: req.params.id }, req.body) });
            })
            .catch(function (error) {
                return res.status(500).json({ 'error': error });
            });
    }
});

router.delete('/:id', function (req, res) {
    userModel.destroy({ where: { id: req.params.id } })
        .then(function (data) {
            return res.status(200).json({ status: 'success', data: {} });
        })
        .catch(function (error) {
            return res.status(500).json({ 'error': error.errors ? error.errors : 'Internal Server Error' });
        });
});


module.exports = router;