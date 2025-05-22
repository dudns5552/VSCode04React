import { useReducer, useState } from "react";

/* 
학생 컴포넌트 정의
  컴포넌트에서 매개변수를 정의하는 2가지 방법
  1. props라는 대표 매개변수를 사용한다. 이때는 2개 이상의 인수를
    객체형태로 받을수 있으므로 'props.속성명'과 같이 사용한다.
  2. 인수를 개별 변수로 전달받는다.
    {매개변수1, 2, ... N}
*/
const Student = ({name, dispatch, id, isHere}) => {
  return (<>
    <div>
      {/* 학생의 이름을 클릭하면 출석 기능이 토글됨 */}
      {/* 학생이 출석한 상태이면 가운데줄과 회색으로 변경되므로
      스타일 속성을 추가함. 이 상태는 isHere에 따라 토글된다. */}
      <span style={{
        textDecoration : isHere ? 'line-through' : 'none',
        color: isHere ? 'silver' : 'black',
      }}
        onClick={() => {
          dispatch({
            /* 디스패치 함수 호출시 액션객체를 전달해서 상태 변경.
            이때 리듀서 함수가 실행된다. */
            type: 'mark',
            param: {id}})
        }}>{name}</span>
      {/* 삭제 버튼 */}
      <button onClick={() => {
        /* 삭제 버튼을 누르면 confirm으로 확인 후 삭제처리를 위해
        dispatch함수 호출 */
        if(confirm("삭제할까요?")){
          dispatch({
            type: 'delete',
            param: {id}});
        }
      }}>삭제</button>
    </div>
  </>);
}

// 리듀서 함수 선언
const reducer = (state, action) => {
  switch(action.type) {
    // 학생 추가
    case 'add':
      /* 
      학생이름을 액션객체를 통해 읽어온다. (dispatch함수에서 전달하는
      액션객체를 참조) */
      const name = action.param.name;
      // 추가를 위한 새로운 객체 생성
      const newStudent = {
        id: Date.now(),
        name, /* 이름은 key와 value가 동일하므로 하나만 작성 */
        isHere: false, /* 출석여부 */
      }
      return {
        // 학생수 증가
        count: state.count + 1,
        // 스프레드연산자로 기존 배열에 새로운 객체를 추가
        students: [...state.students, newStudent],
      }



    // 학생 삭제
    case 'delete':
      return {
        // 학생수 차감
        count: state.count - 1,
        /* filter함수를 이용해서 삭제할 학생을 제외한 나머지 객체로만
         배열을 만든 후 반환값을 통해 업데이트한다.
         화사표함수는 매개변수가 1개인 경우 소괄호 생략이 가능하고,
         반환값이 1줄인 경우 중괄호와 return을 생략할 수 있다. */
        students: state.students.filter(
          student => student.id !== action.param.id

          // (student) => {
          //   return student.id !== action.param.id
          // }
        )
      }



    // 출결 처리
    case 'mark':
      return{
        // 학생수는 변함 없음
        count: state.count,
        /* 출결처리는 학생수에는 변함이 없으므로 map을 사용한다.
        처리할 학생을 찾은 후 isHere 부분만 true/false로 변경한다.
        이 부분은 스프레드 연산자 예제(JS스프레드연산자3번예제) 참조 */
        students: state.students.map((student) => {
          if(student.id === action.param.id) {
            return {...student, isHere: !student.isHere};
          }
          return student;
        })
      }
    default:
  }
}

// 앱에서 사용할 데이터 객체로 학생수와 학생의 정보를 담은 배열로 정의
const initialState = {
  count: 1,
  students: [
    {
      id: Date.now(), name: '김철수', isHere: false,
    },
  ],
}

const mark = () => {
  
}

function App() {
  
  // input상자에서 학생이름 입력을 위해 사용할 스테이트 생성
  const [name, setName] = useState('');
  /* 
  리듀서 변수 생성 및 함수 생성 studentInfo의 초기값은 앞에서 생성한
  데이터 객체로 정의 */ 
  const [studentInfo, dispatch] = useReducer(reducer, initialState);

  return (<>
    <div className="App">
      <p>총학생수 : {studentInfo.count}</p>
      {/* 추가할 학생의 이름을 입력할 입력상자 */}
      <input type="text" placeholder="이름을 입력하세요" 
        value={name} onChange={(e) => {
          setName(e.target.value)
        }} />
      {/* 버튼을 누르면 디스패치를 통해 액션객체를 리듀서로 전달해서
      학생을 추가한다. 특히 param의 value는 객체로 정의되어 있다. */}
      <button onClick={() => {
        dispatch({
          type: 'add', 
          param:{
            name:name
          }
        });
        div.input.value.name.value= '';
      }}>추가</button>
      {
        // 데이터에 입력된 학생수만큼 반복해서 Student컴포넌트를 출력
        studentInfo.students.map((student) => {
          // 컴포넌트에서 사용할 값을 프롭스로 전달
          return <Student key={student.id} name={student.name}
            dispatch={dispatch} id={student.id}
            isHere={student.isHere} />
        })
      }
    </div>
  </>); 
}
export default App;