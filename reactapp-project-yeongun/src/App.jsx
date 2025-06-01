import { Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import TopNavi from './components/TopNavi';
import MemberRoutes  from './routes/MemberRoutes';
import FreeBoard from './routes/FreeBoard';
import QnABoard from './routes/QnABoard';


import { StatesProvider }  from './commons/StatesContext';
import ArchiveBoard from './routes/ArchiveBoard';




function App(props) {
  
  return (<>
    <StatesProvider>
      <TopNavi />
      <Routes>
        <Route path='/' element={<Home />} />
        {MemberRoutes()}
        {FreeBoard()}
        {QnABoard()}
        {ArchiveBoard()}
      </Routes>
    </StatesProvider>
  </>); 
}
export default App;