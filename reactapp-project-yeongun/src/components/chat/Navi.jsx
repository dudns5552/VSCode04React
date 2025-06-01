import { Link } from 'react-router-dom';

function Navi() {
  
  return (<>
    <div className="naviWrap">
      <Link to='/crud'>RealtimeCRUD</Link>&nbsp;&nbsp;
      <Link to='/listener'>RealtimeListener</Link>&nbsp;&nbsp;
      <Link to='/chat'>RealtimeChat</Link>
    </div>
  </>); 
}
export default Navi;