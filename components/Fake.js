const createRandomUser = require("./createrandomuser");

class Fake {
  constructor() {
    this.fakeObject = {
      status: "ok",
      timestamp: Date.now(),
      messages: [],
    };
    this.intervalId = setInterval(() => {
      const { userId, username, email } = createRandomUser();
      const message = {
        id: userId,
        from: email,
        subject: `Hello from ${username}`,
        body: `Long message body here from ${username}`,
        received: Date.now(),
      };
      this.fakeObject.messages.push(message);
    }, 10000);
  }

  getUnreadMessages() {
    return this.fakeObject;
  }
}

module.exports = Fake;
