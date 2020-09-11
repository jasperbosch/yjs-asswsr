class Hartbeat {

  interval;

  constructor(wss) {
    this.init(wss)
  }

  static noop() {
  }

  init(wss) {
    this.interval = setInterval(function ping() {
      wss.clients.forEach(function each(ws) {
        if (ws.isAlive === false) return ws.terminate();

        ws.isAlive = false;
        ws.ping(Hartbeat.noop);
        console.log('Ping sent');
      });
    }, 30000);
  }

  beat() {
    console.log('Hartbeat');
    // this is in dit geval ws
    this.isAlive = true;
  }

  destroy() {
    clearInterval(this.interval);
  }


}

module.exports = Hartbeat;
