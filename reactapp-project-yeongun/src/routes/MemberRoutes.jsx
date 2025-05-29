import { Route } from "react-router-dom";
import Login from "../components/members/Login";
import Mypage from "../components/members/Mypage";
import Signup from "../components/members/Signup";


function MemberRoutes() {
  
  return (<>
    <Route path='/signup' element={<Signup />} />
    <Route path='/login' element={<Login />} />
    <Route path='/mypage' element={<Mypage />} />
  </>); 
}
export default MemberRoutes;