import { useContext as use } from "react";
import { AuthContext } from "../providers/AuthContext";

const useAuth = () =>{
    const authInfo = use(AuthContext);

    return authInfo;
};

export default useAuth;;