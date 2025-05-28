import { NavLink } from "react-router-dom";

function TopNavi(props) {

  var loginCheck = sessionStorage.getItem();
        if (visitVar2 == null) {
          sessionStorage.setItem("visitCnt2", 1);
          span2.innerHTML = "첫방문이시네요.";
        }
  return (<>
    <nav>
      <NavLink to="/">Home</NavLink>&nbsp;&nbsp;
      <NavLink to="/signup">회원가입</NavLink>&nbsp;&nbsp;
      <NavLink to="/login">로그인</NavLink>
      
    </nav>
  </>); 
}
export default TopNavi;