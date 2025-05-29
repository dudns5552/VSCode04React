import { useContext } from "react";
import { NavLink } from "react-router-dom";
import StatesContext from "../commons/StatesContext";


function logout(setRendering) {
  sessionStorage.removeItem('islogined');
  setRendering(!rendering);
}

function TopNavi(props) {

  const { rendering, setRendering } = useContext(StatesContext);

  const islogined = JSON.parse(sessionStorage.getItem('islogined'));
  return (<>
    <nav>
      <NavLink to="/">Home</NavLink>&nbsp;&nbsp;
      {islogined
        ? (<>
          <NavLink to="/mypage">마이페이지</NavLink>&nbsp;&nbsp;
          <NavLink to="/" onClick={() => logout(setRendering)}>로그아웃</NavLink>&nbsp;&nbsp;
          <span>{islogined.name}님 환영합니다.</span>
        </>)
        : (<>
          <NavLink to="/signup">회원가입</NavLink>&nbsp;&nbsp;
          <NavLink to="/login">로그인</NavLink>
        </>)
      }
    </nav>
  </>);
}
export default TopNavi;