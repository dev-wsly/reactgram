const mongoose = require('mongoose')

// Connection
const dbUser = process.env.DBUSER
const dbPassword = process.env.DBPASSWORD

const connect = async () => {
    try {
        const dbConnect = await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.2girt0o.mongodb.net/?retryWrites=true&w=majority`)
        console.log('Conectado ao banco MongoDB');
    } catch (error) {
        console.log(error)
    }
}

connect()

module.exports = connect