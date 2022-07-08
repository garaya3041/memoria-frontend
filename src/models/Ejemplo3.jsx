import React, {useContext, useEffect, useState}  from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import {ParametrosContext} from '../context/ParametrosProvider';
import {Routes, Route, useNavigate} from 'react-router-dom';


const modelo1 = {
    variables: 14,
    restricciones: 13,
    tipo: "max",
}

const A1 = [
    [6,2,3,0,0,0,1,0,4,0,0,5,0,0],
    [0,3,5,0,5,0,8,0,5,8,0,7,1,4],
    [0,0,0,0,8,1,0,0,0,4,2,0,4,5],
    [0,0,0,0,0,8,0,5,0,0,7,0,1,3],
    [0,0,0,10,0,4,0,0,0,0,0,0,1,3],
    [0,0,0,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,1,0,0,1,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,0,1],
    [0,-1,0,0,0,0,0,0,0,0,1,0,0,0],
    [0,0,-1,1,0,0,0,0,0,0,0,0,0,0],
    [0,0,-1,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,-1,0,0,1,0,0,0,0,0,0,0,0],
    [0,0,-1,0,0,0,1,0,0,0,0,0,0,0]
]
const b1 = [10,12,14,14,14,1,1,1,0,0,0,0,0]
const objetivo1 = [200,3,20,50,70,20,5,10,200,150,18,8,300,185]
const ineq1 = [0,0,0,0,0,0,0,0,0,0,0,0,0]
const tipo1 = 'max'
const binarias1 = [1,1,1,1,1,1,1,1,1,1,1,1,1,1]

export const Ejemplo3 = () => {

    const { modelo, setModelo, A, setA, b, set_b, objetivo, setObjetivo, ineq, setIneq, tipo, setTipo, binarias, setBinarias } = useContext(ParametrosContext)

    const navigate = useNavigate();

    const problema3 = () => {
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
        <NavDropdown.Item onClick={problema3}>Problema 3</NavDropdown.Item>
    )
}

