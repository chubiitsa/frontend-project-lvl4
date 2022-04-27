import React, { useEffect } from 'react';
import {
  Container, Row, Col, ListGroup, Form, Button,
} from 'react-bootstrap';
import { useSelector, useDispatch, batch } from 'react-redux';
import axios from 'axios';
import { actions as channelActions, selectChannels } from './slices/channelsSlice.js';
import { actions as messageActions, selectMessages } from './slices/messagesSlice.js';

function Channels() {
  const channels = useSelector(selectChannels);
  return (
    <ListGroup className="mt-3">
      {channels.map((channel) => (
        <ListGroup.Item key={channel.id}>{channel.name}</ListGroup.Item>
      ))}
    </ListGroup>
  );
}

function Messages() {
  const messages = useSelector(selectMessages);
  return (
    <ul className="mt-3">
      {messages.map((message) => (
        <p key={message.id}>{message.name}</p>
      ))}
    </ul>
  );
}

export default function Chat() {
  const dispatch = useDispatch();
  const userId = JSON.parse(localStorage.getItem('userId'));

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
  });

  return (
    <Container className="rounded shadow">
      <Row className="justify-content-md-center">
        <Col className="bg-light pt-3 pb-3">
          <h3>
            Каналы
          </h3>
          <Channels />
        </Col>
        <Col className="h-100 pt-3 pb-3" xs={8}>
          <Row><h3>Сообщения</h3></Row>
          <Row>
            <Messages />
          </Row>
          <Row>
            <Col>
              <Form>
                <Form.Group>
                  <Form.Control type="text" placeholder="Введите ваше сообщение" />
                </Form.Group>
              </Form>
            </Col>
            <Col md="auto">
              <Button variant="primary btn btn-group-vertical" type="submit">
                Отправить
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
