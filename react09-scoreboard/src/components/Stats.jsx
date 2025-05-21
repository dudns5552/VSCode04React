
export default function Stats(props) {

  // 선수 데이터의 크기로 인원수를 알 수 있다.
  let PlayersCount = props.playersData.length;

  /* 
  prev의 초기값을 0으로 설정. 각 루프에서의 점수를 prev에 합산 후
  반환하면 총점이 된다. */
  let totalPoint = props.playersData.reduce((prev, curr) => {
    console.log(curr.name + '점수', curr.score);
    prev += curr.score;
    return prev;
  }, 0);

  return (<>
    <table className="stats">
      <tbody>
      <tr>
        <td>Players:</td>
        <td>{PlayersCount}</td>
      </tr>
      <tr>
        <td>Total Points:</td>
        <td>{totalPoint}</td>
      </tr>
      </tbody>
    </table>    
  </>);
}