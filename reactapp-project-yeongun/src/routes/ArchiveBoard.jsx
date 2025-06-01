import { Route } from 'react-router-dom';

import ArchiveList from '../components/board/Archive/ArchiveList';
import ArchiveEdit from '../components/board/Archive/ArchiveEdit';
import ArchiveWrite from '../components/board/Archive/ArchiveWrite';
import ArchiveView from '../components/board/Archive/ArchiveView';

function ArchiveBoard(props) {

  return (<>
    <Route path='/archive/write' element={<ArchiveWrite />} />
    <Route path='/archive/list/:page?' element={<ArchiveList />} />
    <Route path='/archive/view/:idx' element={<ArchiveView />} />
    <Route path='/archive/edit/:idx' element={<ArchiveEdit />} />
  </>);
}
export default ArchiveBoard;