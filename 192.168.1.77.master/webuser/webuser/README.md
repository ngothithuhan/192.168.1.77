# FUNDSERV

a [Sails](http://sailsjs.org) + React application
 build test project
  - clone project to local
  - install :npm install
  - start redis
  - start app : npm start or sails lift
  - on brower go to http://localhost:1337                                                                                                                  
  - npm install --save-dev electron-rebuild
  - npm i --save geojsonhint

npm install sails@~0.12.14 --force --save

##### Convert createClass to extends
npm install -g jscodeshift (or yarn global add jscodeshift)
git clone https://github.com/reactjs/react-codemod.git
#Run npm install (or yarn) in the react-codemod directory
#Run jscodeshift -t <codemod-script> <path>
#codemod scripts are under react-codemod/transforms, and <path> should point to a file (or multiple files) in your source code.

jscodeshift -t react-codemod/transforms/class.js webuser/app/**/*.js