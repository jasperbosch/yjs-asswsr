const {v4: uuidv4} = require('uuid');

class Student {

  students = [];
  studentsWs = [];

  tutor;

  constructor(tutor) {
    this.tutor = tutor;
  }

  sendMessage(studentWs, message) {
    console.log(message);
    studentWs.send(message);
  };

  signOn(ws, message) {
    let uuid = undefined;
    let student;
    for (let i = 0; i < this.students.length; i++) {
      if (this.students[i].name === message.content) {
        uuid = this.students[i].id;
        this.students[i].connection = 'open';
        student = this.students[i];
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
      this.students.push(student);
    }
    this.sendMessage(ws, JSON.stringify({sender: 'server', soort: 'CONFIRM', content: student, isBroadcast: false}));
    const studentWs = {id: uuid, ws: ws};
    this.studentsWs.push(studentWs);
    this.tutor.updateStudensForTutor(this.students);
  }

  getStudent(uuid, ws, message) {
    let student;
    for (let i = 0; i < this.students.length; i++) {
      if (this.students[i].id === message.content) {
        uuid = this.students[i].id;
        this.students[i].connection = 'open';
        student = this.students[i];
        // notifier.notify(`found: ${JSON.stringify(student)}`);
        this.sendMessage(ws, JSON.stringify({
          sender: 'server',
          soort: 'CONFIRM',
          content: student,
          isBroadcast: false
        }));
        const studentWs = {id: uuid, ws: ws};
        this.studentsWs.push(studentWs);
        this.tutor.updateStudensForTutor(this.students);
        break;
      }
    }
    return student;
  }

  getUser(message, uuid, ws) {
    let student1 = this.getStudent(uuid, ws, message);
    if (!student1) {
      student1 = this.tutor.getUser(message, uuid, ws, this.students);
      if (!student1) {
        this.sendMessage(ws, JSON.stringify({sender: 'server', soort: 'USERINPUT', content: '', isBroadcast: false}));
      }
    }
    return student1 && student1.uuid;
  }

  answer(message) {
    for (let i = 0; i < this.students.length; i++) {
      if (this.students[i].id === message.sender) {
        const opdrachtNr = message.content.opdrachtNr;
        const answer1 = {tijd: message.content.tijd, answer: message.content.answer};
        this.students[i].answers[opdrachtNr] = answer1;
        this.tutor.updateStudensForTutor(this.students);
        break;
      }
    }
  };


  start(message) {
    const opdracht = message.content;
    for (let i = 0; i < this.studentsWs.length; i++) {
      this.studentsWs[i].ws.send(JSON.stringify({
        sender: 'server',
        soort: 'START',
        content: opdracht,
        isBroadcast: false
      }));
      this.sendMessage(this.studentsWs[i].ws, JSON.stringify({
        sender: 'server',
        soort: 'START',
        content: opdracht,
        isBroadcast: false
      }))
    }
  };

  removeStudent(message) {
    for (let i = 0; i < this.students.length; i++) {
      if (this.students[i].id === message.content.id) {
        this.sendMessage(this.studentsWs[i].ws, JSON.stringify({
          sender: 'server',
          soort: 'START',
          content: -1,
          isBroadcast: false
        }));
        this.students.splice(i, 1);
        this.studentsWs.splice(i, 1);
        this.tutor.updateStudensForTutor(this.students);
        break;
      }
    }
  };


  resetAll() {
    for (let i = 0; i < this.studentsWs.length; i++) {
      this.sendMessage(this.studentsWs[i].ws, JSON.stringify({
        sender: 'server',
        soort: 'START',
        content: -1,
        isBroadcast: false
      }));
    }
    this.students.splice(0, this.students.length);
    this.studentsWs.splice(0, this.students.length);
    this.tutor.updateStudensForTutor(this.students);
  };


  sStart(message) {
    const uuid2 = message.sender;
    for (let i = 0; i < this.students.length; i++) {
      if (this.students[i].id === uuid2) {
        this.students[i].currPage = message.content;
        this.tutor.updateStudensForTutor(this.students);
      }
    }
  };

  close(uuid) {
    for (let i = 0; i < this.students.length; i++) {
      if (this.students[i].id === uuid) {
        this.students[i].connection = 'closed';
        for (let j = 0; j < this.studentsWs.length; j++) {
          if (this.studentsWs[j].id === this.students[i].id) {
            this.studentsWs.splice(j, 1);
            break;
          }
        }
        this.tutor.updateStudensForTutor(this.students);
        break;
      }
    }
  }
}

module.exports = Student;
