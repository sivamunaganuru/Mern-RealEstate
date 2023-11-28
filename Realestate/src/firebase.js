// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-myestate.firebaseapp.com",
  projectId: "mern-myestate",
  storageBucket: "mern-myestate.appspot.com",
  messagingSenderId: "957510633399",
  appId: "1:957510633399:web:36d0afb520d25cb1e0ca32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write:if
//       request.resource.size < 2*1024*1024 &&
//       request.resource.contentType.matches('image/.*')
//     }
//   }
// }

export default app;