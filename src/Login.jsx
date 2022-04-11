import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
  nickname: yup.string().required(),
  password: yup.number().required().positive().integer(),
});

function SignInForm() {
  const formik = useFormik({
    initialValues: { nickname: '', password: '' },
    validationSchema,
    onSubmit: (e) => console.log(e),
  });
  return (
    <div>
      <h1 className="text-center mb-4">Войти в чат</h1>
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label className="form-label" htmlFor="nickname">
            Ваш ник
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.nickname}
              id="nickname"
              className={
                formik.errors.nickname && formik.touched.nickname
                  ? 'form-control is-invalid'
                  : 'form-control'
              }
              type="text"
              name="nickname"
              autoComplete="username"
              required
            />
            {formik.errors.nickname && formik.touched.nickname && (
              <div className="invalid-feedback">{formik.errors.nickname}</div>
            )}
          </label>
        </div>
        <div className="mb-4">
          <label className="form-label" htmlFor="password">
            Пароль
            <input
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={
                formik.errors.password && formik.touched.password
                  ? 'form-control is-invalid'
                  : 'form-control'
              }
              type="password"
              name="password"
              autoComplete="current-password"
              id="password"
              required
            />
            {formik.errors.password && formik.touched.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </label>
        </div>
        <button type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div>
      <p>You must log in to chat</p>
      <div>
        <SignInForm />
      </div>
    </div>
  );
}
