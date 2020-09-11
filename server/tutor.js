const {v4: uuidv4} = require('uuid');

class Tutor {

  tutors = [];
  tutorsWs = [];
  tutorWs;

  constructor() {
  }

  sendMessage(studentWs, message) {
    console.log(message);
    studentWs.send(message);
  };

  getUser(message, uuid, ws, students) {
    let tutor;
    for (let i = 0; i < this.tutors.length; i++) {
      if (this.tutors[i].id === message.content) {
        uuid = this.tutors[i].id;
        this.tutors[i].connection = 'open';
        tutor = this.tutors[i];
        this.sendMessage(ws, JSON.stringify({sender: 'server', soort: 'CONFIRM', content: tutor, isBroadcast: false}));
        this.tutorWs = {id: uuid, ws: ws};
        this.tutorsWs.push(this.tutorWs);
        this.updateStudensForTutor(students);
        break;
      }
    }
    return tutor;
  }

  sendTutorMessage(message) {
    console.log(message);
    this.tutorWs.ws.send(message);
  };

  updateStudensForTutor(students) {
    if (this.tutorWs) {
      let message = JSON.stringify({sender: 'server', soort: 'STUDENTS', content: students, isBroadcast: false});
      this.sendTutorMessage(message);
    }
  }

  signOn(ws, message, uuid, students) {
    let tutor1;
    for (let i = 0; i < this.tutors.length; i++) {
      if (this.tutors[i].name === message.content) {
        uuid = this.tutors[i].id;
        this.tutors[i].connection = 'open';
        tutor1 = this.tutors[i];
        break;
      }
    }
    if (!uuid) {
      uuid = uuidv4();
      tutor1 = {id: uuid, name: message.content, connection: 'open'};
      this.tutors.push(tutor1);
    }
    this.sendMessage(ws, JSON.stringify({sender: 'server', soort: 'CONFIRM', content: tutor1, isBroadcast: false}));
    this.tutorWs = {id: uuid, ws: ws};
    this.tutorsWs.push(this.tutorWs);
    this.updateStudensForTutor(students);
  }

  resetAll() {
    for (let i = 0; i < this.tutorsWs.length; i++) {
      this.sendMessage(this.tutorsWs[i].ws, JSON.stringify({
        sender: 'server',
        soort: 'START',
        content: -1,
        isBroadcast: false
      }))
    }
    this.tutors.splice(0, this.tutors.length);
    this.tutorsWs.splice(0, this.tutorsWs.length);
    this.tutorWs = undefined;
  }

  close(uuid) {
    for (let i = 0; i < this.tutors.length; i++) {
      if (this.tutors[i].id === uuid) {
        this.tutors[i].connection = 'closed';
        for (let j = 0; j < this.tutorsWs.length; j++) {
          if (this.tutorsWs[j].id === this.tutors[i].id) {
            this.tutorsWs.splice(j, 1);
            break;
          }
        }
        break;
      }
    }
  }

}

module.exports = Tutor;
