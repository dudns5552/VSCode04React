import { storage } from './storageConfig';
// 저장소에 대한 참조생성 및 파일업로드 함수 임포트
import { ref, uploadBytes } from 'firebase/storage';

function App() {
  
  // 파이어베이스 스토리지 연결 및 확인
  const storageRef = ref(storage);
  console.log('storageRef', storageRef);

  /* 
  ref()를 호출할때 경로를 두번째 인수로 전달하여 경로 트리에서 하위
  위치를 가리키는 참조객체를 만들 수 있다. */
  // 경로 : root/images
  const imagesRef1 = ref(storage, 'images1');
  const imagesRef2 = ref(storage, 'images/myFile.jpg');

  /* 
  parent 및 root 속성을 사용해서 한단계 상위로 이동하거나 최상위의
  경로를 참조할 수 있다.
  */
  const imagesRef3 = imagesRef2.parent;
  const imagesRef4 = imagesRef2.root;

  /* 
  fullPath, name 등의 속성으로 참조를 조사하여, 이것이 가리키는 파일을
  자세히 파악할 수 있다. */
  console.log('ref객체', imagesRef1);
  console.log('경로1', imagesRef1.fullPath);
  console.log('경로2', imagesRef2.fullPath, imagesRef2.name);
  console.log('경로3', imagesRef3.fullPath);
  console.log('경로4', imagesRef4.fullPath);

  return (<>
    <div className="App">
      <h2>Firebase - storage App</h2>
      <h3>스토리지 접속 및 파일 업로드</h3>
      <p>파일을 선택하면 즉시 업로드 됩니다.</p>
      <input type="file" name="myfile" onChange={(e) => {
        console.log('files 프로퍼티', e.target.files);

        /* 
        파일업로드 형식
        const ref변수 = ref(스토리지객체, 파일명);
        uploadBytes(ref변수, 파일객체).then(성공시 콜백 함수);
        */
        // const imagesRef = ref(storage, e.target.files[0].name);
        const imagesRef = ref(imagesRef1, e.target.files[0].name);
        uploadBytes(imagesRef, e.target.files[0]).then((snapshot) => {
          console.log('업로드 성공', snapshot);
        });
      }} />
    </div>
  </>); 
}
export default App;