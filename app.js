const express = require('express');
const app = express();



const port = 3000



app.use((req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Connect-Type', 'Authorization');
    next();
});


app.get('/', (req, res) => {



})



app.listen(port, () =>
    console.log(`Example app listening on port ${port}!`));