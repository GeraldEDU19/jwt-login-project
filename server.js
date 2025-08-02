const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const routes = require('./routes');
const middleware = require('./middleware');

const app = express();

// Security middleware
app.use(middleware.helmetConfig);
app.use(middleware.sanitizeInput);
app.use(middleware.validateInput);

// CORS and parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/static', express.static(path.join(__dirname, 'templates')));

// General rate limiting
app.use(middleware.generalLimiter);

// Routes
app.use('/api', routes);

app.get('/', (req, res) => {
    res.send('Hello, World! Visit <a href="/api/users/login">/api/users/login</a> to see the login page');
});

app.use((req, res, next) => {
    console.error('Error 404: Not Found', req.originalUrl);
    res.status(404).json({ error: 'Not Found' });
});

const PORT = config.port;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Visit http://localhost:${PORT}/api/users/login to access the login page`);
});