import { legacy_createStore as createStore} from 'redux';
import { Provider, useSelector, useDispatch} from 'react-redux';

function reducer(currentState, action){
  if(currentState === undefined){
    return{
      number : 1,
    };
  }

  const newState = {...currentState};

  if(action.type === 'PLUS'){
    newState.number ++;
  }

  return newState;
}

const store = createStore(reducer);


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

function Right3 () {
  const dispatch = useDispatch();
  return (
    <div>
      <h2>Right3</h2>
      <input type="button" value="+" onClick={() => {
        dispatch({ type : 'PLUS'})
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

const Left3 = () => {

  // // 어떤 스테이트를 받을지 결정하기 위한 함수 정의
  // function f (state) {
  //   return state.number;
  // }
  // // 정의한 함수를 인수로 전달한다.
  // const number = useSelector(f);

  const number = useSelector((state) => { return state.number });
  return (
    <div>
      <h2>Left3 : {number}</h2>
    </div>
  );
}

function App() {
  // const [number, setNumber] = useState(1);

  return (<>
    <div className="root">
      <h2>React - Redux</h2>
      <div id="grid">
        <Provider store={store}>
          <Left1></Left1>
          <Right1></Right1>
        </Provider>
      </div>
    </div>
  </>);
}

export default App
