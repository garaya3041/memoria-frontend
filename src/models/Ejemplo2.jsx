import React, {useContext, useEffect, useState}  from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import {ParametrosContext} from '../context/ParametrosProvider';
import {Routes, Route, useNavigate} from 'react-router-dom';


const modelo1 = {
    variables: 6,
    restricciones: 1,
    tipo: "max",
}

const A1 = [[5,7,4,3,4,6]]
const b1 = [14]
const objetivo1 = [16,22,12,8,11,19]
const ineq1 = [0]
const tipo1 = 'max'
const binarias1 = [1,1,1,1,1,1]

export const Ejemplo2 = () => {

    const { modelo, setModelo, A, setA, b, set_b, objetivo, setObjetivo, ineq, setIneq, tipo, setTipo, binarias, setBinarias } = useContext(ParametrosContext)

    const navigate = useNavigate();

    const problema2 = () => {
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
        <NavDropdown.Item onClick={problema2}>Problema 2</NavDropdown.Item>
    )
}

