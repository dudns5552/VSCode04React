import { getDoc, setDoc, doc } from 'firebase/firestore';

function Modify(props) {
  


  const getCollection = async () => {
      
      let trArray = [];

      const querySnapshot = await getDocs(collection(firestore, 
        'members'));
      
      querySnapshot.reduce((doc) => {

        let memberInfo = doc.data();

        trArray.push(
          <option key={doc.id} value={doc.id}>{memberInfo.name}</option>
        );
      });
      return trArray;
    }

  return (<>
    
  </>); 
}
export default Modify;