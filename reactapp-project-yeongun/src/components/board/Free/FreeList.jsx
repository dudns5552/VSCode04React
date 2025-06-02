import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function FreeList() {
  const [dataSaves, setDataSaves] = useState([]);
  const [listData, setListData] = useState([]);
  const { page = 1 } = useParams();
  const currPage = Number(page);

  useEffect(() => {
    const getCollection = async () => {
      const q = query(collection(firestore, "freeBoard"), orderBy("idx", "desc"), limit(100));
      const querySnapshot = await getDocs(q);

      const dateObj = new Date();
      const year = dateObj.getFullYear();
      const month = ("0" + (1 + dateObj.getMonth())).slice(-2);
      const day = ("0" + dateObj.getDate()).slice(-2);
      const todayStr = `${year}.${month}.${day}`;

      const rows = querySnapshot.docs.map((doc) => {
        const board = doc.data();
        const [date, hours] = board.writeDate.split('/');

        return (
          <tr key={board.idx}>
            <td className="td-no">{board.idx}</td>
            <td className="td-title">
              <Link to={`/Free/view/${board.idx}`} className="title-link">{board.title}</Link>
            </td>
            <td className="td-writer">{board.writer}</td>
            <td className="td-date">{date === todayStr ? hours : date}</td>
          </tr>
        );
      });

      const pagedData = [];
      for (let i = 0; i < rows.length; i += 20) {
        pagedData.push(rows.slice(i, i + 20));
      }

      setDataSaves(pagedData);
    };

    getCollection();
  }, []);

  useEffect(() => {
    if (dataSaves.length > 0 && currPage >= 1 && currPage <= dataSaves.length) {
      setListData(dataSaves[currPage - 1]);
    }
  }, [dataSaves, currPage]);

  return (
    <div className="free-board-container">
      <header className="board-header">
        <h2 className="board-title">자유게시판</h2>
      </header>

      {/* 🔸 글쓰기 버튼 영역 */}
      <div className="write-button-wrap">
        <Link
          to="/Free/write"
          className="write-button"
          onClick={(e) => {
            const islogined = sessionStorage.getItem('islogined');
            if (!islogined) {
              alert('글쓰기는 로그인 후 가능합니다.');
              e.preventDefault();
            }
          }}
        >
          글쓰기
        </Link>
      </div>

      <article className="board-table-wrap">
        <table className="board-table">
          <thead>
            <tr>
              <th className="th-no">No</th>
              <th className="th-title">제목</th>
              <th className="th-writer">작성자</th>
              <th className="th-date">날짜</th>
            </tr>
          </thead>
          <tbody>
            {listData}
          </tbody>
        </table>
      </article>

      {/* 🔸 페이지네이션 */}
      <footer className="pagination-wrap">
        {dataSaves.map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <Link
              key={pageNum}
              to={`/free/list/${pageNum}`}
              className={`pagination-link ${pageNum === currPage ? 'active' : ''}`}
            >
              {pageNum}
            </Link>
          );
        })}
      </footer>
    </div>
  );
}

export default FreeList;
