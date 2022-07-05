import React, { Component } from 'react'
import logo from '../../img/Departamento-de-Informtica_HORIZONTAL.png'
import './header.css';

const header = () => {
  return (
    <div className='logo'>
        <img className='img' src={logo} alt="" />
    </div>
  )
}

export default header