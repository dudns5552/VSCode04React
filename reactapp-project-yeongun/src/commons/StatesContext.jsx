import { createContext, useState} from "react";


const StatesContext = createContext();

export const StatesProvider = ({ children }) => {
  // 여러 개의 상태
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rendering, setRendering] = useState(false);

  // 여러 상태를 객체로 묶어서 전달
  return (
    <StatesContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        rendering,
        setRendering,
      }}
    >
      {children}
    </StatesContext.Provider>
  );
};

export default StatesContext;
