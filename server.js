const Hartbeat = require('./server/hartbeat');
const Student = require('./server/student');
const Tutor = require('./server/tutor');

//Install express server
const express = require('express');
// const notifier = require('node-notifier');
const path = require('path');
const http = require('http');
const WebSocket = require('ws');
const {v4: uuidv4} = require('uuid');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist'));

//initialize a simple http server
const server = http.createServer(app);


//initialize the WebSocket server instance
const wss = new WebSocket.Server({server});
const hartbeat = new Hartbeat(wss);
const tutor = new Tutor();
const student = new Student(tutor);

let sendMessage = function (studentWs, message) {
  console.log(message);
  studentWs.send(message);
};

let signOn = function (message, uuid, ws) {
  if (message.content) {
    if (message.content.toUpperCase() === 'TUTOR') {
      tutor.signOn(ws, message, uuid, student.students);
    } else {
      student.signOn(ws, message);
    }
  }
  return uuid;
};


let removeUser = function (message) {
  if (message.sender === 'tutor') {
    student.resetAll();
    tutor.resetAll();
  } else {
    student.removeStudent(message);
  }
};

wss.on('connection', (ws) => {
  // notifier.notify(`Made a connection!`);

  ws.isAlive = true;
  ws.on('pong', hartbeat.beat);

  let uuid;

  //connection is up, let's add a simple simple event
  ws.on('message', (message) => {

    console.log(message);
    message = JSON.parse(message);

    const echo = `Hello, you sent -> ${message}`;

    switch (message.soort) {
      case 'SIGNON':
        uuid = signOn(message, uuid, ws);
        break;
      case 'GETUSER':
        uuid = student.getUser(message, uuid, ws);
        break;
      case "START":
        student.start(message);
        break;
      case 'SSTART':
        student.sStart(message);
        break;
      case 'ANSWER':
        student.answer(message);
        break;
      case 'RESETALL':
        student.resetAll();
        break;
      case 'REMOVE':
        student.removeStudent(message);
        break;
      case 'EXIT':
        removeUser(message);
        break;
      case 'PONG':
        break;
      default:
      //
    }


    //log the received message and send it back to the client
    // notifier.notify(`received: ${message}`);
    // ws.send(JSON.stringify(echo));
  });


  ws.on('close', () => {
    // notifier.notify(`closed connection for ${uuid}`);
    student.close(uuid);
    tutor.close(uuid);
    uuid = undefined;
  });

  //send immediatly a feedback to the incoming connection
  const message = 'Hi there, I am a WebSocket server'
  sendMessage(ws, JSON.stringify(message));
});

wss.on('close', function close() {
  hartbeat.destroy();
});


app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});


// Start the app by listening on the default Heroku port
const port = process.env.PORT || 8080;

server.listen(port, () => {
  // notifier.notify(`Server listening on port ${port}`);
});
