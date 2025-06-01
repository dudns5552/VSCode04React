import { Link } from 'react-router-dom';

const Home = () => {

  


  return(<>
    <h2>React 어플리케이션 제작하기</h2>

    <Link to={'/free/list'}>자유게시판</Link>
    <Link to={'/qna/list'}>Q&A</Link>
    <Link to={'/archive/list'}>자료게시판</Link>
  </>);
}

export default Home