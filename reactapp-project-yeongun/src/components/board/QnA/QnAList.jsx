import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function QnAList(props) {

  // 페이징데이터
  const [dataSaves, setDataSaves] = useState([]);
  // 실체데이터
  const [listData, setListData] = useState([]);

  const { page = 1 } = useParams(); // 기본값은 1
  const currPage = Number(page);   // 문자열을 숫자로 변환

  useEffect(() => {
    const getCollection = async () => {
      const q = query(collection(firestore, "qnaBoard"), orderBy("idx", "desc"), limit(100));
      const querySnapshot = await getDocs(q);

      const rows = querySnapshot.docs.map((doc) => {
        const board = doc.data();

        // 비교군 생성
        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const month = ("0" + (1 + dateObj.getMonth())).slice(-2);
        const day = ("0" + dateObj.getDate()).slice(-2);
        const todayStr = `${year}.${month}.${day}`

        const [date, hours] = board.writeDate.split('/');

        return (
          <tr key={board.idx}>
            <td className="cen">{board.idx}</td>
            <td><Link to={`/qna/view/${board.idx}`} className="title-link">{board.title}</Link></td>
            <td className="cen">{board.writer}</td>
            <td className="cen">{date === todayStr ? hours : date}</td>
          </tr>
        );
      });

      // 🔸 20개씩 잘라서 2차원 배열에 저장 → [[page1], [page2], [page3], ...]
      const pagedData = [];
      for (let i = 0; i < rows.length; i += 20) {
        pagedData.push(rows.slice(i, i + 20));
      }

      setDataSaves(pagedData); // 최종 페이징 데이터 저장
    };

    getCollection();
  }, []);

  // 🔸 페이지가 변경되었을 때 해당 페이지 데이터만 선택하여 listData에 세팅
  useEffect(() => {
    if (dataSaves.length > 0 && currPage >= 1 && currPage <= dataSaves.length) {
      setListData(dataSaves[currPage - 1]);
    }
  }, [dataSaves, currPage]);

  return (
    <div className='free-board-container'>
      <header className='board-header'>
        <h2 className="board-title">Q&A게시판-목록</h2>
      </header>

      <div className="write-button-wrap">
        <Link to="/qna/write"
          className="write-button"
          onClick={(e) => {
            const islogined = sessionStorage.getItem('islogined');
            if (!islogined) {
              alert('글쓰기는 로그인 후 가능합니다.');
              e.preventDefault();
            }
          }}>글쓰기</Link>
      </div>
      <article className='board-table-wrap'>
        <table className='board-table'>
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

export default QnAList;
