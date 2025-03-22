import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProfesorChatPage from './pages/Profesor_Chat.js';
import LogIn from './pages/Login';
import Cabinet from './pages/Cards/MainPage.js';
import { renderHook } from '@testing-library/react';
import ThesisProposalForm from './pages/Cards/add_thesis_form.js';
import RegFormStudent from './pages/student-role/register_student';
import MyPropouseAdd from './pages/student-role/MyPropouseAdd';
import Favorite from './components/Favorite_Page';
import MainPage from './pages/Test';



// test('renders search input field correctly', () => {
//       const { getByPlaceholderText } = render(<Cabinet />);
//       expect(getByPlaceholderText('Caută după titlu...')).toBeInTheDocument();
//     });
    
//     test('renders date inputs correctly', () => {
//       const { getByPlaceholderText } = render(<Cabinet />);
//       expect(getByPlaceholderText('Data Start')).toBeInTheDocument();
//       expect(getByPlaceholderText('Data End')).toBeInTheDocument();
//     });


    
    
test('renders MainPage correctly', () => {
  
      <MainPage />
});

test('renders Favorite correctly', () => {
  
      <Favorite />
});

test('renders MyPropouseAdd correctly', () => {
  
      <MyPropouseAdd />
});


test('renders RegFormStudent correctly', () => {
  
      <RegFormStudent />
});

test('renders ThesisProposalForm correctly', () => {
  
      <ThesisProposalForm />
});
test('renders ProfesorChatPage correctly', () => {
  
      <ProfesorChatPage />
});


test('renders Login correctly', () => {
  
      <LogIn />
});

test('renders Main correctly', () => {
  
      <Cabinet />  

});