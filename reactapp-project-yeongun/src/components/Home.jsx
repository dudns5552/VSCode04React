import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { firestore } from '../firebaseConfig';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

const Home = () => {
  
  // 각 게시판의 최신 게시물을 저장하기 위한 스테이트
  const [freePosts, setFreePosts] = useState([]);
  const [qnaPosts, setQnaPosts] = useState([]);
  const [archivePosts, setArchivePosts] = useState([]);

  // 최신 게시물 가져오기 함수
  const fetchLatestPosts = async (collectionName, setter) => {
    const q = query(
      collection(firestore, collectionName),
      orderBy('idx', 'desc'),
      limit(5)
    );
    const snap = await getDocs(q);
    const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setter(posts);
  };

  useEffect(() => {
    fetchLatestPosts('freeBoard', setFreePosts);
    fetchLatestPosts('qnaBoard', setQnaPosts);
    fetchLatestPosts('archiveBoard', setArchivePosts);
  }, []);

  return (
    <div className="container">
      {/* 제목 */}
      <h2 className="section-title">React 어플리케이션 제작하기</h2>

      {/* 게시판 리스트 (자유 + QnA) */}
      <div className="board-row">
        <div className="board-box">
          <h3 className="board-title">
            <Link to="/free/list">자유게시판</Link>
          </h3>
          <ul className="post-list">
            {freePosts.map(post => (
              <li key={post.idx} className="post-item">
                <Link to={`/free/view/${post.idx}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="board-box">
          <h3 className="board-title">
            <Link to="/qna/list">Q&A</Link>
          </h3>
          <ul className="post-list">
            {qnaPosts.map(post => (
              <li key={post.idx} className="post-item">
                <Link to={`/qna/view/${post.idx}`}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 자료 게시판 (썸네일형) */}
      <div className="board-box archive-board">
        <h3 className="board-title">
          <Link to="/archive/list">자료게시판</Link>
        </h3>
        <div className="archive-list">
          {archivePosts.map(post => (
            <div key={post.idx} className="archive-item">
              {/* ✏️ url이 없을 경우에도 에러 안 나도록 옵셔널 체이닝 사용 */}
              {post.files?.[0]?.url && (
                <img src={post.files[0].url} alt={post.title} className="archive-img" />
              )}
              <div className="archive-title">
                <Link to={`/archive/view/${post.idx}`}>{post.title}</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
