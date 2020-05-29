var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
const db = require("../models");
const product = db.product;

let getPageData = function (url) {
    return new Promise(function (resolve, reject) {
        console.log(url)
        request(url, function (error, response, html) {
            if (!error) {

                console.log('rrrrrrr')
                var $ = cheerio.load(html);
                $('.s-result-item').each(function (i, element) {
                    console.log('rrrrrrr')

                    var data = $(this);
                    name = data.find('.a-size-medium').text();
                    price = data.find('.a-price-whole').text() + data.find('.a-price-fraction').text();
                    image = data.find('.s-image').attr('src');

                    let newProduct = {
                        name: name,
                        image: image,
                        price: price
                    }

                    console.log(newProduct)

                    product.update({ name: name }, newProduct, { upsert: true }, (err, data) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log('Product - ' + name + ' added')
                        }
                    })

                    if (!$('.a-pagination a-last').hasClass('a-disabled')) {
                        let newUrl = $('.a-pagination a-last a').attr('href')
                        getPageData(newUrl)
                    } else {
                        return true
                    }
                    // return true;
                })

            } else {
                return false
            }
        })
    })
}

module.exports.scrap = async (req, res) => {

    url = 'https://www.amazon.com/s?srs=5286335011';

    await getPageData(url).then(function () {
        res.status(200).send({ success: true, result: 'Scrapped' })
    }).catch(function () {
        res.status(400).send({ success: false })
    })
}

module.exports.list = (req, res) => {
    product.find({}, (err, data) => {
        if (err) {
            res.status(400).send({ success: false, result: { message: err.message } })
        } else {
            if (data.length > 0) {
                res.status(200).send({ success: true, result: { message: 'Product List', data: data } })
            } else {
                res.status(404).send({ success: false, result: { message: 'Products not found' } })
            }
        }
    })
}