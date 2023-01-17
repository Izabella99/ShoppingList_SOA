const fetch = require('node-fetch');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const accessTokenSecret = "myunaccessibletokensecret"

let error = 'Internal server error';
let loggedInUsers = [];
let token = '';

ensureToken = function(req, res, next) {
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(" ")
        const bearerToken = bearer[1]
        jwt.verify(bearerToken, accessTokenSecret, (err, result) => {
            if(err) { res.sendStatus(403) }
            else{ next() }
        })
    } else {
        res.sendStatus(403)
    }
}

router.route('/login').post((req,res)=>{
    console.log('-----------Request received for path /login POST--------------');
    const { username, password } = req.body;
    console.log(`Username:  ${username}`);
    console.log(`Password:  ${password}`);

    if(loggedInUsers.findIndex((elem) => elem === username) > -1){
        error = 'User already logged in';
        console.log(error);
        res.json({error});
    } else {
        const auth_url = 'http://auth:8090/user/authenticate';
        console.log(`sending request: ${auth_url}`);

        fetch(auth_url,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        }).then(response => response.json())
            .then(data => {
                const api_error = data.error;
                if(typeof api_error == 'undefined'){
                    console.log("Password is correct.");
                    loggedInUsers.push(username);
                    token = data.accessToken;
                    console.log(token);
                    console.log(`Logged in users: ${loggedInUsers}`);
                    res.json({username, token});
                } else {
                    console.log(api_error);
                    error = data.error;
                    res.json({error});
                }
            }).catch((err) => {
            console.log(`Error API call: ${err}`);
            res.json({error});
        });
    }
});

router.route('/logout').post(ensureToken, (req, res) => {
    console.log('-------------Request received for path /logout POST-----------');
    const { username } = req.body;
    console.log(`body username:  ${username}`);
    if(loggedInUsers.find(element => element === username)){
        token = '';
        loggedInUsers.pop(username);
        console.log(`User ${loggedInUsers} successfully logged out`)
    }
    console.log(`Logged in users: ${loggedInUsers}`);

    res.json({username});

});

router.route('/products').get(ensureToken, (req, res) => {
    console.log('-------------------Request received for path /products GET--------------');
    const {username} = req.query;
    console.log(`query username:  ${username}`);

    const product_url = 'http://products_api:8096/product?';
    console.log(`sending request: ${product_url}`);
    fetch(product_url + new URLSearchParams({
        username: username
    }),{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    }).then(response => response.json())
        .then(data => {
            console.log(`${data.length} products obtained successfully for user: ${username}`);
            res.json(data);
        }).catch((err)=>{
        console.log(`Error API call: ${err}`);
        res.json({error});
    });

});

router.route('/product').post(ensureToken, (req, res) => {
    console.log('---------------Request received for path /product POST-----------');
    const {username, productName, productQty} = req.body;
    console.log(`body username:  ${username}`);
    console.log(`body from:  ${productName}`);
    console.log(`body to:  ${productQty}`);

    const product_url = 'http://products_api:8096/product';
    console.log(`sending request: ${product_url}`);

    fetch(product_url,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "username": username,
            "productName": productName,
            "productQty": productQty
        })
    }).then(response => response.json())
        .then(data => {
            const api_error = data.error;
            if(typeof api_error == 'undefined'){
                console.log("Product successfully saved.");
            } else {
                console.log(api_error);
            }
            res.json(data);
        }).catch((err) => {
        console.log(`Error API call: ${err}`);
        res.json({error});
    });
});


module.exports = router;

