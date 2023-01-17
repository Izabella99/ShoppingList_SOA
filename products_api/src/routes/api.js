const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const error = 'Internal server error';

router.route('/').get((req,res)=>{
    console.log('----------Request received for path / GET-------------');
    const username = req.query.username;
    console.log(`query username:  ${username}`);

    fs.readFile(path.resolve(__dirname, 'products.json'), 'utf-8', (err, jsonString) => {

        if (err) {
            console.log(`Error opening products.json:  ${err}`);
            res.json(error);

        } else {

            let data;
            try {
                data = JSON.parse(jsonString);
            } catch (err) {
                console.log(`Error parsing JSON:  ${err}`);
                res.json({error});
            }

            let products = [];
            data.forEach( (entry) => {
                if(username === entry.username){
                    products.push({
                        "productName": entry.productName,
                        "productQty": entry.productQty
                    });
                }
            });

            console.log(`${products.length} products found`);
            res.json(products);
        }
    });
});

router.route('/').post( (req, res) => {
    console.log('---------------Request received for path / POST-----------');
    const {username,productName, productQty} = req.body;
    console.log(`body username: ${username}`);
    console.log(`body productName: ${productName}`);
    console.log(`body productQty: ${productQty}`);
    let data;

    try {
        console.log("Reading from file");
        const jsonString = fs.readFileSync(path.resolve(__dirname, 'products.json'));
        data = JSON.parse(jsonString);
        console.log(data);
    } catch (err) {
        console.log(`Error parsing JSON:  ${err}`);
        res.json({error});
    }

    data.push({
        "username": username,
        "productName": productName,
        "productQty": productQty
    });

    console.log(data);

    try {
        console.log("Writing to file");
        fs.writeFile(path.resolve(__dirname, 'products.json'), JSON.stringify(data), function writeJSON(err) {
            if (err) return console.log(err);
            console.log(JSON.stringify(data));
        });
        res.json({
            "username": username,
            "productName":productName,
            "productQty": productQty
        });
    } catch (err) {
        console.log(`Error writing JSON:  ${err}`);
        res.json({error});
    }
});


module.exports = router;
