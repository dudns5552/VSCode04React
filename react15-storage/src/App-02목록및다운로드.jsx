import { useEffect } from 'react';
import { storage } from './storageConfig';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { useState } from 'react';

function App() {
  
  // 스토리지 연결 및 root 경로로 참조객체 생성
  const listRef = ref(storage, '');

  useEffect(() => {
    let fileRows = [];
    // 생성된 스토리지 root 경로의 참조객체로 모든 폴더와 파일명 인출
    listAll(listRef)
      .then((res) => {
        /* 콜백데이터 res를 통해 prefixes를 사용하면 폴더명을 
        배열로 인출 */
        res.prefixes.forEach((folderRef) => {
          console.log('폴더', folderRef.name);
        });
        /* items를 통해 파일명을 배열로 인출 */
        res.items.forEach((itemRef) => {
          console.log('파일명', itemRef.name);
          /* 
          파일의 다운로드 URL을 비동기로 얻어온다. 파일명을 통해 참조생성
           */
          getDownloadURL(ref(storage, itemRef.name))
            .then((url) => {
              console.log('파일 URL 다운로드');
              /* img 태그에 부여된 id를 통해 DOM을 얻어온다. */
              const img = document.getElementById(`img_${itemRef.name}`);
              // img 태그에 src, width 속성값을 부여한다.
              img.setAttribute('src', url);
              img.setAttribute('width', '200');
            })
            .catch((error) => {
              console.log('이미지 다운로드 중 에러', error);
            });
            
            // 파일의 목록생성. 최초 생성시에는 src속성없이 출력된다.
            fileRows.push(
              <tr key={itemRef.name}>
                <td>{itemRef.bucket}</td>
                <td>{itemRef.fullPath}</td>
                <td>{itemRef.name}</td>
                <td><img id={`img_${itemRef.name}`} alt='' /></td>
              </tr>
            );
        });

        // 완성된 파일목록을 통해 스테이트 변경
        setFileLists(fileRows);
      })
      .catch((error) => {
        console.log('파일 목록 출력중 에러발생', error);
      });
  }, []);

  // 스토리지에서 얻어온 파일목록을 저장한 스테이트 생성
  const [fileLists, setFileLists] = useState([]);
  console.log('렌더링');

  return (<>
    <div className="App">
      <h2>Firebase - Storage App</h2>
      <h3>파일 목록 및 이미지 다운로드</h3>
      <table border={1}>
        <thead>
          <tr>
            <th>bucket</th>
            <th>fullPath</th>
            <th>name</th>
            <th>이미지</th>
          </tr>
        </thead>
        <tbody>
          {/* 1차 렌더링 후 useEffect에서 얻어온 파일 목록이 출력됨 */}
          {fileLists}
        </tbody>
      </table>
    </div>
  </>); 
}
export default App;