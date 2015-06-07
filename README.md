Gold Team
---------
| Name             | Role                          |
| ---------------- | ----------------------------- |
|Annie Chen        |     Team Lead/Project Manager |
|Alex Luu          |     Business Analyst          |
|Jessica Yang      |     Business Analyst          |
|Eric Cheng        |     Architect                 |
|Rodrigo Manzano   |     Architect                 |
|Galen Krulce      |     Technical Lead            |
|Dylan Pereira     |     Technical Lead            |
|Emily Shung       |     UI Designer               |
|Hilary Louie      |     UI Designer               |
|Paul Wallace      |	 Tester/Quality Assurance  |
|Richard Zheng     |     Tester/Quality Assurance  |

Project
-------
1. Name: Triton Battles
2. Description: A web application for students can go to create flashcards,
   study, and compete with each other.

Technologies
------------
1. NodeJS
2. ExpressJS
3. MongoDB
4. HTML
5. AngularJS

*Testing Frameworkc*
-------------------
We are using Jasmine to write our unit tests and Karma as the framework to run the tests.
Instructions to run tests:
	1. Install node 
	2. Run the command: npm install -g karma-cli (IF UNSUCCESSFUL RUN command with sudo[sudo npm install...])
	3. Run the command: karma start my.conf.js
	4. A chrome window will pop up and the results of the tests we wrote will show in the console
	Note: Our tests are in test_front_end.js and test_back_end.js


To Test
-------
If you are on Ubuntu you should be able to navigate to the top folder and execute 'sudo bash dev/ubuntu' and it should setup your installation to run the mongo service, nodejs server, and connect to it.

If anyone else actually uses Arch Linux and gets stuck, message me and I can write you a setup script.

If enough people are having trouble with getting things up and running on Mac I'm sure I can write something for that as well, although I never use Mac operating systems.

As of now, if you aren't developing on Ubuntu, follow these general instructions:
Install mongo, have the mongod service running. Run node server.js in the main directory, and then connect to localhost:9097 in your browser. Alternatively, you can communicate with the server as long as node is running by sending the proper http requests to the node webserver. If you use Google Chrome, Postman is a great tool, and for firefox(go open source!) I recommend HttpRequester. I haven't documented how the encoded http requests need to look as of yet, so you would have to glance at the handlers in server.js to see what they should look like.

Windows Installation: 

1) GitHub: Install GitHub for Windows. Open Git Shell. Type in 'git clone git@git.ucsd.edu:dpereira/gold-team.git' for SSH or 'git clone https://git.ucsd.edu/dpereira/gold-team.git' for HTTPS. Open the program 'GitHub'. On the upper left hand corner click the '+', navigate to 'Add' and 'Browse' for the directory that was cloned. You can then develop the files locally on Windows.
	-When you make a change, GitHub will tell you to add comments to commit.
	-To push, just press 'Sync' on the upper right hand corner.

2) MongoDB: Install MongoDB from the website. Navigate to C:\Program Files\MongoDB\Server\3.1\bin. Start mongod.exe and then start mongo.exe to connect to the server.

3) NodeJS: Install NodeJS. Open the "Node.js command prompt". We will then install modules to work with MongoDB and ExpressJS. Run the next two commands.
	-npm install express --save		\\ will install expressJS
	-npm install mongodb			\\ will install MongoDB
	-npm install mongoose           \\ will install MongooseJS

What I've Done So Far (4/14/2015)
---------------------------------
I have a [mongo database](http://www.mongodb.com/) set up that accepts connections on the default port. Then, I have an instance of [nodejs](https://nodejs.org/) as the webserver, using [express](http://expressjs.com/) to do request handling and serve as a framework, with [mongoose](http://mongoosejs.com/) to make communicating with the database simple and easy. These are the major components that are currently in place. The plan would be to use angular for UI and pretty much everything visual. I use a myriad of other tools like [morgan](https://github.com/expressjs/morgan) for logging the http requests, [body-parser](https://github.com/expressjs/body-parser) to parse json and encoded http requests, and a number of others. The package.json file is a nice list of what is being used or what is planned on being used. I wrote this mostly just to showcase the MEAN stack (well MEN for now), and how quickly you can have functional software developed with it. I didn't expect it to become the official git for anything and all of these technology and design choices are up for discussion still. As a result, everything is a bit haphazard at the moment and wasn't set up for use by others so please excuse poor style and all that kind of stuff.

If these are the technologies we do decide to use then it is important for everyone to learn javascript as it is pretty much the only language when using a MEAN stack. If you do not know javascript I recommend going online and reading through some tutorials or textbooks on it. Node is pretty fragile and some simple errors can spell disaster for the webserver so you are doing the group a big disservice to start working on the project without knowing javascript at a competent level. (In Node, a single exception in the wrong place can crash the whole server, and make debugging difficult) For our UI people, Angular will be the name of the game and so make sure you are comfortable with that. This is all assuming we stick with these technologies.

I don't know enough about any javascript tutorials that I could recommend, but the way I learned was by reading one of the books found [here](http://freetechbooks.com/javascript-f68.html). I'm a huge fan of the website and I have rarely found a book there that I didn't learn a wealth of useful information from so I highly recommend it.

What I've Done So Far (4/20/2015)
---------------------------------
The backend for pretty much everything except leaderboards is taken care of. I have created a completely functional local registration/login system with fairly basic username/email/password validation as well as password hashing. Google sign in is complete and fully functional. All of the backend structure is there to get individual cards, get lists of cards by executing search queries, get individual decks by id, get a list of cards by providing a deck, updating user information (only by that user while they are logged in), and everything else I could think of (except leaderboards which I'm currently comparing a few options for their implementation for). Most, if not all, of these functions are fairly basic and I will be iterating over them a few times making improvements, commenting thoroughly, adding additional checks and verification functions, and just generally improving the quality of the code. Where we go from here is into front end development. We need to get a basic page layout going, and writing javascript functions that make AJAX calls to the server to determine the dynamic content of the pages. I have already written a small number of these for my own use in testing that can be found in search.js and create.js. It is most important to get the functionality down for the more critical pages and then as the functionality is developed, resources can be allocated to fleshing out the appearance and design elements.

I have been serving a static HTML page through '/' and dynamically serving the login and register pages using the jade template engine. This has just been for convenience and I would personally like to switch to using plain HTML (along with CSS libraries like bootstrap along with our own CSS elements) and javascript (we would probably use jQuery as part of this) to handle all of the dynamic elements of the page. Ultimately, it is up to the group, but in my opinion this is the simplest option.
