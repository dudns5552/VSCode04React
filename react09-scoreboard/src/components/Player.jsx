import { useState } from 'react';
import Counter from '../components/Counter';
import EditPlayerForm from './EditPlayerForm';

export default function Player(props) {
  let row = props.playerData;

  // 수정폼을 보임/숨김 처리를 위한 스테이트 생성
  const [showEdit, setShowEdit] = useState(false);
  let editForm;
  if(showEdit===false){
    // false일때는 빈값을 할당해서 숨김처리
    editForm = '';
  }
  else{
    // true일때는 컴포넌트를 할당해서 보임처리
    editForm = <EditPlayerForm playerName={row.name} playerIdx={row.idx}
      onEditPlayer={props.onEditPlayer} showEdit={showEdit}
      setShowEdit={setShowEdit} />;
  }
  return (<>
    <div className="player">
      <span className="player-name">
        <button className="remove-player" onClick={() => {
          // 삭제 버튼을 누르면 confirm으로 확인 후 함수를 호출
          if(window.confirm("선수를 삭제하시겠습니까?")){
            props.deletePlayerProcess(row.idx);
          }
        }}> x </button>
        <a href="/" onClick={(e) =>{
          e.preventDefault();
          setShowEdit(!showEdit);
        }}>
          {row.name}
        </a>
      </span>
      {/* App 컴포넌트에서 전달받은 함수를 자식 컴포넌트로 재전달한다. 
      React는 Top-down 방식으로 데이터를 전달하는 구조를 가지고 있어
      컴포넌트의 구조가 복잡해질수록 상태관리가 어려워진다는
      단점이 있다. */}
      <Counter idx={row.idx} score={row.score} 
        onChangeScore = {props.onChangeScore}/>
    </div>
    {/* 각 선수마다 하위에는 수정폼이 추간된다. 이름을 누를때마다
    토글된다. */}
    {editForm}
  </>);
}