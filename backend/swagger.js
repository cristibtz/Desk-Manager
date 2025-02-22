const swaggerAutogen = require('swagger-autogen')()


const doc = {
    info: {
        version: "1.0.0",
        title: "Desk Manager API",
        description: "Desk Manager API Documentation",
    },
    host: "192.168.100.179:3000",
    basePath: "/",
    schemes: ['http'],
    consumes: ['x-www-form-urlencoded'],
    produces: ['application/json'],

}

const outputFile = './swagger-output.json'
const endpointsFiles = ['routes/adminRoutes/adminGetRoutes.js', 
                        'routes/adminRoutes/adminPostRoutes.js', 
                        'routes/adminRoutes/adminDeleteRoutes.js', 

                        'routes/userRoutes/userGetRoutes.js', 
                        'routes/userRoutes/userPostRoutes.js', 
                        'routes/userRoutes/userDeleteRoutes.js', 

                        'routes/publicRoutes/publicGetRoutes.js'
                    ]

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index')           // Your project's root file
})