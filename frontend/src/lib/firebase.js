import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEkI8FfM_tJLbbg40GesrfxOt3f-tnrAk",
  authDomain: "orderion-web.firebaseapp.com",
  projectId: "orderion-web",
  storageBucket: "orderion-web.firebasestorage.app",
  messagingSenderId: "1017660916555",
  appId: "1:1017660916555:web:3c649679029a91380f5ece",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
