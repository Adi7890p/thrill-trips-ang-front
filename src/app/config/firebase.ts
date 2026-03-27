import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdFSXzhGcGKIOLiNtZeHeC60tUpqO8ipk",
  authDomain: "test-angular-d5cec.firebaseapp.com",
  projectId: "test-angular-d5cec",
  storageBucket: "test-angular-d5cec.firebasestorage.app",
  messagingSenderId: "567757530740",
  appId: "1:567757530740:web:cf7676e626d2293d47d321"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
