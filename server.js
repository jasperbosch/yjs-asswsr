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

const students = [];
const studentsWs = [];
const tutors = [];
const tutorsWs = [];
let tutorWs;

//initialize the WebSocket server instance
const wss = new WebSocket.Server({server});

function noop() {}

function heartbeat() {
  console.log('hartbeat');
  this.isAlive = true;
}

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    if (ws.isAlive === false) return ws.terminate();

    ws.isAlive = false;
    ws.ping(noop);
    console.log('Ping sent');
  });
}, 30000);


let sendTutorMessage = function (message) {
  console.log(message);
  tutorWs.ws.send(message);
};
let sendMessage = function (studentWs, message) {
  console.log(message);
  studentWs.send(message);
};

let updateStudensForTutor = function () {
  if (tutorWs) {
    let message = JSON.stringify({sender: 'server', soort: 'STUDENTS', content: students, isBroadcast: false});
    sendTutorMessage(message);
  }
};

let signOn = function (message, uuid, ws) {
  if (message.content) {
    if (message.content.toUpperCase() === 'TUTOR') {
      let tutor;
      for (let i = 0; i < tutors.length; i++) {
        if (tutors[i].name === message.content) {
          uuid = tutors[i].id;
          tutors[i].connection = 'open';
          tutor = students[i];
          break;
        }
      }
      if (!uuid) {
        uuid = uuidv4();
        tutor = {id: uuid, name: message.content, connection: 'open'};
        tutors.push(tutor);
      }
      sendMessage(ws, JSON.stringify({sender: 'server', soort: 'CONFIRM', content: tutor, isBroadcast: false}));
      tutorWs = {id: uuid, ws: ws};
      tutorsWs.push(tutorWs);
      updateStudensForTutor();
    } else {
      uuid = undefined;
      let student;
      for (let i = 0; i < students.length; i++) {
        if (students[i].name === message.content) {
          uuid = students[i].id;
          students[i].connection = 'open';
          student = students[i];
          break;
        }
      }
      if (!uuid) {
        uuid = uuidv4();
        const answers = [];
        for (let i = 0; i < 12; i++) {
          answers.push({tijd: undefined, answer: undefined});
        }
        student = {id: uuid, name: message.content, connection: 'open', answers: []};
        students.push(student);
      }
      sendMessage(ws, JSON.stringify({sender: 'server', soort: 'CONFIRM', content: student, isBroadcast: false}));
      const studentWs = {id: uuid, ws: ws};
      studentsWs.push(studentWs);
      updateStudensForTutor();
    }
  }
  return uuid;
};

let getUser = function (message, uuid, ws) {
  let student;
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === message.content) {
      uuid = students[i].id;
      students[i].connection = 'open';
      student = students[i];
      // notifier.notify(`found: ${JSON.stringify(student)}`);
      sendMessage(ws, JSON.stringify({sender: 'server', soort: 'CONFIRM', content: student, isBroadcast: false}));
      const studentWs = {id: uuid, ws: ws};
      studentsWs.push(studentWs);
      updateStudensForTutor();
      break;
    }
  }
  if (!student) {
    let tutor;
    for (let i = 0; i < tutors.length; i++) {
      if (tutors[i].id === message.content) {
        uuid = tutors[i].id;
        tutors[i].connection = 'open';
        tutor = tutors[i];
        sendMessage(ws, JSON.stringify({sender: 'server', soort: 'CONFIRM', content: tutor, isBroadcast: false}));
        tutorWs = {id: uuid, ws: ws};
        tutorsWs.push(tutorWs);
        updateStudensForTutor();
        break;
      }
    }
    if (!tutor) {
      sendMessage(ws, JSON.stringify({sender: 'server', soort: 'USERINPUT', content: '', isBroadcast: false}));
    }
  }
  return uuid;
};

let start = function (message) {
  const opdracht = message.content;
  for (let i = 0; i < studentsWs.length; i++) {
    studentsWs[i].ws.send(JSON.stringify({sender: 'server', soort: 'START', content: opdracht, isBroadcast: false}))
    sendMessage(studentsWs[i].ws, JSON.stringify({
      sender: 'server',
      soort: 'START',
      content: opdracht,
      isBroadcast: false
    }))
  }
};

let sStart = function (message) {
  const uuid2 = message.sender;
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === uuid2) {
      students[i].currPage = message.content;
      updateStudensForTutor();
    }
  }
};


let answer = function (message) {
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === message.sender) {
      const opdrachtNr = message.content.opdrachtNr;
      const answer = {tijd: message.content.tijd, answer: message.content.answer};
      students[i].answers[opdrachtNr] = answer;
      updateStudensForTutor();
      break;
    }
  }
};

let resetAll = function () {
  for (let i = 0; i < studentsWs.length; i++) {
    sendMessage(studentsWs[i].ws, JSON.stringify({sender: 'server', soort: 'START', content: -1, isBroadcast: false}))
  }
  students.splice(0, students.length);
  studentsWs.splice(0, students.length);
  updateStudensForTutor();
};

let removeStudent = function (message) {
  for (let i = 0; i < students.length; i++) {
    if (students[i].id === message.content.id) {
      sendMessage(studentsWs[i].ws, JSON.stringify({sender: 'server', soort: 'START', content: -1, isBroadcast: false}))
      students.splice(i, 1);
      studentsWs.splice(i, 1);
      updateStudensForTutor();
      break;
    }
  }
};

let removeTutor = function (message) {
  if (message.sender === 'tutor') {
    resetAll();
    for (let i = 0; i < tutorsWs.length; i++) {
      sendMessage(tutorsWs[i].ws, JSON.stringify({sender: 'server', soort: 'START', content: -1, isBroadcast: false}))
    }
    tutors.splice(0, students.length);
    tutorsWs.splice(0, students.length);
    tutorWs = undefined;
  } else {
    for (let i = 0; i < students.length; i++) {
      if (students[i].name === message.sender) {
        sendMessage(studentsWs[i].ws, JSON.stringify({
          sender: 'server',
          soort: 'START',
          content: -1,
          isBroadcast: false
        }))
        students.splice(i, 1);
        studentsWs.splice(i, 1);
        updateStudensForTutor();
        break;
      }
    }

  }
};

wss.on('connection', (ws) => {
  // notifier.notify(`Made a connection!`);

  ws.isAlive = true;
  ws.on('pong', heartbeat);

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
        uuid = getUser(message, uuid, ws);
        break;
      case "START":
        start(message);
        break;
      case 'SSTART':
        sStart(message);
        break;
      case 'ANSWER':
        answer(message);
        break;
      case 'RESETALL':
        resetAll();
        break;
      case 'REMOVE':
        removeStudent(message);
        break;
      case 'EXIT':
        removeTutor(message);
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
    for (let i = 0; i < students.length; i++) {
      if (students[i].id === uuid) {
        students[i].connection = 'closed';
        for (let j = 0; j < studentsWs.length; j++) {
          if (studentsWs[j].id === students[i].id) {
            studentsWs.splice(j, 1);
            break;
          }
        }
        updateStudensForTutor();
        break;
      }
    }
    uuid = undefined;
  });

  //send immediatly a feedback to the incoming connection
  const message = 'Hi there, I am a WebSocket server'
  sendMessage(ws, JSON.stringify(message));
});

wss.on('close', function close() {
  clearInterval(interval);
});


app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});


// Start the app by listening on the default Heroku port
const port = process.env.PORT || 8080;

server.listen(port, () => {
  // notifier.notify(`Server listening on port ${port}`);
});
