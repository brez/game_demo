Fuzz 2D Game Development Scaffold
-------------------------------------------------------------------------------

features :
- video autoscaling
- mobile optimized HTML/CSS
- swiping disabled on iOS devices
- debug Panel (if #debug)
- default icons
- distribution build
- standalone build for desktop operating systems

## To run distribution

To build, be sure you have [node](http://nodejs.org) installed. Clone the project:

    git clone -b starting_point git@github.com:dtturcotte/game_demo.git

Then in the cloned directory, simply run:

    npm install

You must also have `grunt-cli` installed globally:

    npm install -g grunt-cli

Running the game:

	grunt serve

Run on http://localhost:4400

Debug panel on http://localhost:4400#debug

## Building Release Versions

To build:

    grunt

This will create a `build` directory containing the files that can be uploaded to a server, or packaged into a mobile app.

----

Note that you may have to edit the file `Gruntfile.js` if you need to better dictate the order your files load in. Note how by default the game.js and resources.js are specified in a specific order.
