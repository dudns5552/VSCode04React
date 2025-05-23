// 파이어베이스 서비스에 연결하기 위한 임포트
import { initializeApp } from "firebase/app";
// 파이어스토어 데이터베이스 사용을 위한 임포트
import { getFirestore } from "firebase/firestore";

// .env파일 생성 전
// 파이어베이스 콘솔에서 발급받은 API정보(SDK정보)
// const firebaseConfig = {
//   apiKey: "AIzaSyCCE8vleBx_Y3kutjIWDShUPVpREVQP1aQ",
//   authDomain: "myreactapp-656e4.firebaseapp.com",
//   projectId: "myreactapp-656e4",
//   storageBucket: "myreactapp-656e4.firebasestorage.app",
//   messagingSenderId: "993648102121",
//   appId: "1:993648102121:web:6b848c809f907196e0be78",
//   measurementId: "G-RW44QZ4LS9"
// };

// .env 파일 생성 후
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId
};

// firebase에 연결 후 앱 초기화
const app = initializeApp(firebaseConfig);
// firestore 사용을 위한 객체 생성
const firestore = getFirestore(app);
// 익스포트(내보내기)
export { firestore };