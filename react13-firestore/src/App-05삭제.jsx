import { useEffect, useState } from 'react';
import { firestore } from './firestoreConfig';
import { doc, deleteDoc, getDoc, collection, getDocs } from 'firebase/firestore';

function App(props) {
  
  const [showData, setShowData] = useState([]);

  // 기존의 도큐먼트를 불러와서 select태그에 설정
  useEffect(() => {
    const getCollection = async () => {
    
    let trArray = [];

    const querySnapshot = await getDocs(collection(firestore, "members"));

    querySnapshot.forEach((doc) => {
      
      // console.log(doc.id, '=>', doc.data());
      let memberInfo = doc.data();

      trArray.push (
        <option key={doc.id} value={doc.id}>{memberInfo.name}</option>
      );
    });
    return trArray;
  }
  getCollection().then((result) => {
      console.log('result', result);
      setShowData(result);
    });
  }, []);

  // input태그에 설정된 값을 수정하기 위한 스테이트
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [name, setName] = useState('');

  return (<>
    <div className="App">
      <h2>Firebase - Firestore 연동 App</h2>
      <h3>개별 조회 및 삭제하기</h3>
      <form onSubmit={async (event) => {
        event.preventDefault();
        console.log('이벤트', event);
        let id = event.target.id.value;
        console.log('삭제', id);

        if(id === ''){ alert('사용자를 먼저 선택해주세요'); return;}

        /* 
        선택한 아이디로 도큐먼트의 참조를 얻은 후에 deleteDoc 함수를
        실행해서 삭제한다. */ 
        await deleteDoc(doc(firestore, "members", event.target.id.value));
       
          setId('');
          setPass('');
          setName('');
      }}>
        <div className="input-group" id='myForm'>
          <select className='form-control' onChange={async (e) => {
            // select에서 선택한 항목의 데이터를 불러와서 input에 설정
            let user_id = e.target.value;
            // console.log('선택', user_id);
            const docRef = doc(firestore, 'members', user_id);
            const docSnap = await getDoc(docRef);
            if(docSnap.exists()) {
              console.log('document data:', docSnap.data());
              let callData = docSnap.data();
              setId(user_id);
              setPass(callData.pass);
              setName(callData.name);
            }
            else {
              console.log('no such document!');
            }

          }}>
            <option value="">선택하세요</option>
            {showData}
          </select>
          <button type='submit' className='btn btn-danger'>삭제</button>
        </div>
        <table className='table table-bordered'>
          <tbody>
          <tr>
            <td>컬렉션(테이블)</td>
            <td><input type="text" name='collection' value='members'
              className='form-control' /></td>
          </tr>
          <tr>
            <td>아이디(변경불가)</td>
            <td><input type="text" name='id' value={id}
              className='form-control' /></td>
          </tr>
          <tr>
            <td>비밀번호</td>
            <td><input type="text" name='pass' value={pass}
              className='form-control' /></td>
          </tr>
          <tr>
            <td>이름</td>
            <td><input type="text" name='name' value={name}
              className='form-control' /></td>
          </tr>
          </tbody>
        </table>
      </form>
    </div>
  </>); 
}
export default App;
