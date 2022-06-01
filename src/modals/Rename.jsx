import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Form, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import useAuth from '../hooks/index.jsx';
import validate from './validationSchema.jsx';
import { selectChannels } from '../slices/channelsSlice';

function Rename(props) {
  const { onHide, modalInfo } = props;
  const { channelInfo } = modalInfo;
  const auth = useAuth();
  const channels = useSelector(selectChannels);
  const channelNames = channels.map((c) => c.name);

  const formik = useFormik({
    initialValues: { name: channelInfo.name },
    validationSchema: validate(channelNames),
    onSubmit: (e) => {
      auth.socket.emit('renameChannel', { name: e.name, id: channelInfo.id }, (response) => {
        console.log(`канал переименован: ${response.status}`);
      });
      onHide();
      formik.values.name = '';
    },
  });

  const elRef = useCallback((node) => {
    if (node !== null) {
      node.focus();
    }
  }, []);

  return (
    <Modal show onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Rename</Modal.Title>
        <button type="button" className="btn-close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group className="form-group mb-3">
            <Form.Control
              ref={elRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={formik.errors.name && formik.touched.name}
              className="form-control"
              data-testid="input-body"
              name="name"
              required=""
            />
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-end">
            <button className="btn btn-warning me-2" onClick={onHide} type="button">Отменить</button>
            <button className="btn btn-primary" type="submit">Переименовать</button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Rename;
