import React, {useContext, useEffect, useState}  from 'react';
import HeaderUSM from '../../components/header/headerUSM';
import NavbarUSM from '../../components/navbar/navbarUSM';
import { Row, Col } from 'react-bootstrap';
import {
    BrowserRouter as Router,
    Link,
    Route,
    Routes,
    useParams
} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import {ParametrosContext} from '../../context/ParametrosProvider';
import './Parameters.css';

const createMatrix = (n,m) =>{
    return Array.from({
        length: n
    }, () => new Array(m).fill(0));
}

const createVector = (m) =>{
    return new Array(m).fill(0)
}

const Parameters = (props) => {

    const { modelo, setModelo, A, setA, b, set_b, objetivo, setObjetivo, ineq, setIneq, tipo, setTipo, binarias, setBinarias } = useContext(ParametrosContext)

    useEffect(()=>{
        setTipo(modelo.tipo);
        const n = Number(modelo.restricciones);
        const m = Number(modelo.variables);
        const matrixOfCeros = createMatrix(n,m);
        const vectorOfCeros = createVector(n); // # de restricciones
        const vectorOfCerosM = createVector(m); // # de variables
        setA(matrixOfCeros);
        set_b(vectorOfCeros);
        setIneq(vectorOfCeros);
        setObjetivo(vectorOfCerosM);
        setBinarias(vectorOfCerosM);
    },[])

    const inputs_A = ()=> {
        const elem = A.map( (item1,i) => {
            let rowItem = item1.map((item2,j)=>{
                return (
                    <div className='input_b_container' key={j}>
                        <input className='input_b' type="number" placeholder='0' onChange={(e)=> change_A(e,i,j)}/>
                        <div>
                            {
                                j < item1.length-1 ? `x${j+1} + `: ` x${j+1} `
                            }
                        </div>
                    </div>
                )
            })
            return(
                <div key={i} className="rowItem">
                    <div className='restriccion'>R{`${i+1} : `} </div>
                    {rowItem}
                    <select 
                        className='ineq'
                        value={ineq[i]}
                        onChange={(e) => change_ineq(e,i)}
                    >
                        <option value={0}>{'<='}</option>
                        <option value={1}>{'>='}</option>
                        <option value={2}>{'='}</option>
                    </select>
                    <input className='input_b' type="number" placeholder='0' onChange={(e)=> change_b(e,i)}/>
                </div>
            )
        })
        const elem2 = objetivo.map((item,i)=>{
            return (
                <div className='input_b_container' key={i}>
                    <div>
                        {
                            i < objetivo.length-1 ? `x${i+1} ,`: ` x${i+1} >= 0`
                        }
                    </div>
                </div>
            )
        })
        return (
            <>
                {elem}
                <div className='rowNat'>
                    {elem2}
                </div>
            </>
        )
    }

    const change_A = (input,i,j) => {
        let matrix = [...A];
        matrix[i][j] = Number(input.target.value)
        setA(matrix)
    }

    const change_b = (input,i) => {
        let vector = [...b];
        vector[i] = Number(input.target.value)
        set_b(vector)
    }

    const change_ineq = (input,i) => {
        let vector = [...ineq];
        vector[i] = Number(input.target.value)
        setIneq(vector)
    }

    const func_Obj = () => {
        const elem = objetivo.map((item,i)=>{
            return (
                <div className='input_b_container' key={i}>
                    <input className='input_b' type="number" placeholder='0' onChange={(e)=> change_FObj(e,i)}/>
                    <div>
                        {
                            i < objetivo.length-1 ? `x${i+1} + `: ` x${i+1} `
                        }
                    </div>
                </div>
            )
        })
        return (
            <div className="fObj">
                <select 
                    className='MaxMin'
                    value={tipo}
                    onChange={(e) => change_tipo(e)}
                >
                    <option value={'max'}>{'max'}</option>
                    <option value={'min'}>{'min'}</option>
                </select>
                {elem}
            </div>
        )
    }

    const change_FObj = (input,i) => {
        let vector = [...objetivo];
        vector[i] = Number(input.target.value)
        setObjetivo(vector)
    }

    const change_tipo = (input) => {
        setTipo(input.target.value)
    }

    const change_binarias = (i) => {
        let vector = [...binarias];
        vector[i] = !vector[i]
        setBinarias(vector)
    }

    const inputBinarias = () => {
        const elem = binarias.map((item,i)=>{
            return (
                <div className='input_binaria_container' key={i}>
                    <input 
                    className='input_binarias' 
                    type="checkbox"
                    checked={binarias[i]}
                    onChange={() => change_binarias(i)}/>
                    <div className="name-binaria">
                        {
                            i < objetivo.length-1 ? `x${i+1}`: ` x${i+1} `
                        }
                    </div>
                </div>
            )
        })
        return (
            <div className="variables-binarias-container">
                {elem}
            </div>
        )
    }

    return (
        <div className='container-fluid'>
            <HeaderUSM />
            <NavbarUSM />
            <div className="b_ub">
                <h3 className='titulo'>Función Objetivo:</h3>
                {func_Obj()}
                <h3 className='titulo'>Restricciones:</h3>
                {inputs_A()}
                <h4 className='titulo'>Seleccionar variables binarias:</h4>
                {inputBinarias()}
                <Link to={ { pathname: `/arbol` } }>
                    <Button className='primary btnContinuar'>
                        Continuar
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default Parameters;
