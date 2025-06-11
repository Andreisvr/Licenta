import { render } from '@testing-library/react';          // Import render method for component testing
import { BrowserRouter } from 'react-router-dom';          // Import BrowserRouter for routing context in tests
import ProfesorChatPage from './pages/Profesor_Chat.js';   // Import ProfesorChatPage component
import LogIn from './pages/Login';                          // Import Login component
import Cabinet from './pages/Cards/MainPage.js';            // Import Cabinet (main page) component
import { renderHook } from '@testing-library/react';        // Import renderHook for testing custom hooks (not used here)
import ThesisProposalForm from './pages/Cards/add_thesis_form.js';  // Import ThesisProposalForm component
import RegFormStudent from './pages/student-role/register_student'; // Import student registration form component
import MyPropouseAdd from './pages/student-role/MyPropouseAdd';     // Import MyPropouseAdd component
import Favorite from './components/Favorite_Page';          // Import Favorite page/component
import MainPage from './pages/Test';                         // Import MainPage (from Test.js)

// Sample tests commented out that verify input fields in Cabinet component
// test('renders search input field correctly', () => {
//       const { getByPlaceholderText } = render(<Cabinet />);
//       expect(getByPlaceholderText('Caută după titlu...')).toBeInTheDocument();
// });

// test('renders date inputs correctly', () => {
//       const { getByPlaceholderText } = render(<Cabinet />);
//       expect(getByPlaceholderText('Data Start')).toBeInTheDocument();
//       expect(getByPlaceholderText('Data End')).toBeInTheDocument();
// });

// Test to check if MainPage component renders (currently does not call render)
test('renders MainPage correctly', () => {
  <MainPage />
});

// Test to check if Favorite component renders (currently does not call render)
test('renders Favorite correctly', () => {
  <Favorite />
});

// Test to check if MyPropouseAdd component renders (currently does not call render)
test('renders MyPropouseAdd correctly', () => {
  <MyPropouseAdd />
});

// Test to check if RegFormStudent component renders (currently does not call render)
test('renders RegFormStudent correctly', () => {
  <RegFormStudent />
});

// Test to check if ThesisProposalForm component renders (currently does not call render)
test('renders ThesisProposalForm correctly', () => {
  <ThesisProposalForm />
});

// Test to check if ProfesorChatPage component renders (currently does not call render)
test('renders ProfesorChatPage correctly', () => {
  <ProfesorChatPage />
});

// Test to check if Login component renders (currently does not call render)
test('renders Login correctly', () => {
  <LogIn />
});

// Test to check if Cabinet (main) component renders (currently does not call render)
test('renders Main correctly', () => {
  <Cabinet />
});
