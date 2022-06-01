import React, { useCallback } from 'react';
import { Modal, Form } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import useAuth from '../hooks/index.jsx';
import validate from './validationSchema.jsx';
import { selectChannels } from '../slices/channelsSlice';

function Add(props) {
  const { onHide } = props;
  const auth = useAuth();
  const channels = useSelector(selectChannels);
  const channelNames = channels.map((c) => c.name);

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: validate(channelNames),
    onSubmit: (e) => {
      auth.socket.emit('newChannel', { name: e.name }, (response) => {
        console.log(`канал создан: ${response.status}`);
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
        <Modal.Title>Add</Modal.Title>
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
            <button type="button" className="btn btn-warning me-2" aria-label="Close" onClick={onHide}>Отменить</button>
            <button className="btn btn-primary" type="submit">Создать</button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default Add;
