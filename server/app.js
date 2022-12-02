const cors = require('cors');
const express = require('express');
const independent = require('./independent');
const stack = require('./stack');

const PORT = 8496;
const app = express();

// General app settings
const set_content_type = function (req, res, next) 
{
	res.setHeader("Content-Type", "application/json; charset=utf-8");
	next()
}

app.use(cors());
app.options('*', cors());
app.use( set_content_type );
app.use(express.json());  // to support JSON-encoded bodies
app.use(express.urlencoded( // to support URL-encoded bodies
{  
  extended: true
}));

app.use('/independent', independent);
app.use('/stack', stack);

let msg = `Server listening at port ${PORT}`
app.listen(PORT, () => { console.log( msg ) ; });