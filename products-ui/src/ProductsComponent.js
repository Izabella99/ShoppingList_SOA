import React, {Component} from 'react';
import {Box, Button, TextInput, List,FormField} from 'grommet';
import {CircleInformation,Send} from "grommet-icons";
import emailjs from '@emailjs/browser';

class ProductsComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productName: '',
            productQty: '',
            email: '',
            name: '',
            message: null,
            products: [],
        };
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    getProducts = () => {
        const {token, username} = this.props;
        const url_products = 'http://localhost:8092/urest/v1/products?';
        console.log(`sending request: ${url_products}`);
        fetch(url_products + new URLSearchParams({
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
                this.setState({ products: data });

            }).catch((err)=>{
            console.log(`Error API call: ${err}`);
            alert(err);
        });
    }

    componentDidMount() {
        console.log('componentDidMount');
        this.getProducts();
    }

    componentDidUpdate(prevState) {
        const {products} = this.state;
        if (products && prevState.products && products.length !== prevState.products.length) {
            this.setState({productName: ''});
            this.setState({productQty: ''});
        }
    }

    onAdd = e => {
        e.preventDefault()
        const {productName, productQty} = this.state;
        const {token, username} = this.props;

        if (productName === '' || productQty === ''){
            this.setState({message: 'Invalid data.'});
        } else {
            const url_product = 'http://localhost:8092/urest/v1/product';
            console.log(`sending request: ${url_product}`);

            fetch(url_product,{
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
                        console.log("Product successfully added.");
                        this.setState({productName: ''})
                        this.setState({productQty: ''})
                        this.getProducts();
                    } else {
                        alert(api_error);
                    }
                }).catch((err) => {
                console.log(`Error API call: ${err}`);
                alert(err);
            });
        }
    }

    onSend = e => {
        const {email, name, products} = this.state;

        if (email === ''){
            alert('Invalid data.');
        } else {
            let products_copy = products.map((elem) => `${elem.productName} - ${elem.productQty}\n`);

            emailjs.send('service_o2byr5k', 'template_b8kd10b', {user_name:name,user_email:email,message:products_copy}, 'di7t33JsuuAwGoQ8b')
            .then((result) => {
                console.log(result.text);
                alert('Email successfully sent!')
            }, (error) => {
                console.log(error.text);
                alert(' Error encountered while sending email. ')
            });
        
        }
    }

    render() {
        const {products} = this.state;

        console.log(products)
        return(
            <Box className='wishlist' style={{flexDirection: 'column', display: 'block',width:'100%',position:'absolute',top:'40%'}} >
                <Box  
                    direction="row"
                    pad="medium" 
                    style={{height: "600px",border:'none',display:'flex',justifyContent:'space-around'}}
                    margin="small"
                    round="xsmall"
                    border
                    >
                    <Box className='productsForm' style={{paddingTop: '2px',height: "90%",background:"transparent",width:'65%',border: 'none',margin:'auto 0',maxWidth:'unset'}}>
                        <h2 style={{alignSelf: "center"}}>My Shopping List</h2>
                        <List
                            style={{
                                alignSelf: "center",
                                width: '70%',
                                padding: '0 10%',
                                overflowY: 'scroll',
                                margin: '20px auto',
                                height: '100%'
                            }}
                            primaryKey="productName"
                            secondaryKey="productQty"
                            data={products}
                        />
                        
                    </Box>
                    <Box className='productsForm' style={{background:"#2E8B57",color:'white',border:"none",height: "100%",padding:'30px'}}>
                        <h2>Add products to wishlist</h2>
                        <FormField
                            className='productField'
                            style={{marginTop: "20%"}}
                            label="Product"
                        >
                            <TextInput
                                style={{color: "white"}}
                                className='input'
                                name='productName'
                                id='productName'
                                placeholder='Add product'
                                type='text'
                                onChange={this.onChange}
                            />
                        </FormField>
                        <FormField
                            className='productField'
                            label="Quantity"
                        >
                            <TextInput
                                style={{color: "white"}}
                                className='input'
                                name='productQty'
                                id='productQty'
                                placeholder='Add quantity'
                                type='text'
                                onChange={this.onChange}
                            />
                        </FormField>
                        {this.state.message && (
                            <Box style={{alignSelf: 'start', flexDirection: 'row', display: 'flex'}}>
                                <CircleInformation className='infoIcon'/>
                                <span
                                    style={{color: '#d50000', fontSize: '13px'}}>{this.state.message}</span>
                            </Box>
                        )}
                        <Box className='add' style={{padding: "20px",marginTop:'10%'}}>
                            <Button className="add-btn" style={{margin:'auto',width:'70%',backgroundColor:'#5464f2',color:'white'}} onClick={this.onAdd}>Add</Button>
                        </Box>
                    </Box>
                </Box>
                <Box style={{padding: "20px"}}>
                    <h2 style={{alignSelf: "center",color:'#5464f2',fontSize:"35px"}}>Share your shopping list with family or friends!</h2>
                </Box>
                <Box style={{height: '580px',backgroundColor: 'rgb(46, 139, 87,.7)'}}>
                    <Box className='productsForm' style={{margin: 'auto',height:'auto'}}>
                        
                        <Send style={{alignSelf: "center",stroke:'#5464f2'}}  size='large'/> 
                        <h2 style={{alignSelf: "center"}}>Send by email</h2>
                        
                        <FormField label="Email" className='emailBox' style={{height: 'auto',alignItems:'flex-start'}}>
                            <TextInput
                                className='input'
                                name='email'
                                id='email'
                                plain
                                placeholder="Receiver's e-mail address"
                                style={{width: '100%'}}
                                type='text'
                                onChange={this.onChange}
                            />
                        </FormField>

                        <FormField label="Name" className='emailBox' style={{height: 'auto',alignItems:'flex-start'}}>
                            <TextInput
                                className='input'
                                name='name'
                                id='name'
                                plain
                                placeholder="Receiver's name"
                                style={{width: '100%'}}
                                type='text'
                                onChange={this.onChange}
                            />
                        </FormField>

                        {this.state.message && (
                            <Box style={{alignSelf: 'start', flexDirection: 'row', display: 'flex'}}>
                                <CircleInformation className='infoIcon'/>
                                <span
                                    style={{color: '#d50000', fontSize: '13px'}}>{this.state.message}</span>
                            </Box>
                        )}
                        <Box className='add' style={{padding: "20px"}}>
                            <Button style={{margin:'auto',width:'70%', backgroundColor:'#5464f2',color:'white'}} onClick={this.onSend}>Send</Button>
                        </Box>
                </Box>
                </Box>
               
            </Box>
    )
    }
}

export default ProductsComponent;
