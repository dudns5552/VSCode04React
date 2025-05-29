import { Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import TopNavi from './components/TopNavi';
import MemberRoutes  from './routes/MemberRoutes';

import { StatesProvider }  from './commons/StatesContext';




function App(props) {
  
  return (<>
    <StatesProvider>
      <TopNavi />
      <Routes>
        <Route path='/' element={<Home />} />
        {MemberRoutes()}
      </Routes>
    </StatesProvider>
  </>); 
}
export default App;