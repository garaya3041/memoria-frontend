import React from 'react'
import HeaderUSM from '../../components/header/headerUSM'
import NavbarUSM from '../../components/navbar/navbarUSM'
import { Row, Col } from 'react-bootstrap';
import './Tutorial.css';

const Tutorial = () => {
  return (
    <>
        <HeaderUSM />
        <NavbarUSM className="navbar" />
        <div className="fluid-container">
            <Row>
                <Col md={2}></Col>
                <Col md={8}>
                    <div className="elements-center">
                        <div className="bienvenida">
                            <h2 className="titulo">
                                Métodos de iteración
                            </h2>
                            <h5>El método de Ramificación y Acotamiento actualiza el estado de su árbol agregando o eliminando nodos activos hasta que
                              ya no quedan más. A continuación se muestran las opciones para determinar la cantidad o tiempo de actualización del árbol:
                            </h5>
                            <div className="content">
                              <ol>
                                <li><strong>Sin parar: </strong>
                                El método de Ramificación y Acotamiento actualiza el árbol hasta que ya no queden nodos activos.
                                </li>
                                <br />
                                <li><strong>Por tiempo: </strong>
                                El método de Ramificación y Acotamiento actualiza el árbol durante una cantidad N de milisegundos según lo ingresado en el input.
                                </li>
                                <br />
                                <li><strong>Por pasos: </strong>
                                El método de Ramificación y Acotamiento actualiza una cantidad de N veces el árbol según lo ingresado en el input.
                                </li>
                                <br />
                              </ol>
                            </div>
                        </div>
                        <div className="bienvenida">
                            <h2 className="titulo">
                                Búsqueda de nodo activo
                            </h2>
                            <h5>Dado que es a través de los nodos activos que se actualiza el estado del árbol, no es trivial la selección de éstos ya que
                              puede impactar en el rendimiento del método de Ramificación y Acotamiento. A continuación se listan
                              las distintas heurísticas con las que se puede buscar un nodo activo:
                            </h5>
                            <div className="content">
                              <ol>
                                <li><strong>Aleatoria: </strong>
                                Se selecciona un nodo activo del árbol aleatoriamente.
                                </li>
                                <br />
                                <li><strong>Inorden: </strong>
                                Se selecciona el primer nodo activo que se encuentre realizando una búsqueda en profundidad en orden(In-order DFS).
                                </li>
                                <br />
                                <li><strong>Preorden: </strong>
                                Se selecciona el primer nodo activo que se encuentre realizando una búsqueda en profundidad en preorden(Pre-order DFS).
                                </li>
                                <br />
                                <li><strong>Postorden: </strong>
                                Se selecciona el primer nodo activo que se encuentre realizando una búsqueda en profundidad en postorden(Post-order DFS).
                                </li>
                                <br />
                                <li><strong>Nodo con mejor cota: </strong>
                                Se selecciona el nodo activo que tenga el mejor valor de su función objetivo (el menor valor para minimización y el mayor valor para maximización).
                                </li>
                                <br />
                                <li><strong>Nodo con peor cota: </strong>
                                Se selecciona el nodo activo que tenga el peor valor de su función objetivo (el mayor valor para minimización y el menor valor para maximización).
                                </li>
                                <br />
                                <li><strong>Por selección: </strong>
                                Se selecciona el nodo activo manualmente, según su ID. Esta opción sólo está disponible si el método de iteración es de 1 paso.
                                </li>
                                <br />
                              </ol>
                            </div>
                        </div>
                        <div className="bienvenida">
                            <h2 className="titulo">
                                Selección de variable no entera:
                            </h2>
                            <h5>Los nodos se definen activos si alguna de las variables de su solución X no es un número entero. 
                              Es por ello que no es trivial la selección de cuál de entre todas éstas se realizará una ramificación.
                              A continuación se listan las distintas heurísticas con las que se puede escoger una variable no entera:
                            </h5>
                            <div className="content">
                              <ol>
                                <li><strong>Aleatoria: </strong>
                                Se selecciona una variable no entera aleatoriamente.
                                </li>
                                <br />
                                <li><strong>En orden: </strong>
                                Se selecciona la primera variable no entera en orden lexicográfico, es decir, la variable con el menor subíndice.
                                </li>
                                <br />
                                <li><strong>En orden inverso: </strong>
                                Se selecciona la última variable no entera en orden lexicográfico, es decir, la variable con el mayor subíndice.
                                </li>
                                <br />
                                <li><strong>Más cercana a entero: </strong>
                                Se selecciona la variable no entera cuyo valor sea el más cercano a un número entero.
                                </li>
                                <br />
                                <li><strong>Más lejana a entero: </strong>
                                Se selecciona la variable no entera cuyo valor sea el más alejado a un número entero.
                                </li>
                                <br />
                                <li><strong>Mayor valor: </strong>
                                Se selecciona la variable no entera cuyo valor sea el mayor.
                                </li>
                                <br />
                                <li><strong>Menor valor: </strong>
                                Se selecciona la variable no entera cuyo valor sea el menor.
                                </li>
                                <br />
                                <li><strong>Más restringida: </strong>
                                Se selecciona la variable no entera que aparezca en más restricciones.
                                </li>
                                <br />
                                <li><strong>Menos restringida: </strong>
                                Se selecciona la variable no entera que aparezca en menos restricciones.
                                </li>
                                <br />
                                <li><strong>Más conectada: </strong>
                                Se selecciona la variable no entera que en un grafo de restricciones, tenga el mayor grado.
                                </li>
                                <br />
                                <li><strong>Menos conectada: </strong>
                                Se selecciona la variable no entera que en un grafo de restricciones, tenga el menor grado.
                                </li>
                                <br />
                              </ol>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={2}></Col>
            </Row>
            
        </div>
    </>
  )
}

export default Tutorial