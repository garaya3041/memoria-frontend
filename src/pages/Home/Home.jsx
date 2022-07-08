import React, {useContext, useEffect} from 'react'
import HeaderUSM from '../../components/header/headerUSM';
import Button from 'react-bootstrap/Button';
import './Home.css';
import Modal from 'react-modal';
import { useState } from "react";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Link,
} from "react-router-dom";
import {ParametrosContext} from '../../context/ParametrosProvider';
import NavbarUSM from '../../components/navbar/navbarUSM';
import { Row, Col } from 'react-bootstrap';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        background: '#728295',
        color: 'white',
        width: '50%'
    },
};

Modal.setAppElement('#root');

const Home = () => {

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const { modelo, setModelo } = useContext(ParametrosContext)

    useEffect(()=>{
        setModelo({
            variables: 1,
            restricciones: 1,
            tipo: "min",
        })
    },[])

    const openModal = () => {
        setIsOpen(true);
    }
    
    const closeModal = () => {
        setIsOpen(false);
    }

    const continuar = () => {
        setIsOpen(false);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    const handleChange = (e) => {
        setModelo((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const numVar = () => {
        let variables = []
        for(let i=1; i<16;i++){
            variables.push(i)
        }
        return variables.map((item,i) => <option key={i} value={item}>{item}</option>)
    }

    const numRes = () => {
        let restricciones = []
        for(let i=1; i<51;i++){
            restricciones.push(i)
        }
        return restricciones.map((item,i) => <option key={i} value={item}>{item}</option>)
    }

    return (
        <>
        <HeaderUSM />
        <NavbarUSM />
        <div className="fluid-container">
            <Row>
                <Col md={3}></Col>
                <Col md={6}>
                    <div className="elements-center">
                        <div className="bienvenida">
                            <h2 className="titulo">
                                Bienvenid@
                            </h2>
                            <div className="content">
                                <p>Este es un solver para modelos de programación lineal entera (PLE) de hasta 15 variables y 50 restricciones excluyendo las de naturaleza. Para monitores inferiores a 1080px de ancho se recomienda no más de 10 variables.
                                La técnica que se usará para resolverlo es el método de Ramificación y Acotamiento (Branch & Bound) y tendrás la posibilidad de ver cómo se construye el árbol de solución e incluso de modificar sus parámetros de resolución mientras aún itera el solver.</p>
                                <p>Para empezar, ingresa los metadatos del modelo en el siguiente enlace:</p>
                            </div>
                        </div>
                        <Button onClick={openModal} variant="primary">Crear Modelo</Button>{' '}
                        <Modal
                            isOpen={modalIsOpen}
                            onRequestClose={closeModal}
                            style={customStyles}
                            contentLabel="Example Modal"
                        >
                            <h2>Sobre el modelo...</h2>
                            <form onSubmit={handleSubmit}>
                                Indique si la función objetivo es de minimización o maximización:
                                <select
                                    className="form-control mb-2"
                                    name="tipo"
                                    value={modelo.tipo}
                                    onChange={handleChange}
                                >
                                    <option value={"min"}>Minimización</option>
                                    <option value={"max"}>Maximización</option>
                                </select>
                                Seleccione el número de variables:
                                <select
                                    className="form-control mb-2"
                                    name="variables"
                                    value={modelo.variables}
                                    onChange={handleChange}
                                >
                                    {numVar()}
                                </select>
                                Seleccione el número de restricciones sin considerar las de naturaleza:
                                <select
                                    className="form-control mb-2"
                                    name="restricciones"
                                    value={modelo.restricciones}
                                    onChange={handleChange}
                                >
                                    {numRes()}
                                </select>
                            </form>
                            <div className="rowFinal">
                                <Link to={ { pathname: `parametros/` } }>
                                    <Button variant="primary">Continuar</Button>{' '}
                                </Link>
                            </div>
                        </Modal>
                    </div>
                </Col>
                <Col md={3}></Col>
            </Row>
            
        </div>
        </>
    )
}

export default Home
