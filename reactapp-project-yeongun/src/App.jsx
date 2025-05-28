import { Route, Routes } from 'react-router-dom';

import Home from './components/Home';
import Signup from './components/members/Signup';
import TopNavi from './components/TopNavi';
import Login from './components/members/Login';
import IdCheck from './components/members/IdCheck';
import Modify from './components/members/Modify';
import Context from './commons/Context';




function App(props) {
  
  return (<>
    <Context.Provider value>
    <TopNavi />
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/idCheck' element={<IdCheck />} />
      <Route path='/login' element={<Login />} />
      <Route path='/modify' element={<Modify />} />
    </Routes>
    </Context.Provider>
  </>); 
}
export default App;