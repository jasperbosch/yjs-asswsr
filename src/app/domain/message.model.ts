export class Message {
  constructor(
    public sender: string,
    public soort: string,
    public content: any,
    public isBroadcast = false,
  ) {
  }
}
