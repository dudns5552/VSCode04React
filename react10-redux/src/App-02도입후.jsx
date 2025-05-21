
// 리덕스 스토어를 생성하기 위한 임포트
import { legacy_createStore as createStore} from 'redux';
// 리덕스를 관리하기 위해 필요한 Provider컴포넌트와 관련 Hook 임포트
import { Provider, useSelector, useDispatch} from 'react-redux';

/* 
스토어 생성시 주입할 Reducer(리듀서) 함수를 먼저 생성한다.
리듀서는 스토어에 있는 스테이트를 변경하기 위한 기능을 실행부로 
정의한다. 매개변수는 2개가 필요하다
  currentState : 현재의 스테이트 값
  action : 스테이트 변경에 필요한 요청 파라미터. 2개 이상의 값을 
    전달 할 수 있어야 하므로 주로 JS객체 형식으로 제작한다.
*/
function reducer(currentState, action){
  /* 최초 스테이트가 정의되지 않은 상태라면 number를 1로 설정한다.
  기존에는 최상위 컴포넌트에서 useState를 통해 생성하지만, Redux가
  도입되면 스토어에서 스테이트를 생성 및 관리한다. */
  if(currentState === undefined){
    return{
      number : 1,
    };
  }

  // 현재 스테이트의 복사본을 생성 
  const newState = {...currentState};

  // 액션 객체를 분석해서 상태를 변경한다.
  if(action.type === 'PLUS'){
    newState.number ++;
  }

  /* 
  변경된 스테이트를 반환하여 적용한다. setter함수를 
  호출하는것과 동일하다. */
  return newState;
}

// 앞에서 정의한 리듀서 함수를 인자로 스토어를 생성한다.
const store = createStore(reducer);

/* 
스토어가 도입되면 Right, Left 컴포넌트에서 프롭스를 통해 전달하던
값이나 함수는 더이상 필요하지않다. 따라서 기존 코드에서 제거한다.
*/
function Right1 () {
  return (
    <div>
      <h2>Right1</h2>
      <Right2></Right2>
    </div>
  )
}

function Right2 () {
  return (
    <div>
      <h2>Right2</h2>
      <Right3></Right3>
    </div>
  )
}

/* 
useDispatch 훅
  스테이트를 변경할때 리듀스 함수를 호출하는 역할을 한다.
  액션객체를 인수로 디스패치 함수를 호출하면, 스토어에 정의된
  리듀서를 실행하는 구조를 가진다.
*/
function Right3 () {

  // 훅을통해 디스패치 함수를 선언
  const dispatch = useDispatch();

  return (
    <div>
      <h2>Right3</h2>
      <input type="button" value="+" onClick={() => {
        // 액션 객체를 아래와 같이 만든 후 호출한다.
        dispatch({ type : 'PLUS' })
      }} />
    </div>
  );
}

const Left1 = () => {
  return (
    <div>
      <h2>Left1</h2>
      <Left2></Left2>
    </div>
  );
}

const Left2 = () => {
  return (
    <div>
      <h2>Left2</h2>
      <Left3></Left3>
    </div>
  );
}


/* 
useSelector 훅
  스토어에서 관리하느 여러가지 스테이트 중 필요한 것을 선택할때 사용
*/
const Left3 = () => {

  // // 어떤 스테이트를 받을지 결정하기 위한 함수 정의
  // function f (state) {
  //   return state.number;
  // }
  // // 정의한 함수를 인수로 전달한다.
  // const number = useSelector(f);

  /* 
  스토어에 정의된 여러개의 스테이트 중 어떤값을 받을지를 정의한 
  함수를 useSelector의 인수로 사용한다. 이 함수는 상황에 맞게 
  개발자가 직접 정의하면 된다.
  */
  const number = useSelector((state) => { return state.number });
  return (
    <div>
      <h2>Left3 : {number}</h2>
    </div>
  );
}

function App() {
  /* 
  스토어가 생성되었으므로 App컴포넌트에서는 더이상 스테이트를 생성
  및 관리할 필요가 없다. */
  // const [number, setNumber] = useState(1);

  /* 
  Provider 컴포넌트
    어떤 컴포넌트에 스테이트를 제공할지 결정하는 Wrapper(랩퍼) 
    컴포넌트로 여기서는 App 컴포넌트 하위의 Left, Right 컴포넌트를
    감싸준다. 그러면 하위의 모든 컴포넌트에서 스토어를 공유하게된다.
  */
  return (<>
    <div className="root">
      <h2>React - Redux</h2>
      <div id="grid">
        {/* 컴포넌트를 감쌀때는 스토어를 프롭스로 전달해야한다. */}
        <Provider store={store}>
          <Left1></Left1>
          <Right1></Right1>
        </Provider>
      </div>
    </div>
  </>);
}

export default App
