// import 'jque'
const buttons = document.querySelectorAll('button')

buttons.forEach(btn => {
	btn.addEventListener('mouseenter', (e) => {
		x = e.layerX
		y = e.layerY
		
		const uno = btn.children[0]
		uno.style.top = y + 'px'
		uno.style.left = x + 'px'
	})
	
	btn.addEventListener('mouseout', (e) => {
		x = e.layerX
		y = e.layerY
		
		const uno = btn.children[0]
		uno.style.top = y + 'px'
		uno.style.left = x + 'px'
	})

})