import { ThemeContext } from '../context/ThemeContext';
import { SimpleContext } from '../context/SimpleContext';
import { useContext } from 'react';

const Content = () => {
  
  const { isDark } = useContext(ThemeContext);
  const userMessage = useContext(SimpleContext);

  return (

    <div className="content"
      style={{
        backgroundColor : isDark ? 'black' : 'lightgray',
        color : isDark ? 'white' : 'black'
      }}>
        <p>{userMessage}</p>
      </div>
  );
}

export default Content;