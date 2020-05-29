module.exports = app => {
    const product = require("../controllers/product.controller.js");
    var router = require("express").Router();

    router.get('/', product.scrap)
    router.get('/list', product.list)

    app.use('/', router)
}