import { useState } from 'react';
import { storage } from './storageConfig';
import { ref, listAll, deleteObject } from 'firebase/storage';
import { useEffect } from 'react';

function App() {
  
  const listRef = ref(storage, '');

  const [fileLists, setFileLists] = useState([]);
  const [renderFlag, setRenderFlag] = useState(false);

  useEffect(() => {
    let fileRows = [];
    listAll(listRef)
      .then((res) => {
        res.prefixes.forEach((folderRef) => {
          console.log('폴더', folderRef);
        });
        res.items.forEach((itemRef) => {
          const delelteRef = ref(storage, itemRef.fullPath);
          fileRows.push(
            <tr key={itemRef.name}>
              <td>{itemRef.bucket}</td>
              <td>{itemRef.fullPath}</td>
              <td>{itemRef.name}</td>
              <td><button onClick={() => {
                if(window.confirm('삭제할까요?')){
                  deleteObject(delelteRef).then(() => {
                    console.log('파일 삭제 성공');
                    setRenderFlag(!renderFlag);
                  })
                  .catch((error) => {
                    console.log('파일 삭제 실패');
                  });
                }
              }}>삭제</button></td>
            </tr>
          );
        });
        setFileLists(fileRows);
      })
      .catch((error) => {
        console.log('에러발생', error);
      });
  }, [renderFlag]);

  console.log('렌더링');

  return (<>
    <div className="App">
      <h2>Firebase - Storage App</h2>
      <h3>파일 목록 및 삭제</h3>
      <table border={1}>
        <thead>
          <tr>
            <th>bucket</th>
            <th>fullPath</th>
            <th>name</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {fileLists}
        </tbody>
      </table>
    </div>
  </>); 
}
export default App;