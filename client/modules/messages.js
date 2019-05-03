export class Messages {
  constructor(selector) {
    this.node = document.querySelector(selector);
  }

  append(username, message, timestamp) {
    this.node.innerHTML += `${username} ${message} <span class='timestamp'>[${timestamp}]</span>\n`;
  }

  appendSystem(message, timestamp) {
    this.append(
      `<span style="background-color: salmon; color: #fff; padding: 1px 10px; display: inline-block">system</span>`,
      message,
      `<span class='timestamp'>${timestamp}</span>`
    );
  }

  clear() {
    this.node.innerHTML = '';
  }
}
