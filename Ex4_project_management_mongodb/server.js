const express = require('express');
const routes = require('./src/routes/routes');
const app = express();
const PORT = 3001;


require(require('path').join(__dirname, 'src', 'db', 'mongoose'));

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
