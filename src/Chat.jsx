import React, { useEffect, useState, useRef } from 'react';
import {
  Container, Row, Col, ListGroup, Form, Button, NavLink,
} from 'react-bootstrap';
import { useSelector, useDispatch, batch } from 'react-redux';
import axios from 'axios';
import { io } from 'socket.io-client';
import { actions as channelActions, selectChannels, selectCurrentChannel } from './slices/channelsSlice.js';
import { actions as messageActions, selectMessages } from './slices/messagesSlice.js';
import AuthStatus from './AuthStatus.jsx';

function Channels() {
  const channels = useSelector(selectChannels);
  return (
    <ListGroup className="mt-3">
      {channels.map((channel) => (
        <ListGroup.Item key={channel.id}><NavLink>{channel.name}</NavLink></ListGroup.Item>
      ))}
    </ListGroup>
  );
}

function Messages() {
  const messages = useSelector(selectMessages);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current.scrollIntoView(true);

  useEffect(scrollToBottom, [messages]);

  return (
    <div className="m-3 overflow-auto h-100" id="messages">
      {messages.map((message) => (
        <p key={message.id}>
          <b>
            {message.userName}
          </b>
          :
          {message.name}
        </p>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

function NewMessageForm(props) {
  const { socket, userId } = props;
  const inputRef = useRef();
  const [text, setText] = useState('');

  useEffect(() => inputRef.current.focus());

  const handleChange = (e) => {
    e.preventDefault();
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket.connected) {
      socket.emit('newMessage', { name: text, userName: userId.username }, (response) => {
        console.log(response.status); // ok
      });
      setText('');
    } else {
      alert('no connection. sorry')
    }

  };

  return (
    <Container className="pt-3 pb-3">
      <Form className="row" onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group>
              <Form.Control
                ref={inputRef}
                type="text"
                placeholder="Введите ваше сообщение"
                value={text}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md="auto">
            <Button variant="primary btn btn-group-vertical" type="submit">
              Отправить
            </Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
}

export default function Chat() {
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem('userId'));
  const currentChannel = useSelector(selectCurrentChannel);
  const socket = io();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('/api/v1/data', { headers: { Authorization: `Bearer ${userId.token}` } });
      const { channels, messages } = data;
      batch(() => {
        dispatch(channelActions.load(channels));
        dispatch(messageActions.load(messages));
      });
    };
    fetchData();
    socket.on('connect', () => console.log('connected'));
  });

  socket.on('newMessage', (msg) => {
    dispatch(messageActions.add(msg));
  });

  return (
    <div className="d-flex flex-column h-100">
      <AuthStatus />
      <Container className="rounded shadow h-100 mt-3 overflow-hidden">
        <Row className="justify-content-md-center h-100">
          <Col className="bg-light pt-3 pb-3">
            <h3>
              Каналы
            </h3>
            <Channels />
          </Col>
          <Col className="h-100 d-flex flex-column" xs={8}>
            <Row className="pt-3 pb-3">
              <strong>
                #
                {currentChannel}
              </strong>
            </Row>
            <Messages />
            <NewMessageForm userId={userId} socket={socket} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
