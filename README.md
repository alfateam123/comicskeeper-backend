ComicsKeeper
============

Show the world what comics you have in your shelf.

This project is composed by an express-based backend,
and a frontend powered by React.js and Flux.
To serve it in production, we use nginx as reverse proxy and caching web server.

## Deploy - production

To deploy the application, an nginx configuration file
is provided in this project, named `comics.keeper`
**IMPORTANT**: follow "Database Setup" first! 

1. Rename `comics.keeper` to the name of the (sub)domain set for the website
2. Modify the nginx configuration to replace every occurrence of `comics.keeper`
   with your subdomain
3. Modify the nginx configuration to fix the roots paths to point to the folder
   where you've cloned this project.
4. Copy `comics.keeper` to `NGINX_ROOT/sites-enabled`
5. Build the frontend
   ```sh
   # go into the frontend folder
   cd ./comicskeeper-frontend
   # install dependencies
   yarn install
   # generate the production bundle
   yarn build
   # copy the bundle in comicskeeper-backend
   cp -r ./build ../
   ```
6. Start the backend: `NODE_ENV=production node index.js`

## Development

In two different terminals, run

* the backend
  ``` NODE_ENV=development node index.js ```

* the frontend
  ```
  cd /path/to/comicskeeper-frontend
  yarn run start # run create-react-app development server
  ```

## Database Setup

1. Modify the existing `comicskeeper.json` file
2. Make sure you have images in "images"
3. run `node ./createdb.js` in the same folder of `comicskeeper.json`

A new file `comicskeeper.db` should be created.

## Future features / Wishlist

Future stuff I'll build in my spare time. Contributions are very welcome. 

[ ] yeoman generator for nginx configuration
[ ] improve nginx configuration to handle service workers' websockets
[ ] swagger
[ ] add/remove books directly from the interface
[ ] multiuser (unlikely though)

## Notes for images

ImageMagick is a nice command line tool to modify images

### images are horizontal pointing to the left!

Use `magick mogrify -transpose -flop <images>`

### createdb.js is broken! "Stream yields empty buffer"!

`createdb.js` is set to use imagemagick. Please check this
[stackoverflow question](https://stackoverflow.com/questions/35433249/graphicsmagick-tobuffer-stream-yields-empty-buffer).

In case you don't want to use imagemagick but you're fine with
graphicsmagick, please change the require("gm") line to remove
the `.subClass` stuff.
