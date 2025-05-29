import { getDocs, collection,} from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { useEffect, useState } from 'react';

function FreeList(props) {
  
  const [ listData, setListData] = useState();


  useEffect(() => {
    const getCollection = async () => {
      const trArray = [];
      const querySnapshot = await getDocs(collection(firestore, "freeBoard"));

      querySnapshot.forEach((doc) => {
        const memberInfo = doc.data();

        trArray.push(
          <tr key={memberInfo.no}>
            <td className="cen">{memberInfo.no}</td>
            <td><Link to={'/Free/view/' + memberInfo.no}>{memberInfo.title}</Link></td>
            <td className="cen">{memberInfo.writer}</td>
            <td className="cen">{memberInfo.date}</td>
          </tr>
        );
      });

      setListData(trArray);
    };

    getCollection(); // 비동기 함수 호출
  }, []);


  return (<>
    <header>
      <h2>자유게시판-목록</h2>
    </header>
    <nav>
      {/* 각 링크는 <a>에서 <Link> 컴포넌트로 변경 */}
      <Link to="/Free/write">글쓰기</Link>
    </nav>
    <article>
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
          {/* map을 통해 구성한 목록부분을 여기서 출력한다. */}
          {listData}
        </tbody>
      </table>
    </article>
  </>); 
}
export default FreeList;