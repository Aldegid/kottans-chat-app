export class Messages {
  constructor(selector, usersSelector) {
    this.node = document.querySelector(selector);
  }

  append(username, message) {
    this.node.innerHTML += `${username} ${message}\n`;
  }

  appendSystem(message) {
    this.append(
      `<span style="background-color: salmon; color: #fff; padding: 1px 10px; display: inline-block">system</span>`,
      message
    );
  }

  clear() {
    this.node.innerHTML = '';
  }
}
