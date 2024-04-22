// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey:process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "instagram-7f2e5.firebaseapp.com",
  projectId: "instagram-7f2e5",
  storageBucket: "instagram-7f2e5.appspot.com",
  messagingSenderId: "176482430641",
  appId: "1:176482430641:web:dbf38187deb2ab225dbc90"
};

export const app = initializeApp(firebaseConfig);