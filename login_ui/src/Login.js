import React, {Component} from "react";
import {Box, Button, Form, grommet, Grommet, Image, FormField,TextInput} from 'grommet';
import {CircleInformation, Hide, View} from 'grommet-icons';
import {deepMerge} from "grommet/utils";
import image from './utils/images/image.jpg';
import './index.css';

const error = 'Internal server error';

class Login extends Component {
    state = {
        username: '',
        password: '',
        message: null,
        reveal: false,
    };

    loginSuccess = this.props.loginSuccess;
    setUser = this.props.setUser;
    setToken = this.props.setToken;

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    };

    onSubmit = e => {
        e.preventDefault();
        const {username, password} = this.state;
        console.log(`Submit ${username} ${password}`);
        const user = {
            username,
            password
        };
        localStorage.setItem('USERNAME', username);
        this.login(user);
    };

    login(user) {
        console.log('user');
        const  { username, password } = user;

        if (username === '' || password === ''){
            this.setState({message: 'Invalid data.'});
        } else {
            // perform fetch for login
            const url_api = 'http://localhost:8092/urest/v1/login';
            console.log(`Sending request: ${url_api}`);

            fetch(url_api,{
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
                        this.setUser(username);
                        this.setToken(data.token)
                        this.loginSuccess();
                    } else {
                        console.log(api_error);
                    }
                }).catch((err) => {
                console.log(`Error API call: ${err}`);
            });
        }
    }

    setReveal = (value) => {
        this.setState({reveal: value});
    };

    render() {
        const {reveal} = this.state;
        return (
            <Grommet theme={deepMerge(grommet, customFormFieldTheme)}>
                <Box  style={{height:'720px'}}>
                    <Box width='100%' height='100%' direction="row" 
                        style={{display:'flex',justifyContent: 'flex-start'}}>
                        
                        <Box className="photo" style={{width:'50%'}}>
                            <h1 style={{color:"#2E8B57",textAlign:'center', marginTop: '15%',fontSize: '50px'}}>WELCOME !</h1>
                            <img src={image} alt="Image" style={{width: '65%',margin: '25% auto 0 auto'}}/>;
                        </Box>
                        <Box   style= {{backgroundColor:"#2E8B57",width:'50%'}}>
                            <Box className='loginForm'
                            style= {{
                                position: 'relative',
                                top: '0%',
                                left: '0%',
                                transform: 'translate(0%, 0%)',
                                margin: 'auto',
                                height:'450px'
                            }}
                            > 
                                <Form onSubmit={this.onSubmit} style={{width:'100%'}}>
                                    <Box align='center'>
                                        <h1 style={{fontSize:"35px",fontWeight:"700px"}}>SIGN IN</h1>
                                    </Box>
                                    <Box align='center' margin='medium'>
                                       
                                        <FormField label="Username" style={{marginBottom:"40px", width: '100%'}}>
                                            <TextInput
                                                name='username'
                                                id='email'
                                                plain
                                                placeholder='Username'
                                                type='text'
                                                onChange={this.onChange}
                                                style={{borderBottom: '1px solid gray',borderRadius: '0'}}
                                            />
                                        </FormField>

                                         <FormField label="Password"  style={{marginBottom:"30px", width: '100%'}}>
                                            <TextInput
                                                name='password'
                                                id='password'
                                                plain
                                                type={reveal ? 'text' : 'password'}
                                                placeholder='Password'
                                                onChange={this.onChange}
                                                style={{borderBottom: '1px solid gray',borderRadius: '0'}}
                                            />
                                            <Button
                                                style={{background:'none'}}
                                                icon={reveal ? <View size="medium"/> : <Hide size="medium"/>}
                                                onClick={() => this.setReveal(!reveal)}
                                            />
                                        </FormField>
                                        {this.state.message && (
                                            <Box style={{alignSelf: 'start', flexDirection: 'row', display: 'flex'}}>
                                                <CircleInformation className='infoIcon'/>
                                                <span
                                                    style={{color: '#d50000', fontSize: '13px'}}>{this.state.message}</span>
                                            </Box>
                                        )}
                                        <Box align="center">
                                            <Button
                                                className='submitButton' type='submit' style={{backgroundColor:'#5464f2',color:'white'}}>Login</Button>
                                        </Box>
                                    </Box>
                                </Form>
                            </Box>
                        </Box>
                      
                    </Box>
                </Box>
            </Grommet>
        )
    }
}

const customFormFieldTheme = {
    global: {
        font: {
            size: "16px"
        }
    },
    box: {
        alignItems: 'center'
    },
    formField: {
        label: {
            size: "xsmall",
            margin: {vertical: "0", bottom: "small", horizontal: "0"},
            weight: 600
        },
        border: false,
        margin: 0,
        width: 400
    }
};

export default Login;
