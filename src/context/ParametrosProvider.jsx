import { createContext, useState } from "react";

export const ParametrosContext = createContext();

const ParametrosProvider = (props) => {
    const [modelo, setModelo] = useState({
        variables: 1,
        restricciones: 1,
        tipo: "min",
    });
    const [A, setA] = useState([])
    const [b, set_b] = useState([])
    const [objetivo,setObjetivo] = useState([])
    const [ineq,setIneq] = useState([])
    const [tipo, setTipo] = useState('')
    const [binarias,setBinarias] = useState([])

    return (
        <ParametrosContext.Provider value={{ modelo, setModelo, A, setA, b, set_b, objetivo, setObjetivo, ineq, setIneq, tipo, setTipo, binarias, setBinarias }}>
            {props.children}
        </ParametrosContext.Provider>
    );
};

export default ParametrosProvider;