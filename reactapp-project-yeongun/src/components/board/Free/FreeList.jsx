import { getDocs, collection, } from 'firebase/firestore';
import { firestore } from '../../../firebaseConfig';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function FreeList(props) {

  const [listData, setListData] = useState();


  useEffect(() => {
    const getCollection = async () => {
      const trArray = [];
      const querySnapshot = await getDocs(collection(firestore, "freeBoard"));

      querySnapshot.forEach((doc) => {
        const memberInfo = doc.data();


        // 비교군 생성
        const dateObj = new Date();
        const year = dateObj.getFullYear();
        const month = ("0" + (1 + dateObj.getMonth())).slice(-2);
        const day = ("0" + dateObj.getDate()).slice(-2);
        const compareDate = `${year}.${month}.${day}`


        const fullDate = memberInfo.writeDate.split('/');
        const date = fullDate[0];
        const hours = fullDate[1];

        console.log("compareDate:", compareDate); // "2025-05-30"
        console.log("writeDate date:", date); // fullDate[0]
        console.log("isEqual?", compareDate === date); // true?
        console.log("trimmed date:", date.trim());



        trArray.push(
          <tr key={memberInfo.idx}>
            <td className="cen">{memberInfo.idx}</td>
            <td><Link to={'/Free/view/' + memberInfo.idx}>{memberInfo.title}</Link></td>
            <td className="cen">{memberInfo.writer}</td>
            <td className="cen">{
              (compareDate == date
                ? hours
                : date
              )}</td>
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