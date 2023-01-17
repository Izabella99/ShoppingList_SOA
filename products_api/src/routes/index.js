const router = require('express').Router();
const productRoute = require('./api');

router.use('/product', productRoute);
module.exports = router;
