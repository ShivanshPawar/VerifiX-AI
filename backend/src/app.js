const express = require('express');



const app = express();

app.get('/', (req, res) => {
    res.send("Default route")
})


module.exports = app;