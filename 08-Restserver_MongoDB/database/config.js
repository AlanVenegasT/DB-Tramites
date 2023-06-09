const mongoose = require('mongoose');

const dbConnection = async() =>{

    //El trycatch me ayuda a estandarizar los errores de mi programa
    try {
        //Aqui se hace la conexion con la Base de Datos y utilizamos nuestra variable de entorno
        await mongoose.connect( process.env.MONGODB_CNN, {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            // // useCreateIndex: true,
            // // useFindAndModify: false
        });

        console.log('Base de datos online');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }

}

module.exports = {
    dbConnection 
}