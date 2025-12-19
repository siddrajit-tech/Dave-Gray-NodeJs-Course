const express = require('express')
const app = express()
const path = require('path');
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents')
const errorHandler = require('./middleware/errorHandler')
const PORT = process.env.PORT || 3500;

//Custom middleware logger

app.use(logger)

//Cross Origin Resource Sharing
//Add your react front end to white list along with dev sites. Remove local when done.
app.use(cors(corsOptions))

// Built in express middlewares
app.use(express.urlencoded({ extended: false }))

//Serving Json data
app.use(express.json())

//Serving static files
app.use(express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use('/employees', require('./routes/api/employees'))

app.use((req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile('/views/404.html', { root: __dirname })
    } else if (req.accepts('json')) {
        res.json({ error: '404 not found' })
    } else{
        res.type('txt').send('404 not found')
    }
    
})

app.use(errorHandler)


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));