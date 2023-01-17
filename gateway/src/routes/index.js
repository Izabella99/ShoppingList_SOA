const router = require('express').Router();
const apiRoute = require('./api');

router.use('/urest/v1', apiRoute);
module.exports = router;
