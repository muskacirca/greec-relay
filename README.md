# How To Make This Work

````
npm install

npm run update-schema

npm run build

// for heroku user (may be just download the cli)

heroku local web

heroku local worker

````

then open localhost:3000 in browser

# Step 0
## init simple react application

We're gonna add a simple node server using express that will listen on the 3000 port

````
npm install -S express
````

We're gonna use babel to transpile our es6 javascript code to es5
````
npm install --save-dev babel-cli babel-preset-es2015
````

We also need to add a .babelrc file that is the configuration file for babel. We tell him to use the es2015 (or es6) presets and to ignore all files in the node_modules directory.
````
{
  "presets": ["es2015"],
  "ignore": ["/node_modules/"]
}
````

We also have to add a .babelrc file that will contains babel configuration

````
npm install --save-dev babel-cli babel-preset-es2015
````


Then we'll build our code. The following line call a script define in the package.json file. It will create es5 code in our lib library
````
npm run build
````

To start your application run the following
````
npm start
````

# Step 1
## Add react baby

It all start with a little npm install
````
npm i -S react react-dom fs
npm i --save-dev babel-preset-react
````

babel-preset-react will be used to understand react special syntax, we also need to modify our .babelrc file
````
{
  "presets": ["es2015", "react"],
  "ignore": ["/node_modules/"]
}
````

fs will be used to read our new index.html
