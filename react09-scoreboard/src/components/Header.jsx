import Stats from '../components/Stats';
import Stopwatch from '../components/Stopwatch';

export default function Header(props) {
  return (<>
    <header className="header">
			{/* App컴포넌트에서 프롭스로 전달받은 선수데이터를 다시 하위로
			전달한다.  */}
			<Stats playersData = {props.playersData}/>
			<h1 className="h1">{props.title}</h1>
			<Stopwatch></Stopwatch>
		</header>
  </>);
}