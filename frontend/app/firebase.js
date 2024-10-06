import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDt_r3VvIt6scFrBRCEKKm67fNtqAbrloA",
    authDomain: "farbricaepatterns.firebaseapp.com",
    projectId: "farbricaepatterns",
    storageBucket: "farbricaepatterns.appspot.com",
    messagingSenderId: "483087398278",
    appId: "1:483087398278:web:6cb0d82ab9d6315e08e807",
    measurementId: "G-M2ECYEJNRV"
  };

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
