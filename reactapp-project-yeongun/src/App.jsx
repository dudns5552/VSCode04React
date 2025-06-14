import { Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import TopNavi from './components/TopNavi';
import MemberRoutes from './routes/MemberRoutes';
import FreeBoard from './routes/FreeBoard';
import QnABoard from './routes/QnABoard';


import { StatesProvider } from './commons/StatesContext';
import ArchiveBoard from './routes/ArchiveBoard';
import Chat from './routes/Chat';
import Footer from './components/Footer';




function App(props) {

  return (<>
    <StatesProvider>
      {/* Chat 경로가 아니면 TopNavi 보이기 */}
      <TopNavi />
      <Routes>
        <Route path='/' element={<Home />} />
        {MemberRoutes()}
        {FreeBoard()}
        {QnABoard()}
        {ArchiveBoard()}
        {Chat()}
      </Routes>
      <Footer />
    </StatesProvider>
  </>);
}
export default App;