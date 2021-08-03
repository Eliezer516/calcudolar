"use strict";
// IMPORTS
import './estilos.scss'
import './ripple.js'
import './darkmode.js'

document.addEventListener('DOMContentLoaded', () => {
	// CONSTANTES Y VARIABLES
	const app = document.querySelector('.app')
	const precio_promedio = document.querySelector('#precio_promedio')
	const btn_calcular    = document.querySelector('#btn-calcular')
	const canDolares      = document.querySelector('#entrada_cantidad')
	const alerta          = document.querySelector('.alert')
	const exitoso         = document.querySelector('.exitoso')
	const no_exitoso      = document.querySelector('.no_exitoso')
	const lbl_salida      = document.querySelector('.exitoso h2')
	const lbl_dolares     = document.querySelector('.exitoso h3 span')
	const lbl_hora        = document.querySelector('#hora')
	const info_icon       = document.querySelector('.info-icon')
	const info_text       = document.querySelector('.info-text')
	const btn_cerrar_info = document.querySelector('.info-text button')
	const btn_reload      = document.querySelector('#reload')
	let dolares;
	let precioTotal;
	// LISTENERS
	app.addEventListener('submit', e => {
		e.preventDefault()
	})
	btn_reload.addEventListener('click', () => {
		location.reload()
	})
	btn_cerrar_info.addEventListener('click', () => {
		info_text.classList.remove('info-active')
	})
	info_icon.addEventListener('click', ()=>{
		info_text.classList.add('info-active')
	})
	btn_calcular.addEventListener('click', () => {
		if (canDolares.value === '' || canDolares.value === '1' || canDolares.value === '0') {
			alerta.style.cssText = "opacity: 1; pointer-events: initial;"
			setTimeout(() => {
				alerta.style.cssText = "opacity: 0; pointer-events: none;"
			}, 5000)
		}else{
			if (precioTotal === undefined) {
				no_exitoso.style.cssText = "opacity: 1; pointer-events: initial; display: block;"
			}else{
				dolares = parseFloat(canDolares.value);
				lbl_dolares.innerText = dolares
				CalcularDolares(dolares, precioTotal)
				exitoso.style.cssText = "opacity: 1; pointer-events: initial; display: block"
			}
		}
	})
	// FUNCIONES
	async function obtenerDatos(){
		try {
			
			const respuesta           = await fetch('https://s3.amazonaws.com/dolartoday/data.json')
			const json                = await respuesta.json()
			let precio                = json.USD.promedio
			let hora = json._timestamp.fecha
			let subHora = hora.substring(15)
			let precioParseado        = parseFloat(precio)
			let cambioABolivar        = precioParseado.toLocaleString()
			precioTotal               = precio
			precio_promedio.innerText = cambioABolivar
			lbl_hora.innerText = subHora
			console.log(hora)
		} catch(e) {console.log('Error al obtener datos')}
	}
	obtenerDatos()

	function CalcularDolares (dolar, precioActual){
		console.log(dolar)
		console.log(precioActual)
		const monto           = precioActual * dolar
		const montoPaeseado   = monto.toLocaleString()
		lbl_salida.innerText  = montoPaeseado
	}
})