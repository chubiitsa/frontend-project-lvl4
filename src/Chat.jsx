import React, { useEffect, useState, useRef } from 'react';
import {
  Container, Row, Col, ListGroup, Form, Button, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import { useSelector, useDispatch, batch } from 'react-redux';
import axios from 'axios';
import { actions as channelActions, selectChannels, selectCurrentChannelId } from './slices/channelsSlice.js';
import { actions as messageActions, selectMessages } from './slices/messagesSlice.js';
import useAuth from './hooks/index.jsx';
import getModal from './modals/index.js';

const renderModal = ({ modalInfo, hideModal }) => {
  if (!modalInfo.type) {
    return null;
  }

  const Component = getModal(modalInfo.type);
  return <Component modalInfo={modalInfo} onHide={hideModal} />;
};

function Channel(props) {
  const { active, channelInfo, showModal } = props;
  const variant = active ? 'secondary' : 'light';

  const dispatch = useDispatch();
  const handleClick = (e) => {
    e.preventDefault();
    dispatch(channelActions.setCurrentChannel(e.target.id));
  };

  return (
    <Dropdown as={ButtonGroup} className="d-flex dropdown btn-group">
      <Button
        variant={variant}
        className="light w-100 rounded-0 btn-outline-0 text-start text-truncate btn"
        onClick={handleClick}
        id={channelInfo.id}
      >
        {channelInfo.name}
      </Button>
      <Dropdown.Toggle
        variant={variant}
        split
        className="flex-grow-0 rounded-0 dropdown-toggle dropdown-toggle-split btn"
        id="dropdown-split-basic"
        hidden={!channelInfo.removable}
      />
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => showModal('removing', channelInfo)}>Удалить</Dropdown.Item>
        <Dropdown.Item onClick={() => showModal('renaming', channelInfo)}>Переименовать</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}

function Channels() {
  const [modalInfo, setModalInfo] = useState({ type: null, channelInfo: null });
  const showModal = (type, channelInfo = null) => setModalInfo({ type, channelInfo });
  const hideModal = () => setModalInfo({ type: null, channelInfo: null });
  const channels = useSelector(selectChannels);
  const currentChannelId = useSelector(selectCurrentChannelId);

  return (
    <div>
      <div className="d-flex justify-content-between p-2">
        <h3>
          Каналы
        </h3>
        <Button className="btn-group-vertical" onClick={() => showModal('adding')}>Add</Button>
        {renderModal({ modalInfo, hideModal })}
      </div>
      <ListGroup className="mt-2">
        {channels
          .map((channel) => (
            <Channel
              key={channel.id}
              showModal={showModal}
              active={channel.id === currentChannelId}
              channelInfo={channel}
            />
          ))}
      </ListGroup>
    </div>
  );
}

function CurrentChannel() {
  const currentChannelId = useSelector(selectCurrentChannelId);
  const channels = useSelector(selectChannels);
  const currentChannels = channels.filter((channel) => channel.id === currentChannelId);

  return (
    <div className="p-2">
      {currentChannels.map((channel) => (
        <b key={channel.id}>
          {'# '}
          {channel.name}
        </b>
      ))}
    </div>
  );
}

function Messages() {
  const messages = useSelector(selectMessages);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const messagesToShow = messages.filter((msg) => msg.channelId === currentChannelId);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => messagesEndRef.current.scrollIntoView(true);

  useEffect(scrollToBottom);

  return (
    <div className="chat-messages overflow-auto px-5" id="messages">
      {messagesToShow.map((message) => (
        <div key={message.id} className="text-break mb-2">
          <b>
            {message.userName}
          </b>
          {': '}
          {message.body}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

function NewMessageForm(props) {
  const { socket, userId } = props;
  const inputRef = useRef();
  const [text, setText] = useState('');
  const channelId = useSelector(selectCurrentChannelId);

  useEffect(() => inputRef.current.focus());

  const handleChange = (e) => {
    e.preventDefault();
    setText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (socket.connected) {
      socket.emit('newMessage', { body: text, userName: userId.username, channelId }, (response) => {
        console.log(`сообщение добавлено: ${response.status}`); // ok
      });
      setText('');
    } else {
      console.log('no connection. sorry');
    }
  };

  return (
    <Container className="mt-auto px-5 py-3">
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
  const auth = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get('/api/v1/data', { headers: { Authorization: `Bearer ${userId.token}` } });
      batch(() => {
        dispatch(channelActions.load(data));
      });
    };
    fetchData();
    auth.socket.on('connect', () => console.log('connected'));
  });

  auth.socket.on('newMessage', (msg) => {
    dispatch(messageActions.add(msg));
  });

  auth.socket.on('newChannel', (channel) => {
    dispatch(channelActions.addChannel(channel));
    dispatch(channelActions.setCurrentChannel(channel.id));
  });

  auth.socket.on('renameChannel', (channel) => {
    dispatch(channelActions.rename(channel));
    dispatch(channelActions.setCurrentChannel(channel.id));
  });

  auth.socket.on('removeChannel', (channel) => {
    dispatch(channelActions.remove(channel));
    dispatch(channelActions.setCurrentChannel('1'));
  });

  return (
    <Container className="rounded shadow h-100 mt-3 overflow-hidden">
      <Row className="justify-content-md-center h-100">
        <Col className="bg-light col-4 overflow-hidden h-100">
          <Channels socket={auth.socket} />
        </Col>
        <Col className="p-0 h-100">
          <div className="d-flex flex-column h-100">
            <CurrentChannel />
            <Messages />
            <NewMessageForm userId={userId} socket={auth.socket} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
