import React, {useContext, useEffect, useRef, useState}  from 'react';
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
import './Tree.css';
import { MathJax, MathJaxContext } from "better-react-mathjax";
import axios from 'axios';
import { host } from '../../environment/environment';
import { network, Network } from "vis-network";

import {Line} from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js'
  import { Chart } from 'react-chartjs-2'
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  )

const createMatrix = (n,m) =>{
    return Array.from({
        length: n
    }, () => new Array(m).fill(0));
}

const createVector = (m) =>{
    return new Array(m).fill(0)
}

const Tree = () => {

    const { modelo, setModelo, A, setA, b, set_b, objetivo, setObjetivo, ineq, setIneq, tipo, setTipo, binarias, setBinarias } = useContext(ParametrosContext);

    const [A_ub, setA_ub] = useState([])
    const [b_ub, set_b_ub] = useState([])
    const [A_eq, setA_eq] = useState([])
    const [b_eq, set_b_eq] = useState([])
    const [C, setC] = useState([])

    const [changeButtons, setChangeButtons] = useState(false)

    const [iterationType, setIterationType] = useState('steps')
    const [timer, setTimer] = useState(1)
    const [timerValid, setTimerValid] = useState(true)
    const [steps, setSteps] = useState(1)
    const [stepsValid, setStepsValid] = useState(true)
    const [nodeType, setNodeType] = useState('random')
    const [varType, setVarType] = useState('random')
    const [selectedNode, setSelectedNode] = useState(null)

    const [tree, setTree] = useState({})
    const [best_X, setBest_X] = useState([])
    const [actualNode, setActualNode] = useState({})
    const [actualEdge, setActualEdge] = useState({})
    const [nodes, setNodes] = useState([])
    const [infoNodes, setInfoNodes] = useState([])
    const [edges, setEdges] = useState([])
    const [infoEdges, setInfoEdges] = useState([])
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Sin solución entera aún',
                fill: false,
                lineTension: 0.5,
                backgroundColor: '#55D43C',
                borderColor: '#F1D8D3',
                borderWidth: 1,
                data: []
            }
        ],
        options:{
            scales:{
                x:{
                    display:true,
                    grid: {
                        color: '#474747'
                    },
                    title:{
                        display:true,
                        text: '# Iteración',
                        color:'#D0D0D0'
                    },
                    ticks:{
                        color:'#D0D0D0'
                    }
                },
                y:{
                    display:true,
                    grid: {
                        color: '#474747'
                    },
                    title:{
                        display:true,
                        text: 'Función Objetivo Z',
                        color:'#D0D0D0'
                    },
                    ticks:{
                        color:'#D0D0D0'
                    }
                },
            }
        }
    })
    const visJsRef = useRef(null)
    const options = {
        autoResize: true,
        width:'600px',
        height:'400px',
        layout: {
            hierarchical:{
                enabled: true,
                levelSeparation: 120,
                nodeSpacing: 100,
                sortMethod: 'directed',
                shakeTowards: 'roots'
            }
        },
        groups:{
            branched: { color:{background:'#3DAAD6'}, shape:'circle'},
            optimal: { color:{background:'#2FCF22'}, shape:'circle'},
            bounded: { color:{background:'#D58934'}, shape:'box'},
            optimalBounded: { color:{background:'#2FCF22'}, shape:'box'},
            best: { color:{background:'#2FCF22'}, shape:'star'},
            infeasible: { color:{background:'#CB6149'}, shape:'circle'},
            error: { color:{background:'#000000'}, shape:'circle'},
            active: { color:{background:'#DAF7A6'}, shape:'circle'},
        }
    }

    const config = {
        "fast-preview": {
            disabled: true
        },
        tex2jax: {
            inlineMath: [
                ["$", "$"],
                ["\\(", "\\)"]
            ],
            displayMath: [
                ["$$", "$$"],
                ["\\[", "\\]"]
            ]
        },
        messageStyle: "none"
    };

    const chartRef = useRef(null)

    const state = {
        name: 'React',      
        data: {
            labels: [],
            datasets: [{
                data: []
            }]       
        }
    };

    useEffect(()=>{
        transform();
    },[]);

    useEffect(() => {
		const network =
			visJsRef.current &&
			new Network(visJsRef.current, { nodes, edges }, options );
		// Use `network` here to configure events, etc
        network.on('selectNode', (properties) =>{
            if( properties.nodes.length){
                const selectedNodeId = properties.nodes[0]
                const selectedVisNode = infoNodes.find((element) => element.id === selectedNodeId )
                setActualEdge({})
                setActualNode(selectedVisNode)
            }
        })
        network.on('deselectNode', (properties) =>{
            setActualNode({})
            if (properties.edges.length == 1){
                const selectedEdgeId = properties.edges[0]
                const selectedVisEdge = infoEdges.find((element) => element.id === selectedEdgeId )
                setActualEdge(selectedVisEdge);
            }
        })
        network.on('selectEdge', (properties) =>{
            if (properties.nodes.length == 0){
                const selectedEdgeId = properties.edges[0]
                const selectedVisEdge = infoEdges.find((element) => element.id === selectedEdgeId )
                setActualNode({})
                setActualEdge(selectedVisEdge);
            }
        })
        network.on('deselectEdge', (properties) =>{
            setActualEdge({})
        })
	}, [visJsRef, nodes, edges]);

    const transform = () => {
        const n = Number(modelo.restricciones);
        const m = Number(modelo.variables);
        let MA_ub = createMatrix(n,m);
        let Mb_ub = createVector(n);
        let MA_eq = createMatrix(n,m);
        let Mb_eq = createVector(n);
        A.map( (item1,i) => {
            if (ineq[i]==0){
                item1.map((item2,j)=>{
                    MA_ub[i][j] = item2
                })
                Mb_ub[i] = b[i] 
            }
            else if (ineq[i]==1){
                item1.map((item2,j)=>{
                    MA_ub[i][j] = -item2
                })
                Mb_ub[i] = -b[i] 
            }
            else {
                item1.map((item2,j)=>{
                    MA_eq[i][j] = item2
                })
                Mb_eq[i] = b[i] 
            }
        })
        binarias.map((item,index)=>{
            if(item){
                let vector = createVector(m);
                vector[index]=1;
                MA_ub.push(vector)
                Mb_ub.push(1)
            }
        })
        setA_ub(MA_ub);
        set_b_ub(Mb_ub);
        setA_eq(MA_eq);
        set_b_eq(Mb_eq);
        setC(objetivo);
    }

    const showFObj = () => {
        const elem = objetivo.map((item,i)=>{
            return (
                <div key={i}>
                    <MathJax className="fObj_row">
                        {
                            i != 0 ? 
                            item >= 0 ? `$+ ${item} \\cdot x_{${i+1}}$` : `$- ${-item} \\cdot x_{${i+1}}$`
                            : 
                            item >= 0 ? `$${item} \\cdot x_{${i+1}}$` : `$- ${-item} \\cdot x_{${i+1}}$`
                        }
                    </MathJax>
                </div>
            )
        })
        return (
            <div>
                <div className="fObj">
                    <MathJax>{`$ ${tipo}$ $Z:$`}</MathJax>
                    {elem}
                </div>
                <MathJax>{`$ s/a:$`}</MathJax>
            </div>
            
        )
    }

    const showConst = ()=> {
        const elem = A.map( (item1,i) => {
            let rowItem = item1.map((item2,j)=>{
                return (
                    <div key={j}>
                        <MathJax className="fObj_row">
                            {
                                j != 0 ? 
                                item2 >= 0 ? `$+ ${item2} \\cdot x_{${j+1}}$` : `$- ${-item2} \\cdot x_{${j+1}}$`
                                : 
                                item2 >= 0 ? `$${item2} \\cdot x_{${j+1}}$` : `$- ${-item2} \\cdot x_{${j+1}}$`
                            }
                        </MathJax>
                    </div>
                )
            })
            return(
                <div key={i} className="rowItem">
                    <div className="rowA">
                        {rowItem}
                    </div>
                    <MathJax className="fObj_row">
                        {
                            ineq[i] == 0 ? 
                            `$$\\leq $$`
                            : 
                            (
                                ineq[i] == 1 
                                ?
                                `$$\\geq $$`
                                :
                                '$=$'
                            )
                        }
                    </MathJax>
                    <MathJax className="b">
                        {
                            `$${b[i]}$`
                        }
                    </MathJax>
                </div>
            )
        })
        const elem2 = objetivo.map((item,i)=>{
            return (
                <div key={i}>
                    <MathJax>
                        {
                            i < objetivo.length-1 
                            ? 
                            <p className='p1'>{`$x_{${i+1}}$,`}</p>
                            : 
                            <div className='fObj'>
                                <p>{`$x_{${i+1}}$`}</p>
                                <p className='p2'>{`$$\\geq$$`}</p>
                                <p>{`$0$`}</p>
                            </div>
                        }
                    </MathJax>
                </div>
            )
        })
        let lastIndexBinaria;
        binarias.map((item,i)=>{
            if(item) lastIndexBinaria = i
        })
        const elem3 = binarias.map((item,i)=>{
            return (
                <div key={i}>
                    <MathJax>
                        {
                            item
                            ?
                                i < lastIndexBinaria
                                ? 
                                <p className='p1'>{`$x_{${i+1}}$,`}</p>
                                : 
                                <div className='fObj'>
                                    <p>{`$x_{${i+1}}$`}</p>
                                    <p className='p2'>{`$$\\in$$`}</p>
                                    <p>{`$[0,1]$`}</p>
                                </div>
                            :
                            ''
                        }
                    </MathJax>
                </div>
            )
        })
        return (
            <> 
                {elem}
                <div className='rowNat'>
                    {elem2}
                </div>
                <div className='rowBin'>
                    {elem3}
                </div>
            </>
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const change_iterationType = (input) => {
        setIterationType(input.target.value);
        setTimer(1);
        setSteps(1);
        if(input.target.value!='steps' && nodeType=='selectedNode') {
            setNodeType('random')
            setSelectedNode(null)
        }
    }

    const change_timer = (input) => {
        const value = Number(input.target.value);
        const string = String(input.target.value)
        if(string.includes('.')){
            setTimer(1)
            setTimerValid(false)
        }
        else{
            if(value>0){
                setTimer(value)
                setTimerValid(true)
            }
            else{
                setTimer(1)
                setTimerValid(false)
            }
        }
    }

    const change_steps = (input) => {
        const value = Number(input.target.value);
        const string = String(input.target.value)
        if(string.includes('.')){
            setSteps(1)
            setStepsValid(false)
        }
        else{
            if(value>0){
                setSteps(value)
                setStepsValid(true)
            }
            else{
                setSteps(1)
                setStepsValid(false)
            }
        }
        if(value!=1 && nodeType=='selectedNode') {
            setNodeType('random')
            setSelectedNode(null)
        }
    }

    const change_nodeType = (input) => {
        setNodeType(input.target.value)
    }

    const change_varType = (input) => {
        setVarType(input.target.value)
    }

    const getTree1stTime = async () => {
        setBest_X([])
        setActualEdge({})
        setActualNode({})
        let newC = C.slice();
        if (tipo == 'max'){
            newC = newC.map(item=>-1*item)
        }
        let body = {}
        body["type"] = tipo;
        body["root"] = {};
        body["root"]["C"] = newC;
        body["root"]["A_ub"] = A_ub;
        body["root"]["A_eq"] = A_eq;
        body["root"]["B_ub"] = b_ub;
        body["root"]["B_eq"] = b_eq;
        body["firstIteration"] = true;
        body["typeSearch"] = nodeType;
        body["method"] = varType;
        body["iterator"] = {};
        body["iterator"]["type"] = iterationType;
        body["iterator"]["iteration-steps"] = steps;
        body["iterator"]["time-limit"] = timer/1000;
        if(nodeType == "selectedNode"){
            setSelectedNode(null)
            setNodeType("random")
        }
        try{
            await axios.post(host.url+'/optimize', body).then(response =>{
                setTree(response.data);
                const arrayNodes = response.data.visNodes.map(item=>{
                    let obj = {...item};
                    if(item.group != 'best'){
                        if(tipo=='max') obj["label"] = `ID: ${item.id}`
                        else obj["label"] = `ID: ${item.id}`
                    }
                    return obj
                })
                const arrayVisNodes = response.data.visNodes.map(item=>{
                    let obj = {
                        "id":item.id,
                        "group":item.group,
                    };
                    if(item.group != 'best'){
                        if(tipo=='max') obj["label"] = `ID: ${item.id}`
                        else obj["label"] = `ID: ${item.id}`
                    }
                    return obj
                })
                const arrayVisEdges = response.data.visEdges.map(item=>{
                    let obj = {
                        "id":item.id,
                        "from":item.from,
                        "to":item.to
                    };
                    return obj
                })
                setInfoNodes(arrayNodes);
                setInfoEdges(response.data.visEdges);
                setNodes(arrayVisNodes);
                setEdges(arrayVisEdges);
                const labels = response.data.graph.map(item=>item.iteration);
                const dataset = response.data.graph.map(item=>{
                    let z = Number(Number(item.z).toFixed(1))
                    if(tipo=='max') z = Number(-Number(item.z).toFixed(1))
                    return {
                        x: item.iteration,
                        y: z
                    }
                })
                const dataset2 = response.data.graph2.map(item=>{
                    let z = Number(Number(item.z).toFixed(1))
                    if(tipo=='max') z = Number(-Number(item.z).toFixed(1))
                    return {
                        x: item.iteration,
                        y: z
                    }
                })
                let newData = {...data};
                newData["labels"] = labels;
                newData["datasets"] = [
                    {
                        label: response.data.graph.length ? `Mejor Z` :'Sin solución entera aún',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: '#55D43C',
                        borderColor: '#55D43C',
                        borderWidth: 1,
                        data: dataset
                    },
                    {
                        label: response.data.graph2.length ? `Soluciones Enteras` :'Sin solución entera aún',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: '#bb132b',
                        borderColor: '#bb132b',
                        borderWidth: 1,
                        data: dataset2
                    }
                ]
                setData(newData)
                if(response.data.bestX && response.data.bestX.length>0){
                    setBest_X(response.data.bestX)
                }
            })
        }catch(error){
            console.log(error);
        }
    }

    const getTree = async () => {
        setActualEdge({})
        setActualNode({})
        let body = tree
        body["firstIteration"] = false;
        body["typeSearch"] = nodeType;
        body["method"] = varType;
        body["iterator"] = {};
        body["iterator"]["type"] = iterationType;
        body["iterator"]["iteration-steps"] = steps;
        body["iterator"]["time-limit"] = timer/1000;
        if(iterationType=="steps" && steps == 1) body["iterator"]["selection"] = { selected: true, id: selectedNode};
        else body["iterator"]["selection"] = { selected: false, id: 0};
        if(nodeType == "selectedNode"){
            setSelectedNode(null)
            setNodeType("random")
        }
        try{
            await axios.post(host.url+'/optimize', body).then(response =>{
                let arbol = response.data
                arbol["iterator"]["selection"] = { selected: false, id: 0};
                setTree(arbol);
                const arrayNodes = response.data.visNodes.map(item=>{
                    let obj = {...item};
                    if(item.group != 'best'){
                        if(tipo=='max') obj["label"] = `ID: ${item.id}`
                        else obj["label"] = `ID: ${item.id}`
                    }
                    return obj
                })
                const arrayVisNodes = response.data.visNodes.map(item=>{
                    let obj = {
                        "id":item.id,
                        "group":item.group,
                    };
                    if(item.group != 'best'){
                        if(tipo=='max') obj["label"] = `ID: ${item.id}`
                        else obj["label"] = `ID: ${item.id}`
                    }
                    return obj
                })
                const arrayVisEdges = response.data.visEdges.map(item=>{
                    let obj = {
                        "id":item.id,
                        "from":item.from,
                        "to":item.to
                    };
                    return obj
                })
                setInfoNodes(arrayNodes);
                setInfoEdges(response.data.visEdges);
                setNodes(arrayVisNodes);
                setEdges(arrayVisEdges);
                const labels = response.data.graph.map(item=>item.iteration);
                const dataset = response.data.graph.map(item=>{
                    let z = Number(Number(item.z).toFixed(1))
                    if(tipo=='max') z = Number(-Number(item.z).toFixed(1))
                    return {
                        x: item.iteration,
                        y: z
                    }
                })
                const dataset2 = response.data.graph2.map(item=>{
                    let z = Number(Number(item.z).toFixed(1))
                    if(tipo=='max') z = Number(-Number(item.z).toFixed(1))
                    return {
                        x: item.iteration,
                        y: z
                    }
                })
                let newData = {...data};
                newData["labels"] = labels;
                newData["datasets"] = [
                    {
                        label: response.data.graph.length ? `Mejor Z` :'Sin solución entera aún',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: '#55D43C',
                        borderColor: '#55D43C',
                        borderWidth: 1,
                        data: dataset
                    },
                    {
                        label: response.data.graph2.length ? `Soluciones Enteras` :'Sin solución entera aún',
                        fill: false,
                        lineTension: 0.5,
                        backgroundColor: '#bb132b',
                        borderColor: '#bb132b',
                        borderWidth: 1,
                        data: dataset2
                    }
                ]
                setData(newData)
                if(response.data.bestX && response.data.bestX.length>0){
                    setBest_X(response.data.bestX)
                }
            })
        }catch(error){
            console.log(error.response);
        }
    }

    const showTree = () =>{
        let body = tree;
        console.log(body);
    }

    const getX = () => {
        let variables = ''
        let answers = ''
        let variable, answer
        let z_opt
        if(best_X.length > 0){
            z_opt = Number(tree.bestZ).toFixed(0)
            if(tipo == 'max') z_opt = Number(-tree.bestZ).toFixed(0)
            for(let i = 0; i< best_X.length;i++){
                if(i!=best_X.length-1){
                    variable = String.raw`x_{${i+1}}\\`
                    answer = String.raw`${best_X[i]}\\`
                }
                else {
                    variable = `x_{${i+1}}`
                    answer = String.raw`${best_X[i]}`
                }
                variables = variables + variable
                answers = answers + answer
            }
        }
        let elem
        const chance = Number(tree.error*100).toFixed(1)
        elem =(
            <MathJax className='solv' dynamic = {true}>
                    {`$$Error_{máximo}= ${chance}\\% $$`}
            </MathJax>
        )
        /*if(chance>0){
            elem =(
                <MathJax className='solv' dynamic = {true}>
                        {`$$Error_{máximo}= ${chance}\\% $$`}
                </MathJax>
            )
        }
        else{
            elem =(
                <MathJax className='solv' dynamic = {true}>
                        {`$$Error_{máximo}= ${0}\\% $$`}
                </MathJax>
            )
        }*/
        return (
            <div>        
                {
                    best_X.length > 0
                    ?
                    <div>
                        <div className='solucion'>
                            <MathJax className='solv' dynamic = {true}>
                                {`$$Nodos_{árbol} = ${tree.maxId} $$`}
                            </MathJax>
                            <MathJax className='solv' dynamic = {true}>
                                {`$$Altura_{árbol} = ${tree.height} $$`}
                            </MathJax>
                        </div>
                        <div className='solucion'>
                            <MathJax className='solv' dynamic = {true}>
                                {`$$X_{óptimo} = \\begin{bmatrix}${variables}\\end{bmatrix} = \\begin{bmatrix}${answers}\\end{bmatrix} $$`}
                            </MathJax>
                            <MathJax className='solv' dynamic = {true}>
                                {`$$Z_{óptimo} = ${z_opt} $$`}
                            </MathJax>
                        </div>
                        <div className='solucion'>
                            {elem}
                        </div>
                        <div className='solucion'>
                            <MathJax className='solv' dynamic = {true}>
                                {`$$Total_{Iteraciones} = ${tree.totalIterations} $$`}
                            </MathJax>
                            <MathJax className='solv' dynamic = {true}>
                                {`$$Total_{Tiempo} = ${Number(tree.totalRunTime * 1000).toFixed(2)} [ms] $$`}
                            </MathJax>
                        </div>
                        <div className='solucion'>
                            <MathJax className='solv' dynamic = {true}>
                                {`$$Iteración_{óptimo} = ${tree.bestIter} $$`}
                            </MathJax>
                            <MathJax className='solv' dynamic = {true}>
                                {`$$Tiempo_{óptimo} = ${Number(tree.bestTime * 1000).toFixed(2)} [ms] $$`}
                            </MathJax>
                        </div>
                        <div className='solucion'>
                            <MathJax className='solv' dynamic = {true}>
                                {`$$Iteración_{PSE} = ${tree.firstIntegerIter} $$`}
                            </MathJax>
                            <MathJax className='solv' dynamic = {true}>
                                {`$$Tiempo_{PSE} = ${Number(tree.firstIntegerTime * 1000).toFixed(2)} [ms] $$`}
                            </MathJax>
                        </div>
                    </div>
                    : 
                    <div></div>
                }
            </div>
        )
    }

    const showNode = () => {
        if(Object.keys(actualNode).length !== 0){
            let variables = ''
            let answers = ''
            let variable, answer, tipoNodo
            let value
            if(actualNode.x && actualNode.group != 'infeasible' && actualNode.x.length > 0){
                value = Number(actualNode.z).toFixed(1)
                if(tipo == 'max') value = Number(-actualNode.z).toFixed(6)
                for(let i = 0; i< actualNode.x.length;i++){
                    if(i!=actualNode.x.length-1){
                        variable = String.raw`x_{${i+1}}\\`
                        answer = String.raw`${Number(actualNode.x[i]).toFixed(6)}\\`
                    }
                    else {
                        variable = `x_{${i+1}}`
                        answer = String.raw`${Number(actualNode.x[i]).toFixed(6)}`
                    }
                    variables = variables + variable
                    answers = answers + answer
                }
                switch(actualNode.group){
                    case 'branched':
                        tipoNodo = 'Ramificado.'
                        break
                    case 'optimal':
                        tipoNodo = 'Podado por optimalidad.'
                        break
                    case 'bounded':
                        tipoNodo = 'Podado por cota.'
                        break
                    case 'optimalBounded':
                        tipoNodo = 'Podado por cota y solución entera no óptima.'
                        break
                    case 'best':
                        tipoNodo = 'Podado por optimalidad y mejor solución.'
                        break
                    case 'active':
                        tipoNodo = 'Activo.'
                        break
                    case 'infeasible':
                        tipoNodo = 'Podado por infeasibilidad.'
                        break
                }
                return(
                    <div className='actualNode-container'>
                        <MathJax dynamic = {true}>
                            {`$$X = \\begin{bmatrix}${variables}\\end{bmatrix} = \\begin{bmatrix}${answers}\\end{bmatrix} $$`}
                        </MathJax>
                        <MathJax dynamic = {true}>
                            {`$$Z = ${value} $$`}
                        </MathJax>
                        <div>Nodo: {tipoNodo}</div>
                    </div>
                )
            }
            else if (actualNode && actualNode.group == 'infeasible'){
                return(
                    <div className='actualNode-container'>
                        <div>Nodo: Podado por infeasibilidad.</div>
                    </div>
                )
            }
        }
    }

    const showEdge = () => {
        if(Object.keys(actualEdge).length !== 0){
            let direction
            if(actualEdge.direction == 'left')
                direction = 'leq'
            else direction = 'geq'
            return(
                <div className='actualNode-container'>
                    <MathJax dynamic = {true}>
                        {`$$ x_{${actualEdge.varIdx+1}} \\${direction} ${actualEdge.newValue} $$`}
                    </MathJax>
                    {
                        actualEdge.direction == 'left'
                        ?
                        'Rama izquierda.'
                        :
                        'Rama derecha.'
                    }
                </div>
            )
        }
    }

    const changeSelectedNode = (input) => {
        setSelectedNode(Number(input.target.value))
    }

    const selectionNode = () =>{
        if(iterationType=="steps" && steps==1 && tree && 'activeNodesIds' in tree && tree.activeNodesIds.length>0 && nodeType=='selectedNode'){
            let activeNodes = tree.activeNodesIds.map((item)=>{
                return(item.id)
            }).sort(function(a, b){return a - b})
            const activeNodesOptions = activeNodes.map((item,i)=>{
                return (<option value={item} key={i}>{`ID: ${item}`}</option>)
            })
            return(
                <select
                    className='selectionNode'
                    value={selectedNode}
                    onChange={(e) => changeSelectedNode(e)}
                >
                    <option selected={true} disabled="disabled">Seleccionar Nodo</option>
                    {activeNodesOptions}
                </select>
            )
        }
    }

    const refreshPage = () => {
        setTimeout(()=>{
            window.location.reload(false);
        },150)
    }

    return (
        <div className='container-fluid'>
            <Row>
                    <Col md={1} >
                        <Link to={ { pathname: `/` } }>
                                <Button className='btn-home' variant="primary" onClick={refreshPage}>Inicio</Button>{' '}
                        </Link>
                    </Col>
                    <Col md={11} >
                    </Col>
                </Row>
            <div className='center-elems'>
                <MathJaxContext 
                    version={2}
                    config={config}
                    onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
                >
                    {showFObj()}
                    {showConst()}
                </MathJaxContext>
            </div>
            <div className="selectors">
                <div className="iterationType">
                    <div>
                        Método de iteración:
                    </div>
                    <select 
                        className='iterType'
                        value={iterationType}
                        onChange={(e) => change_iterationType(e)}
                    >
                        <option value={'unlimited'}>{'Sin parar'}</option>
                        <option value={'timer'}>{'Por tiempo'}</option>
                        <option value={'steps'}>{'Por pasos'}</option>
                    </select>
                    {
                        iterationType == 'timer' 
                        ?
                        <div className="form-view1">
                            <form onSubmit={handleSubmit}>
                                {
                                    timerValid
                                    ?
                                    <input className='input_timer' type="number" min="1" placeholder='1' onChange={change_timer}/>
                                    :
                                    <input className='input_timer red' type="number" min="1" placeholder='1' onChange={change_timer}/>
                                }
                            </form>
                            <div className='input_label'>milisegundos</div>
                        </div>
                        :
                        (
                            iterationType == 'steps'
                            ?
                            <div className="form-view2">
                                <form onSubmit={handleSubmit}>
                                    {
                                        stepsValid
                                        ?
                                        <input className='input_steps' type="number" min="1" placeholder='1' onChange={change_steps}/>
                                        :
                                        <input className='input_steps red' type="number" min="1" placeholder='1' onChange={change_steps}/>
                                    }
                                </form>
                                <div className='input_label_steps'>pasos</div>
                            </div>
                            :
                            ''
                        )
                    }
                </div>
                <div className="iterationNode">
                    <div>
                        Selección de nodo activo:
                    </div>
                    <select 
                        className='iterNode'
                        value={nodeType}
                        onChange={(e) => change_nodeType(e)}
                    >
                        <option value={'random'}>{'Aleatoria'}</option>
                        <option value={'inorder'}>{'Inorden'}</option>
                        <option value={'preorder'}>{'Preorden'}</option>
                        <option value={'postorder'}>{'Postorden'}</option>
                        <option value={'bestBounded'}>{'Nodo con mejor cota'}</option>
                        <option value={'worstBounded'}>{'Nodo con peor cota'}</option>
                        {
                            iterationType=='steps' && steps == 1 && 'activeNodesIds' in tree && tree.activeNodesIds.length>0
                            ?
                            <option value={'selectedNode'}>{'Por selección'}</option>
                            :
                            ''
                        }
                    </select>
                    {
                        selectionNode()
                    }
                </div>
                <div className="iterationVar">
                    <div>
                        Selección de variable no entera:
                    </div>
                    <select 
                        className='iterVar'
                        value={varType}
                        onChange={(e) => change_varType(e)}
                    >
                        <option value={'random'}>{'Aleatoria'}</option>
                        <option value={'lexic'}>{'En orden'}</option>
                        <option value={'inverse-lexic'}>{'En orden inverso'}</option>
                        <option value={'nearest-toInt'}>{'Más cercana a entero'}</option>
                        <option value={'farthest-toInt'}>{'Más lejana a entero'}</option>
                        <option value={'maxValue'}>{'Mayor valor'}</option>
                        <option value={'minValue'}>{'Menor valor'}</option>
                        <option value={'more-restricted'}>{'Más restringida'}</option>
                        <option value={'less-restricted'}>{'Menos restringida'}</option>
                        <option value={'more-connected'}>{'Más conectada'}</option>
                        <option value={'less-connected'}>{'Menos conectada'}</option>
                    </select>
                </div>
            </div>
            <div className="button-container">
                {
                    !changeButtons
                    ?
                    <Button className='primary btnContinuar btn-tree' onClick={()=>{getTree1stTime(); setChangeButtons(true)}}>
                        Crear Raíz
                    </Button>
                    :
                    <div>
                        {
                            tree && tree.activeNodesIds && tree.activeNodesIds.length>0
                            ?
                            <Button className='primary btnContinuar btn-tree' onClick={getTree}>
                                Resolver
                            </Button>
                            :
                            <div></div>
                        }
                        <Button className='primary btnContinuar btn-tree' onClick={getTree1stTime}>
                            Reset
                        </Button>
                    </div>
                }
            </div>
            <Row>
                <Col md={1} >
                </Col>
                <Col md={4}>
                    <div className='tree' ref={visJsRef} />
                </Col>
                <Col md={2}>
                    <div className='actualNode-container'>
                        <div>Info selección:</div>
                        {
                            Object.keys(actualNode).length !== 0
                            ?
                            <MathJaxContext 
                                version={2}
                                config={config}
                                onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
                            >
                                { showNode()}
                            </MathJaxContext>
                            :
                            (
                                Object.keys(actualEdge).length !== 0
                                ?
                                <MathJaxContext 
                                    version={2}
                                    config={config}
                                    onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
                                >
                                    { showEdge()}
                                </MathJaxContext>
                                :
                                'Seleccione algún nodo o arco para ver su información.'
                            )
                        }
                    </div>
                </Col>
                <Col md={4}>
                    <Line
                        className='grafico'
                        data={data}
                        options={data.options}
                    />
                    <MathJaxContext 
                        version={2}
                        config={config}
                        onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
                    >
                        { best_X.length>0 ? getX() : ''}
                    </MathJaxContext>
                </Col>
                <Col md={1} >
                </Col>
            </Row>
        </div>
    );
};

export default Tree;
