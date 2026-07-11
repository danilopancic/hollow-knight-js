import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js';
import {
  doc,
  getFirestore,
  setDoc,
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js';

import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: 'AIzaSyD3sJsDKjz9hapWCXge0gyk7CMwqJmZzfM',
  authDomain: 'project-85570134596.firebaseapp.com',
  projectId: 'project-85570134596',
  storageBucket: 'project-85570134596.firebasestorage.app',
  messagingSenderId: '85570134596',
  appId: '1:85570134596:web:4f53d9748e4a9ed5f8c0c2',
};
// Your web app's Firebase configuration

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

// Initialize Div
const lButtonDiv = $('#loginButton');
const rButtonDiv = $('#registerButton');

const lEmailDiv = $('#loginEmail');
const lPasswordDiv = $('#loginPassword');

const rPasswordDiv = $('#registerPassword');
const rUsernameDiv = $('#registerUsername');
const rLocationDiv = $('#registerLocation');
const rLastNameDiv = $('#registerLastName');
const rFirstNameDiv = $('#registerFirstName');
const rEmailDiv = $('#registerEmail');

const loginAuthMessageDiv = $('#loginAuthMessage');
const registerAuthMessageDiv = $('#registerAuthMessage');

const showAuthMessage = (message, target = 'login') => {
  const targetDiv = target === 'register' ? registerAuthMessageDiv : loginAuthMessageDiv;
  if (targetDiv.length) {
    targetDiv.text(message);
  } else {
    console.error(message);
  }
};

const registerFirebaseAuth = async (data) => {
  try {
    const userCred = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );

    const profileData = {
      username: data.username,
      location: data.location,
      lastName: data.lastName,
      firstName: data.firstName,
      email: data.email,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'users', userCred.user.uid), profileData);
    return true;
  } catch (err) {
    const errCode = err.code;
    const errMessage = err.message;
    return err;
  }
};

const loginFirebaseAuth = async (email, password) => {
  try {
    const resp = await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (err) {
    const errCode = err.code;
    const errMessage = err.message;
    return err;
  }
};

const handleLogin = async () => {
  const email = lEmailDiv.val();
  const password = lPasswordDiv.val();

  if (!email || !password) {
    showAuthMessage('Please enter both email and password.');
    return;
  }

  const response = await loginFirebaseAuth(email, password);
  if (response === true) {
    window.location.replace('./index.html');
  } else {
    showAuthMessage(response?.message || 'Login failed. Please try again.', 'login');
  }
};

const handleRegister = async () => {
  const password = rPasswordDiv.val();
  const username = rUsernameDiv.val();
  const location = rLocationDiv.val();
  const lastName = rLastNameDiv.val();
  const firstName = rFirstNameDiv.val();
  const email = rEmailDiv.val();
  const data = {
    password,
    username,
    location,
    lastName,
    firstName,
    email,
  };
  const response = await registerFirebaseAuth(data);
  if (response === true) {
    showAuthMessage('Registration successful! Check Authentication > Users in Firebase.', 'register');
    setTimeout(() => {
      window.location.replace('./index.html');
    }, 1500);
  } else {
    showAuthMessage(response?.message || 'Registration failed. Please try again.', 'register');
  }
};

lButtonDiv.click(handleLogin);
rButtonDiv.click(handleRegister);

// Initiate Animation
const rFormDiv = $('.register-form');
const lFormDiv = $('.login-form');
const rBtn = $('.register-button');
const lBtn = $('.login-button');
const registerToggleLink = $('.register-toggle-link');
const loginToggleLink = $('.login-toggle-link');

const showRegisterForm = () => {
  lFormDiv.animate({ left: '-100%' }, 1000);
  rFormDiv.animate({ right: '0%' }, 500);
};

const showLoginForm = () => {
  rFormDiv.animate({ right: '-100%' }, 1000);
  lFormDiv.animate({ left: '0%' }, 500);
};

rFormDiv.animate({ right: '-100%' }, 0);

rBtn.click(showRegisterForm);
registerToggleLink.click((event) => {
  event.preventDefault();
  showRegisterForm();
});

lBtn.click(showLoginForm);
loginToggleLink.click((event) => {
  event.preventDefault();
  showLoginForm();
});
