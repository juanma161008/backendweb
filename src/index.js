//index.js

import app from "./app.js";

const main =() => {
    app.listen(app.get('port'))
    console.log('la app escucha en el puerto: ',app.get('port'))
}
main()