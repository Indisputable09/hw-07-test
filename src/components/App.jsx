import { GlobalStyle } from 'components/GlobalStyle';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import Swal from 'sweetalert2';
import ContactForm from 'components/ContactForm';
import Filter from 'components/Filter';
import ContactList from 'components/ContactList';
import ContactsSection from 'components/Section';
import { Section, Title } from './App.styled';
import { filterChange, getFilterValue } from 'redux/filterSlice';
import {
  useGetContactsQuery,
  useAddContactMutation,
} from 'redux/contactsSlice';

export const App = () => {
  const filterValueReducer = useSelector(getFilterValue);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState(filterValueReducer);
  const [addContact, { isLoading: isPosting }] = useAddContactMutation();
  const { data: contacts } = useGetContactsQuery();

  const handleSubmit = e => {
    e.preventDefault();
    const name = e.target.name.value;
    const phone = e.target.number.value;
    const contactsNames = contacts.find(contact => contact.name === name);
    const contactsNumbers = contacts.find(contact => contact.phone === phone);
    const contact = { id: nanoid(), name, phone };

    if (contactsNames) {
      Swal.fire({
        title: 'Error!',
        text: `Sorry, ${name} is already in your contacts`,
        icon: 'error',
        confirmButtonText: 'Got it',
      });
      return;
    }
    if (contactsNumbers) {
      Swal.fire({
        title: 'Error!',
        text: `Sorry, ${phone} is already in your contacts`,
        icon: 'error',
        confirmButtonText: 'Got it',
      });
      return;
    }
    addContact(contact);
    e.target.reset();
  };

  const handleChangeFilter = e => {
    const inputValue = e.target.value;
    dispatch(filterChange(inputValue));
    setFilter(inputValue);
  };

  const createFilter = () => {
    const normalizedFilterValue = filter.toLocaleLowerCase();
    if (contacts) {
      const filteredContacts = contacts.filter(
        contact =>
          contact.name.toLocaleLowerCase().includes(normalizedFilterValue) ||
          contact.phone.toString().includes(normalizedFilterValue)
      );
      return filteredContacts;
    }
  };

  const filteredContacts = createFilter();

  return (
    <Section>
      <GlobalStyle />
      <div>
        <Title>Phonebook</Title>
        <ContactForm onSubmit={handleSubmit} isPosting={isPosting} />
      </div>
      <ContactsSection title="Contacts">
        <Filter handleChangeFilter={handleChangeFilter} filter={filter} />
        <ContactList filter={filteredContacts} />
      </ContactsSection>
    </Section>
  );
};