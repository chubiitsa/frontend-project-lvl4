import { setLocale } from 'yup';
import Add from './Add.jsx';
import Remove from './Remove.jsx';
import Rename from './Rename.jsx';

setLocale({
  mixed: {
    required: 'Пожалуйста, укажите название канала',
    notOneOf: 'Канал с таким именем уже существует',
  },
  string: {
    min: 'Название должно быть длиннее 2х символов',
    max: 'Название должно быть короче 16 символов',
  },
});

const modals = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};

export default (modalName) => modals[modalName];
