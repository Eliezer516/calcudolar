const dark_button = document.querySelector('.darkmode-icon')
const body = document.querySelector('body')

dark_button.onclick = () => {
	body.classList.toggle('lightmode')

	if(body.classList.contains('lightmode')){
		localStorage.setItem('dark-mode', 'true')
	}else{
		localStorage.setItem('dark-mode', 'false')
	}
}

if (localStorage.getItem('dark-mode') === 'true') {
	body.classList.add('lightmode')
}else{
	body.classList.remove('lightmode')
}