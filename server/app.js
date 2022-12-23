const cors = require('cors');
const express = require('express');
const independent = require('./independent');
const stack = require('./stack');
const logsRout = require('./logsRout');
const { requestLogger } = require('./logger');

const PORT = 9583;
//const PORT = 8496;
const app = express();
app.locals.requestCounter = 0;

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
app.use((req, res, next) => {
	app.locals.requestCounter++;
	
	let meta = {
		resourceName: req.path,
		requestNumber: app.locals.requestCounter,
		httpVerb: req.method,
		duration: 1
	};

	requestLogger.info(`Incoming request | #${meta.requestNumber} | resource: ${meta.resourceName} | HTTP Verb ${meta.httpVerb}`, meta);
	app.locals.timer = Date.now();
	next();
});

app.use('/independent', independent);
app.use('/stack', stack);
app.use('/logs', logsRout);

app.use((req, res, next) => {
	let meta = {
		requestNumber: app.locals.requestCounter
	};

	let now = Date.now();
	requestLogger.debug(`request #${meta.requestNumber} duration: ${now - app.locals.timer}ms`, meta)
	next();
});

let msg = `Server listening at port ${PORT}`
app.listen(PORT, () => { console.log( msg ) ; });