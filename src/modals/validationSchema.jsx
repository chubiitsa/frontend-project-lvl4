import * as yup from 'yup';

const validate = (channels) => yup.object().shape({
  name: yup.string()
    .min(2)
    .max(16)
    .required()
    .notOneOf(channels),
});

export default validate;
