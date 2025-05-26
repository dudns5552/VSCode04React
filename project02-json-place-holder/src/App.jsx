import { useEffect, useState } from "react";

const ListTop = (props) => {
  
  const [myList, setMyList] = useState([]);

  useEffect(function() {
    fetch('')
      .then((result) => {
        return result.json();
      })
      .then((json) => {
        console.log(json);
        setMyList(json)
      });
    return () => {
      console.log('#Life', 'LifeGood ==> 4. useEffect실행2');
    }
  }, []);

  
}

function App() {
  

  return (<>
    
  </>); 
}
export default App;