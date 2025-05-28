import { useEffect, useState } from 'react';
import { firestore } from './firestoreConfig';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';

function App(props) {
  
  // console.log('firestore', firestore);

   const nowDate = () => {
    
    let dateObj = new Date();
    var year = dateObj.getFullYear();
    var month = ("0" + (1 + dateObj.getMonth())).slice(-2);
    var day = ("0" + dateObj.getDate()).slice(-2);

    return year + '-' + month + '-' + day;
  }

  // 도큐먼트 수정 함수
  const memberEdit = async (p_collection, p_id, p_pass, p_name) => {
  
    // 기존 입력함수와 완전히 동일함. 즉 기존 도큐먼트가 있으면 수정됨
    await setDoc(doc(firestore, p_collection, p_id), {
      id: p_id,
      pass: p_pass,
      name: p_name,
      regdate: nowDate(),
    });

    console.log('수정성공');
  }

  // select태그의 내용을 추가하기위한 스테이트
  const [showData, setShowData] = useState([]);

  // 화면의 렌더링이 끝난 후 실행되는 수명주기 함수
  useEffect(() => {

    const getCollection = async () => {
      
      let trArray = [];

      // members 컬렉션 하위의 도큐먼트를 먼저 읽어온다.
      const querySnapshot = await getDocs(collection(firestore, 
        'members'));
      
      // 갯수만큼 반복해서 option 태그 생성
      querySnapshot.forEach((doc) => {

        let memberInfo = doc.data();

        trArray.push(
          // value는 회원아이디, text는 이름 설정
          <option key={doc.id} value={doc.id}>{memberInfo.name}</option>
        );
      });
      return trArray;
    }
    // 함수 호출 후 콜백 데이터를 then절에서 처리
    getCollection().then((result) => {
      console.log('result', result);
      // 스테이트를 변경하면 리렌더링 되면서 option이 추가됨
      setShowData(result);
    });
  }, []);
  /* useEffect의 두번째 인자인 의존성배열을 빈배열로 지정하여 렌더링 후
  딱 한번만 실행되도록 처리 */

  // input에 설정할 스테이트 선언
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');

  return (<>
    <div className="App">
      <h2>Firebase - Firestore 연동 App</h2>
      <h3>개별 조회 및 수정하기</h3>

      {/* 항목을 선택하면 change 이벤트가 발생된다. */}
      <select onChange={async (e) => {
        // 선택 항목의 value를 변수에 저장한다. 즉 아이디를 저장한다.
        let user_id = e.target.value;
        console.log('선택', user_id);

        // 컬렉션명과 도큐먼트(아이디)를 통해 데이터의 참조를 얻어온다.
        const docRef = doc(firestore, "members", user_id);
        // 참조값을 통해 해당 도큐먼트를 얻어온다.
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log('Document data:', docSnap.data());
          // 해당 도큐먼트가 존재하면 데이터를 인출해서..
          let callData = docSnap.data();
          // 각 스테이트를 변경하여 input에 값을 설정한다.
          setId(user_id);
          setPass(callData.pass);
          setName(callData.name);
        }
        else {
          console.log('No such document!');
        }
      }}>
        <option value="">선택하세요</option>
        {showData}
      </select>
      <form onSubmit={(e) => {
        e.preventDefault();

        // submit 이벤트 발생시 폼값을 얻어온다.
        let collection = e.target.collection.value;
        let id = e.target.id.value;
        let pass = e.target.pass.value;
        let name = e.target.name.value;

        // 아이디만 빈값 확인
        if(id === ''){ alert('사용자를 먼저 선택해주세요'); return;}

        // 수정을 위한 함수 호출
        memberEdit(collection, id, pass, name);

        // 수정이 완료되면 입력폼 비우기
        e.target.id.value = '';
        e.target.pass.value = '';
        e.target.name.value = '';
      }}>
        <table className='table table-bordered table-striped'>
          <tr>
            <td>컬렉션(테이블)</td>
            <td><input type="text" name='collection' value='members' />
            </td>
          </tr>
          <tr>
            <td>아이디(변경불가)</td>
            <td><input type="text" name='id' value={id}
              onChange={(event) => {
                setId(event.target.value);
              }} readOnly /></td>
          </tr>
          <tr>
            <td>비밀번호</td>
            <td><input type="text" name='pass' value={pass}
              onChange={(event) => {
                setPass(event.target.value);
              }} /></td>
          </tr>
          <tr>
            <td>이름</td>
            <td><input type="text" name='name' value={name}
              onChange={(event) => {
                setName(event.target.value);
              }} /></td>
          </tr>
        </table>
        <button type='submit'>수정</button>
      </form>
    </div>
  </>); 
}
export default App;
