import { useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { firestore } from "../../firebaseConfig";
import StatesContext from "../../commons/StatesContext";

function Login(props) {

  // 아이디 비밀번호 저장 상태훅
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');

  // 로그인후 홈화면으로 가기위한 내비게이션
  const navigate = useNavigate();

  // 유저의 정보를 저장하기 위한 훅
  const [showData, setShowData] = useState([]);
  
  // 세션스토리지 설정후 렌더링을 위한 훅
  const { rendering, setRendering } = useContext(StatesContext);

  // 데이터 불러오기
  const getCollection = async () => {

    let trArray = [];

    // 컬렉션명으로 하위 도큐먼트를 읽어온다.
    const querySnapshot = await getDocs(collection(firestore, "members"));

    // 배열로 얻어온 도큐먼트의 갯수만큼 반복
    querySnapshot.forEach((doc) => {

      // console.log(doc.id, '=>', doc.data());
      /* 
      콜백된 객체(doc)를 기반으로 data()함수를 호출하여 실제데이터 얻기
      */
      let memberInfo = doc.data();
      // console.log('파싱', doc.id, memberInfo.pass, memberInfo.name,
      //   memberInfo.regdate);

      // tr태그로 출력할 항목 구성
      trArray.push({
        id: memberInfo.id,
        pass: memberInfo.pass,
        name: memberInfo.name
      });
    });
    // 파싱된 데이터를 통해 스테이트 변경 및 리렌더링
    setShowData(trArray);
  };

  useEffect(() => {
    getCollection();
  }, [])

  function loginCheck() {
    let ok = false;
    for (let i = 0; i < showData.length; i++) {
      if (id === showData[i].id && pass === showData[i].pass) {
        sessionStorage.setItem('islogined', JSON.stringify({ id: id, name: showData[i].name }));
        setRendering(!rendering);
        navigate('/');
        ok = true;
        break;
      }
    }
    if (!ok) {
      alert('아이디나 비밀번호가 틀립니다.');
      setPass('');
    }
  }

  return (<>
    <div className="login-container">
      <h2 className="login-title">로그인</h2>
      <form className="login-form" onSubmit={(e) => {
        e.preventDefault();
        loginCheck();
      }}>
        <div className="login-field">
          <label htmlFor="username">아이디</label>
          <input type="text" id="username" name="username" required
            onChange={(e) => { setId(e.target.value) }} value={id} />
        </div>
        <div className="login-field">
          <label htmlFor="password">패스워드</label>
          <input type="password" id="password" name="password" required
            onChange={(e) => { setPass(e.target.value) }} value={pass} />
        </div>
        <div className="login-button-wrapper">
          <button type="submit" className="login-button">로그인</button>
        </div>
        <div className="login-links">
          <a href="#">아이디/비밀번호 찾기</a>
          <span>|</span>
          <a href="#/signup">회원가입</a>
        </div>
      </form>
    </div>
  </>);
}
export default Login;