import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

function FreeList(props) {
  // 🔹 페이지별 게시글 리스트 저장: [[20개], [20개], [20개], ...] 총 최대 5페이지
  const [dataSaves, setDataSaves] = useState([]);

  // 🔹 현재 선택된 페이지의 게시글 목록 (tr들)
  const [listData, setListData] = useState([]);

  // 🔹 URL에서 페이지 번호 가져오기 (예: /free/list/3 → page = "3")
  const { page = 1 } = useParams(); // 기본값은 1
  const currPage = Number(page);   // 문자열을 숫자로 변환

  // 🔸 게시글 100개를 불러오고, 20개씩 잘라 배열에 저장
  useEffect(() => {
    const getCollection = async () => {
      // 🔹 Firebase에서 idx 기준으로 내림차순 정렬하여 최대 100개 가져옴
      const q = query(collection(firestore, "freeBoard"), orderBy("idx", "desc"), limit(100));
      const querySnapshot = await getDocs(q);

      // 🔹 Firebase에서 가져온 데이터를 tr 배열로 변환
      const rows = querySnapshot.docs.map((doc) => {
        const board = doc.data();

        // 🔸 현재 날짜와 비교해서 오늘 작성된 글이면 시간만 표시
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
            <td><Link to={`/Free/view/${board.idx}`}>{board.title}</Link></td>
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

    getCollection(); // 처음 렌더링될 때 게시글을 1회 가져옴
  }, []);

  // 🔸 페이지가 변경되었을 때 해당 페이지 데이터만 선택하여 listData에 세팅
  useEffect(() => {
    if (dataSaves.length > 0 && currPage >= 1 && currPage <= dataSaves.length) {
      setListData(dataSaves[currPage - 1]); // 페이지는 1부터 시작하므로 -1
    }
  }, [dataSaves, currPage]);

  return (
    <>
      <header>
        <h2>자유게시판-목록</h2>
      </header>

      <nav>
        {/* 🔸 로그인된 경우에만 글쓰기 허용 */}
        <Link to="/Free/write" onClick={(e) => {
          const islogined = sessionStorage.getItem('islogined');
          if (!islogined) {
            alert('글쓰기는 로그인 후 가능합니다.');
            e.preventDefault(); // 링크 이동 막기
          }
        }}>글쓰기</Link>
      </nav>

      <article>
        {/* 🔸 게시글 목록 테이블 */}
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>제목</th>
              <th>작성자</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {/* 🔸 현재 페이지의 게시글 tr 출력 */}
            {listData}
          </tbody>
        </table>
      </article>

      <footer>
        {/* 🔸 페이지 이동 링크 (현재 페이지는 강조 표시) */}
        {[1, 2, 3, 4, 5].map(p => (
          <Link
            key={p}
            to={`/free/list/${p}`} // ex: /free/list/3
            style={{
              margin: '0 5px',
              textDecoration: p === currPage ? 'underline' : 'none',
              fontWeight: p === currPage ? 'bold' : 'normal',
            }}
          >
            {p}
          </Link>
        ))}
      </footer>
    </>
  );
}

export default FreeList;
