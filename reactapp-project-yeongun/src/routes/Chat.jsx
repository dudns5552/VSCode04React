import { Route } from 'react-router-dom';

import ChatStart from '../components/chat/ChatStart';
import ChatMessage from '../components/chat/ChatMessage';



function Chat(props) {

  return (<>
    <Route path='/chat' >
      <Route index element={<ChatStart />} />
      <Route path='talk' element={<ChatMessage />} />
    </Route>
  </>);
}
export default Chat;