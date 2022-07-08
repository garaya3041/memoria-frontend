import React, {useContext}  from 'react';
import { NavDropdown } from 'react-bootstrap';
import {ParametrosContext} from '../context/ParametrosProvider';
import {useNavigate} from 'react-router-dom';


const modelo1 = {
    variables: 2,
    restricciones: 4,
    tipo: "max",
}

const A1 = [
    [1,1],
    [3,7],
    [3,5],
    [3,1]
]
const b1 = [17,63,48,30]
const objetivo1 = [11,14]
const ineq1 = [0,0,0,0]
const tipo1 = 'max'
const binarias1 = [0,0]


export const Ejemplo1 = () => {

    const { modelo, setModelo, A, setA, b, set_b, objetivo, setObjetivo, ineq, setIneq, tipo, setTipo, binarias, setBinarias } = useContext(ParametrosContext)

    const navigate = useNavigate();

    const problema1 = () => {
        setModelo(modelo1)
        setA(A1)
        set_b(b1)
        setObjetivo(objetivo1)
        setIneq(ineq1)
        setTipo(tipo1)
        setBinarias(binarias1)
        setTimeout(()=>{
            navigate('/arbol');
        },150)
    }
    return (
        <NavDropdown.Item onClick={problema1}>Problema 1</NavDropdown.Item>
    )
}

