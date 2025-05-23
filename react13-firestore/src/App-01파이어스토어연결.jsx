// 파이어스토어 객체 임포트
import { firestore } from "./firestoreConfig";
// 새로운 도큐먼트(문서)를 입력하거나 읽을때 사용하는 함수 임포트
import { doc, getDoc, setDoc } from "firebase/firestore";

function App(props) {
  
  // 파이어스토어 연결 확인
  console.log('firestore', firestore);

  // 도큐먼트 추가 함수
  const addMessage = async () => {

    /* 
    컬렉션 : 테이블과 유사함. Korea로 작성
    도큐먼트 : 레코드와 유사함. Seoul로 작성
    하위 데이터는 JS 객체 형식으로 작성하면된다. 테이블처럼 정형화된
    것이 아니므로 원하는데로 객체에 정보를 추가할 수 있다. 
    
    문서추가를 위해 setDoc(도큐먼트정보, 추가할 데이터)와 같은 형식으로
    실행
    */
    await setDoc(doc(firestore, "Korea", "Incheon"), {
    gu: "남동구",
    dong: "구월동",
    hotplace: "롯데백화점",
  });
    console.log('입력성공');
  }

  // 도큐먼트 읽기 함수
  const getMessage = async () => {
    
    // 입력된 컬렉션과 도큐먼트를 통해 문서의 참조를 읽어온다.
    const docRef = doc(firestore, "Korea", "seoul");
    // 참조를 통해 도큐먼트를 얻어온다.
    const docSnap = await getDoc(docRef);

    // 해당 도큐먼트가 존재하면 콘솔에 내용을 출력한다.
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    }
    else {
      console.log('No such document');
    }
  }

  return (<>
    <div className="App">
      <h2>Firebase - Firestore 연동 App</h2>
      <h3>Firebase 연결</h3>
      <input type="button" value="입력" onClick={addMessage}/>
      <input type="button" value="읽기" onClick={getMessage}/>
    </div>
  </>); 
}
export default App;
