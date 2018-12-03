'use strict'

const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();


app.get('/api', (req, res)=>{
    res.json({
        message:'Welcome to API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authDate)=>{
        if(err){
            res.sendStatus(403);
        }else{
            res.json({
                message:'Post Created',
                authDate
            });
        }
    });
    
});

app.post('/api/login', (req, res)=>{
    // Mock user
    const user = {
        id:1,
        username:'carlos',
        email:'carlosc@gmail.com'
    }
    jwt.sign({user:user}, 'secretkey',{expiresIn:'30s'},(err, token)=>{
        res.json({
            token
        })
    })
});


//Verify token

function verifyToken(req, res, next){
    //Get auth Header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer if undefined
    if(typeof bearerHeader !== 'undefined'){
        //Split at the space
        const bearer = bearerHeader.split(' ');
        // get token from array
        const bearerToken = bearer[1];
        req.token = bearerToken;
        //next middleware
        next();
    } else {
        // forbidden
        res.sendStatus(403);
    }
}

app.listen(5000, ()=> console.log('server started'));