// src/index.js

import app from "./app.js";

const main = () => {
    app.listen(app.get('port'), () => {
        console.log('La app escucha en el puerto:', app.get('port'));
    });
};
main();
