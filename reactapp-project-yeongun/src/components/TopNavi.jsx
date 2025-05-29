import { NavLink } from "react-router-dom";

function TopNavi(props) {

  return (<>
    <nav>
      <NavLink to="/">Home</NavLink>&nbsp;&nbsp;
      <NavLink to="/signup">회원가입</NavLink>&nbsp;&nbsp;
      <NavLink to="/login">로그인</NavLink>
      
    </nav>
  </>); 
}
export default TopNavi;