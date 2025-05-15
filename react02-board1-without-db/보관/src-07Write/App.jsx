import { useState } from "react";

// 모듈화 한 컴포넌트 임포트
import NavList from './components/navigation/NavList';
import NavView from './components/navigation/NavView';
import NavWrite from './components/navigation/NavWrite';
import ArticleList from './components/article/ArticleList';
import ArticleView from './components/article/ArticleView';
import ArticleWrite from './components/article/ArticleWrite';

// 준비중 컴포넌트
function ReadyComp () {
  return (
    <div>
      <h3>컴포넌트 준비중입니다^^*</h3>
      <a href="/">Home바로가기</a>
    </div>
  );
}

// 제목 컴포넌트
function Header(props) {
  console.log('props', props.title);
  return (<>
    <header>
      <h2>{props.title}</h2>
    </header>
  </>)
}


function App() {
  /* 작성을 위해 기존의 객체형 배열을 스테이트로 변환한다. 데이터의
  추가, 삭제가 있을때 새로운 렌더링이 되어야하기 때문이다. */
  const [boardData, setBoardData] = useState([
    {no: 1, title: '오늘은 React공부하는날', writer:'낙짜쌤', 
      date: '2023-01-01', contents: 'React를 뽀개봅시당'},
    {no: 2, title: '어제는 Javascript공부해씸', writer: '유겸이',
      date: '2023-03-03', contents: 'Javascript는 할게 많아요'},
    {no: 3, title: '내일은 Project해야징', writer:'개똥이',
      date: '2023-05-05', contents: 'Project는 뭘 만들어볼까?'},
  ]);

  // state : 화면 mode 변경
  const [mode, setMode] = useState('list');
  
  // state : 읽기위해 선택한 게시물 번호
  const [no, setNo] = useState(null);

  /* 새로운 게시물 작성시 사용할 시퀀스(Sequence) 용도의 
  스에티스 생성 이미 3개의 게시물이 있으므로 초기값은 4로 설정 */
  const [nextNo, setNextNo] = useState(4);

  let articleComp, navComp, titleVar, selectRow ;

  if (mode === 'list') {
    titleVar = '게시판-목록(props)';
    navComp = <NavList onChangeMode={() => {
      setMode('write');
    }}></NavList>
    articleComp = <ArticleList boardData = {boardData}
      onChangeMode={(no) => {
        console.log('선택한 게시물 번호 : '+ no);
        setMode('view');
        setNo(no);
      }
    }></ArticleList>
  }
  else if (mode === 'view') {
    titleVar = '게시판-읽기(props)';
    navComp = <NavView onChangeMode={(pmode) => {
      setMode(pmode);
    }}></NavView>

    console.log('현재 no : ', no, typeof(no));
    for(let i = 0 ; i < boardData.length ; i++) {
      if ( no === boardData[i].no){
        selectRow = boardData[i];
      }
    }
    articleComp = <ArticleView selectRow={selectRow}></ArticleView>
  }
  else if (mode === 'write') {
    titleVar = '게시판-쓰기(props)';
    navComp = <NavWrite onChangeMode={() => {
      setMode('list');
    }}></NavWrite>

    articleComp = <ArticleWrite writeAction={(t, w, c) => {
      // 3개의 값을 받을 수 있는 함수를 정의하여 프롭스로 전달
      console.log('App.js', t, w, c);

      // 작성일을 Date객체를 통해 생성
      let dateObj = new Date();
      // 현재년도
      var year = dateObj.getFullYear();
      /* getMonth() : 0~11까지를 반환하므로 +1해야 현재월을 
          구할수 있다. */
      var month = ("0" + (1 + dateObj.getMonth())).slice(-2);
      var day = ("0" + dateObj.getDate()).slice(-2);

      /*
      월일이
        한자리인 경우에는 01과 같이 생성되고
        두자리인 경우에는 012와 같이 생성되므로 끝에서 두자리만
        잘라낸다. 이때 slice(-2)를 사용한다.
      0000-00-00 형식으로 날짜가 생성된다. */
      let nowDate = year + "-" + month + "-" + day;

      /* 스테이트 배열에 추가할 객체를 생성한다. 일련번호를 
      스테이트로 선언한 nextNo를 사용하고, 작성폼에서 입력한 값을
      받아서 구성한다. */
      let addBoardData = {no: nextNo, title: t, writer: w, 
        contents: c, date: nowDate};


      
      // 추가방법1(권장)
      // 스프레드 연산자로 복사본 배열을 하나 생성
      let copyBoardData = [...boardData];
      // 복사된 배열에 새로운 객체를 추가한다.
      copyBoardData.push(addBoardData);
      // 복사된 배열을 통해 스테이트를 변경한다.
      setBoardData(copyBoardData);

      /* 배열의 복사본을 만들면 메모리에는 배열이 하나 추가된다.
      복사본에 데이터를 추가한 후 이를 통해 State를 변경한다. 그러면
      새롭게 생성된 배열의 참조값을 통해 State를 변경했으므로 React는
      변화를 감지하여 새로운 렌더링을 하게된다.
      JS는 얕은참조라는 개념을 통해 객체의 변화를 감지하도록 설계되어
      있어 이와같이 처리하는 것이다. */ 

      // 추가방법2(비추천)
      // boardData.push(addBoardData);
      // console.log(boardData);
      // setBoardData(boardData);

      // 일련번호로 사용하는 스테이트를 1증가
      setNextNo(nextNo+1);
      // 글쓰기가 완료되면 화면을 '목록'으로 전환
      setMode('list');
    }}></ArticleWrite>
  }
  else {
    navComp = <ReadyComp></ReadyComp>;
    articleComp = '';
  }


  return (<>
    <div className="App">
      <Header title={titleVar}></Header>
      {navComp}
      {articleComp}
    </div>
  </>); 
}
export default App;

