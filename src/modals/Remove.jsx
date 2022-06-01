import React from 'react';
import { Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import useAuth from '../hooks/index.jsx';

function Remove(props) {
  const { onHide, modalInfo } = props;
  const { channelInfo } = modalInfo;
  const auth = useAuth();

  const formik = useFormik({
    initialValues: { name: '' },
    onSubmit: () => {
      auth.socket.emit('removeChannel', { id: channelInfo.id }, (response) => {
        console.log(`канал удален: ${response.status}`);
      });
      onHide();
      formik.values.name = '';
    },
  });

  return (
    <Modal show onHide={onHide}>
      <Modal.Header>
        <Modal.Title>Удалить канал</Modal.Title>
        <button type="button" className="btn-close" aria-label="Close" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            Вы уверены, что хотите удалить канал
            {`  ${channelInfo.name}`}
            ?
          </div>
          <div className="d-flex justify-content-end">
            <button className="btn btn-warning me-2" onClick={onHide} type="button">Отменить</button>
            <button className="btn btn-primary" type="submit">Удалить</button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default Remove;
