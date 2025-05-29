import { Link } from 'react-router-dom';

const Home = () => {

  


  return(<>
    <h2>React 어플리케이션 제작하기</h2>

    <Link to={'/Free/List'}>자유게시판</Link>
  </>);
}

export default Home