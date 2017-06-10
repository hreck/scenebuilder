# scenebuilder

This is a webapp designed to be used with OPENHAB 2 to easily create Scene-style rules based on the current state of selected items.
In order for this to work, make sure the experimental rule engine is installed in PaperUI.

You need to have Nodes.js installed in order to run this project. After you installed Node.js and npm you can get all the dependencies by running:
    npm install
After that run:
    npm start
To start a webserver serving the app. Unless you are running this on the same machine as openhab you need to add the following line to your Services/services.cfg file in openhabs conf directory.
    org.eclipse.smarthome.cors:enable=true

This is still very much a work in progress so use at your own risk.