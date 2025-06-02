import { useContext } from "react";
import { NavLink } from "react-router-dom";
import StatesContext from "../commons/StatesContext";

function logout(setRendering, rendering) {
  sessionStorage.removeItem('islogined');
  setRendering(!rendering);
}

function TopNavi() {
  const { rendering, setRendering } = useContext(StatesContext);
  const islogined = JSON.parse(sessionStorage.getItem('islogined'));

  return (
    <nav className="topnav">
      <div className="nav-left">
        <NavLink className="nav-item" to="/">Home</NavLink>
      </div>
      <div className="nav-right">
        <NavLink className="nav-item"
          onClick={() => {
            window.open('/chat', '', 'width=400,height=600')
          }}
        >
          채팅
        </NavLink>
        {islogined ? (
          <>
            <NavLink className="nav-item" to="/mypage">마이페이지</NavLink>
            <NavLink className="nav-item" onClick={(e) => {
              e.preventDefault();
              logout(setRendering, rendering)
            }}>
              로그아웃
            </NavLink>
            <span className="welcome-text">{islogined.name}님 환영합니다.</span>
          </>
        ) : (
          <>
            <NavLink className="nav-item" to="/signup">회원가입</NavLink>
            <NavLink className="nav-item" to="/login">로그인</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

export default TopNavi;
