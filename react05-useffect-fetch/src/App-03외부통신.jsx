import { useEffect, useState } from "react";

function MyCommunication(props) {

  /* 외부 서버의 API를 얻어오기 위해 스테이트를 생성한다.
  초기값은 JSON의 포맷에 따라 달라질 수 있으므로 확인 후 설정한다. */
  var [myJSON, setMyJSON] = useState({results: []});

  // 해당 컴포넌트의 1차 렌더링 후 API의 정보를 얻어온다.
  useEffect(function() {
    // API 서버에서 10명의 정보를 JSON으로 인출한다.
    fetch("https://api.randomuser.me?results=10")
      .then((result) => {
        // console.log(result);
        return result.json();
      })
      .then((json) => {
        console.log(json);
        // 인출한 데이터로 스테이트를 변경한다.
        setMyJSON(json);
      });
    return () => {
      console.log('#Life', 'useEffect실행 ==> 컴포넌트 언마운트');
    }
  }, []);
  /* 의존성 배열에는 빈배열을 설정하여, 최초 한번만 실행한다. */

  let trTag = [];
  
  // 결과데이터의 갯수만큼 tr태그를 생성한다.
  for(let i = 0 ; i < myJSON.results.length ; i++) {
    let data = myJSON.results[i];
    // console.log(data);
    trTag.push(
      // 반복되는 tr에는 중복되지 않는 key prop 설정
      <tr key={data.login.md5}>
        {/* 사용자의 썸네일 이미지 표시 */}
        <td><img src={data.picture.thumbnail} 
          alt="{data.login.username}"/></td>
        {/* 아이디 클릭시 프롭스로 전달받은 함수를 호출 */}
        <td><a href="/" onClick={(e) => {
          e.preventDefault();
          props.onProfile(data);
        }}>{data.login.username}</a></td>
        <td>{data.name.title} {data.name.first} {data.name.last}</td>
        
        <td>{data.nat}</td>
        <td>{data.email}</td>
      </tr>
    );
  }


  return (
    <div>
      <table border='1'>
        <thead>
          <tr>
            <th>사진</th>
            <th>로그인</th>
            <th>이름</th>
            <th>국가</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>{trTag}</tbody>
      </table>
    </div>
  );
}

function App() {   
  return (<>
      <div className="App">
        <h2>React - 외부서버통신</h2>
        {/* 링크를 클릭하면 정보를 파싱한 문자열을 alert로 출력 */}
        <MyCommunication onProfile={(sData) => {
          console.log(sData);
          /* 백틱 기호를 사용하는 템플릿 리터럴을 통해 줄바꿈시 +기호
          없이 문자열을 연결한다. */
          let info = `전화번호 : ${sData.cell}
          성별 : ${sData.gender}
          username : ${sData.login.username}
          password : ${sData.login.password}`;
          alert(info);
        }}></MyCommunication>
      </div>
  </>);
}

export default App;
