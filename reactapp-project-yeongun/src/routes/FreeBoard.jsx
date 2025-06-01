import { Route } from 'react-router-dom';
import FreeList from '../components/board/Free/FreeList';
import FreeWrite from '../components/board/Free/FreeWrite';
import FreeView from '../components/board/Free/FreeView';
import FreeEdit from '../components/board/Free/FreeEdit';

function FreeBoard(props) {

  return (<>
    <Route path='/free/write' element={<FreeWrite />} />
    <Route path='/free/list/:page?' element={<FreeList />} />
    <Route path='/free/view/:idx' element={<FreeView />} />
    <Route path='/free/edit/:idx' element={<FreeEdit />} />
  </>);
}
export default FreeBoard;