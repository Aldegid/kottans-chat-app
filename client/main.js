import { UserName } from './modules/user-name.js';
import { Socket } from './modules/socket.js';
import { Messages } from './modules/messages.js';
import { MessageForm } from './modules/message-form.js';
import { UsersList } from './modules/users-list.js';
import { RoomForm } from './modules/room-form.js';
import { Rooms } from './modules/rooms.js';
import { TypingStatus } from './modules/typing-status.js';

document.addEventListener('DOMContentLoaded', () => {
  const socket = new Socket();
  const userName = new UserName('#username');
  const messages = new Messages('#messages', '#userlist');
  const messageForm = new MessageForm('#messageForm');
  const usersList = new UsersList('#userslist');
  const roomForm = new RoomForm('#room');
  const rooms = new Rooms('#rooms');
  const typingStatus = new TypingStatus('#typingStatus');
  let myName;

  socket.onNameAssigned(data => {
    myName = data.name;
    userName.render(data.name);
    messages.appendSystem(
      `<b>${data.name}</b> assigned to you.`,
      data.timestamp
    );
  });

  socket.onUserJoined(data => {
    messages.appendSystem(
      `<span style="color: seagreen"><b>${data.name}</b> joined.</span>`,
      data.timestamp
    );
  });
  socket.onUsersList(username => {
    usersList.render(username);
  });

  socket.onUserLeft(data => {
    messages.appendSystem(
      `<span style="color: red"><b>${data.name}</b> left.</span>`,
      data.timestamp
    );
  });

  messageForm.onSubmit(value => {
    socket.emitChatMessage(value);
  });

  messageForm.onKeypress(() => {
    socket.emitUserTyping();
  });

  socket.onChatMessage(({ name, message, timestamp }) => {
    if (name === myName) {
      timestamp = `${timestamp}`;
      message = `<span style="color: blue">${message}</span>`;
      name = `<span style = "background-color: blue; color: #fff; padding: 1px 10px; display: inline-block">${name}</span>`;
    } else {
      name = `<span style="background-color: #777; color: #fff; padding: 1px 10px; display: inline-block">${name}</span>`;
    }
    messages.append(name, message, timestamp);
  });

  roomForm.onSubmit(room => {
    socket.emitRoomChange(room);
  });

  socket.onRoomChanged(room => {
    rooms.add(room);
    rooms.select(room);
    rooms.render();
    messages.clear();
  });

  socket.onUserTyping(username => {
    typingStatus.addTypingUser(username);
  });
});
