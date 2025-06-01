import { Route } from "react-router-dom";
import QnAEdit from "../components/board/QnA/QnAEdit";
import QnAList from "../components/board/QnA/QnAList";
import QnAView from "../components/board/QnA/QnaView";
import QnAWrite from "../components/board/QnA/QnAWrite";

function FreeBoard(props) {

  return (<>
    <Route path='/qna/write' element={<QnAWrite />} />
    <Route path='/qna/list/:page?' element={<QnAList />} />
    <Route path='/qna/view/:idx' element={<QnAView />} />
    <Route path='/qna/edit/:idx' element={<QnAEdit />} />
  </>);
}
export default FreeBoard;