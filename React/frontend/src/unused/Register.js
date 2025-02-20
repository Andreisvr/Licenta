// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link, useLocation } from 'react-router-dom';
// import '/Users/Andrei_Sviridov/Desktop/React/frontend/src/page_css/Register.css';
// import GoogleBtn from '../../components/login_btn';
// import axios from 'axios';

// function Register() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [confirmPasswordError, setConfirmPasswordError] = useState('');
//   const [gmailData, setGmailData] = useState(null);
//   const [name, setName] = useState('');
//   const [isProf, setIsProf] = useState(false); // State for distinguishing professor or student

//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state && location.state.type) {
//       console.log("Tipul de cont selectat:", location.state.type);
//       setIsProf(location.state.type === 'prof'); // Set isProf based on the type
//     }
//   }, [location]);

//   const handleGmailLogin = async (decodedToken) => {
//     setGmailData(decodedToken.name);
//     setEmail(decodedToken.email);
//     setName(`${decodedToken.given_name} ${decodedToken.family_name}`);

//     const values = {
//       email: decodedToken.email,
//       gmail: true,
//       name: `${decodedToken.given_name} ${decodedToken.family_name}`,
//       prof: isProf ? 1 : 0,
//       password: '',
//       verified: false,
//       verify_nr: null,
//     };

//     console.log(values);

//     try {
//       await axios.post("http://localhost:8081/reg", values);
//       // Redirect to /thesis after registration
//       navigate('/login');
//     } catch (error) {
//       console.log("Eroarea la trimiterea datelor la backend:", error);
//     }
//   };

//   const onButtonClick = async () => {
//     setEmailError('');
//     setPasswordError('');
//     setConfirmPasswordError('');

   
//     if (!gmailData) {
//       if (email === '') {
//         setEmailError('Please enter your email');
//         return;
//       }
//       if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
//         setEmailError('Please enter a valid email');
//         return;
//       }
//       if (password === '') {
//         setPasswordError('Please enter a password');
//         return;
//       }
//       if (password.length < 8) {
//         setPasswordError('The password must be 8 characters or longer');
//         return;
//       }
//       if (password !== confirmPassword) {
//         setConfirmPasswordError('Passwords do not match');
//         return;
//       }
//     }

//     const values = {
//       email,
//       password,
//       name: name || email,
//       gmail: false,
//       prof: isProf ? 1 : 0,
//       verified: false,
//       verify_nr: null,
//     };
//     console.log(values);
    
//     try {
//       await axios.post("http://localhost:8081/reg", values);
      
//       navigate('/login');
//     } catch (error) {
//       console.log("Eroarea la trimiterea datelor la backend:", error);
//     }


//     setEmail('');
//     setPassword('');
//     setConfirmPassword('');
//   };

//   return (
//     <div className='body_login'>
//       <form className='form_login'>
//         <h1 className='title'>Register</h1>
//         <br />
//         <div className={'field_container'}>
//           <input
//             value={email}
//             placeholder="Enter your email here"
//             onChange={(ev) => setEmail(ev.target.value)}
//             className={'inputBox'}
//             disabled={!!gmailData} // Disable if Gmail login is used
//           />
//           <label className="errorLabel">{emailError}</label>
//         </div>
//         <br />
//         {!gmailData && (
//           <>
//             <div className={'field_container'}>
//               <input
//                 type="password"
//                 value={password}
//                 placeholder="Enter your password here"
//                 onChange={(ev) => setPassword(ev.target.value)}
//                 className={'inputBox'}
//               />
//               <label className="errorLabel">{passwordError}</label>
//             </div>
//             <br />
//             <div className={'field_container'}>
//               <input
//                 type="password"
//                 value={confirmPassword}
//                 placeholder="Re-enter your password"
//                 onChange={(ev) => setConfirmPassword(ev.target.value)}
//                 className={'inputBox'}
//               />
//               <label className="errorLabel">{confirmPasswordError}</label>
//             </div>
//           </>
//         )}

//         <div className="links_container">
//           <Link className="terms" to="#">Terms and conditions</Link>
//           <Link className="link_register">Help</Link>
//         </div>
//         <br />
//         <div className='google_btn'>
//           <GoogleBtn onSuccessLogin={handleGmailLogin} />
//         </div>
//         <br />
//         <div className={'inputContainer'}>
//           <input className={'Reg_btn'} type="button" onClick={onButtonClick} value={'Register'} />
//         </div>
//       </form>
//     </div>
//   );
// }

// export default Register;
