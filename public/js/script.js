/**	BUILD ELEMENTS
 * - Cria elementos HTML, com base nos parâmetros informados
 * @param {String} fatherComponent Deve ser passado o item/area/componente-pai onde será inserido os elementos
 * @param {String} tag Deve ser passado qual a tag Html que será criada
 * @param {Object} attributes Deve ser passado um objeto contendo os atributos e valores a serem inseridos
 * @param {String} text Pode ser passado o texto que será atribuído ao componente
 * @param {String} typeChild Pode ser passado a forma de inserção a ser utilizada "append/prepend"
**/
function buildElement(fatherComponent, tag, attributes, text = '', typeChild = 'append') {
	if (tag == 'svg') {
		var element = document.createElementNS('http://www.w3.org/2000/svg', tag);
	} else {
		var element = document.createElement(tag);
	}
	// caso o usuário tenha passado um texto
	if (text != '') {
		let element_text = document.createTextNode(text);
		element.appendChild(element_text);
	}
	// adiciona todos os atributos no componente que será criado
	for (var i in attributes) {
		if (attributes.hasOwnProperty(i)) {
			// verifica se é um objeto para transformar em JSON
			if (typeof attributes[i] == 'object'){
				attributes[i] = JSON.stringify(attributes[i]);
			}
			element.setAttribute(i, attributes[i]);
		}
	}
	// verifica se foi passado o elemento inteiro, para atribuílo direto
	if (typeof fatherComponent == 'string'){
		if (fatherComponent.startsWith('#')) {
			mainComponent = document.querySelector(fatherComponent);
		} else if (fatherComponent.startsWith('/')) {
			fatherComponent = fatherComponent.substring(1);
			mainComponent = document.getElementsByTagName(fatherComponent)[0];
		} else {
			mainComponent = document.getElementById(fatherComponent);
		}
	} else {
		mainComponent = fatherComponent;
	}
	// finalmente adiciona o componente ao item-pai
	if (typeChild == 'prepend') {
		mainComponent.prepend(element);
	} else {
		mainComponent.appendChild(element);
	}
}


/**	DELETE ELEMENTS
 * - Deleta um ou mais elementos de acordo com os parâmetros de pesquisa informados
 * @param {String} name Deve ser passado o que será pesquisada como O nome da "class/id" por exemplo
 * @param {String} by Pode ser passado para uma pesquisa diferente de ID
 * @param {Bool} child Pode ser passado "child" para deletar somente os elementos filhos
**/
function deleteElements(name, by = 'id', child = false) {
	let elements = [];
	if (by == 'id') {
		elements = document.getElementById(name);
		elements.remove();
		return true;
	} else {
		elements = document.querySelectorAll('[' + by + '*="' + name + '"]');
	}
	// percorre os elementos que foram encontrados e os excluem
	if (elements != null) {
		for (let i = 0; i < elements.length; i = i + 1) {
			if (child == true) {
				elements[i].innerHTML = '';
			} else {
				elements[i].remove();
			}
		}
	}
}


/**
 * - Remove as classes de vários elementos a partir das classes informadas
 * @param {String} class_name Pode ser informado a classe que será buscada e retornará os elementos
 * @param {String} class_remove Pode ser informado a classe que será removida
 */
function remove_classes(class_name = '', class_remove = ''){
	if (class_name != '' && class_remove != ''){
		let elements = element(class_name,'class');
		let size_array = size(elements);
		if (size_array > 0){
			for (let i = 0; i < size_array; i++) {
				elements[i].classList.remove(class_remove);
			}
		}
	}
}


/**
 * Procura um elemento na janela e retorna
 * @param {String} selector Deve ser informado o texto a ser pesquisado
 * @param {String} type Pode ser informado o tipo de pesquisa que será realizada
 * @returns {Element}
 */
function element(selector, type = 'id') {
	if (type == 'name'){
		return window.document.querySelectorAll('[name='+selector+']');
	} else if (type == 'class'){
		return window.document.querySelectorAll('.'+selector);
	} else {
		return window.document.querySelector('#'+selector);
	}
};


/**
 * Verifica se o elemento é existente na página
 * @param {*} element Deve ser informado o elemento a ser verificado se é inválido
 * @return {Bool}
 */
function exists(element) {
	if (element == undefined || element == null || element == '' || typeof element === 'undefined'){
		return false;
	}
	return true;
};


/**
 * - Recupera o tamanho do elemento passado
 * @param {Mixed} content Deve ser passado um objeto ou array
 * @returns 
 */
function size(content){
	let size = 0;

	if (typeof content == 'object'){
		size = Object.keys(content).length;
		
	} else {
		size = content.length;
	}

	return size;
}


/**
 * - Retorna o timestamp a partir de uma data passada ou retorna o timestamp atual
 * @param {Mixed} date Pode ser passada a data que deseja obter o timestamp
 * @param {Integer} hour Pode ser passado as horas da data
 * @returns 
 */
function timestamp(date = null, hour = 0){
	let time = 60*1000;
	if (hour != 0){ // horas
		time = hour * 60 * time;
	}
	if (date == null){
		return new Date().getTime() + time;
	} else {
		return new Date(date).getTime() + time;
	}
}


/**
 * - Formata as datas para o padrão pt-BR
 * @param {Date} date Deve ser informado a data que deseja ser convertida
 * @param {String} format Define o formato com o qual a data deverá ser retornada
 * @param {String} timezone Pode ser passado a timezone a ser trabalhada
 * @returns Data em formato textual formatada
 */
function dateFormat(date, format = null, timezone = 'pt-BR'){
	date = new Date(date);
	if (format == 'dd|mes.|aaaa hh|mm'){ // 12 de fev. de 2023 12:11
		return new Intl.DateTimeFormat(timezone, { day: 'numeric', month: 'short', year: 'numeric',hour:'numeric',minute:'numeric'} ).format(date);
	} else if(format == 'dd|mes.|aaaa'){ // 12 de fev. de 2023
		return new Intl.DateTimeFormat(timezone, { day: 'numeric', month: 'short', year: 'numeric'} ).format(date);
	} else if(format == 'dd|mes|aaaa'){ // 12 de fevereiro de 2023
		return new Intl.DateTimeFormat(timezone, { day: 'numeric', month: 'long', year: 'numeric'} ).format(date);
	} else if(format == 'dd|mm'){ // 12/02
		return new Intl.DateTimeFormat(timezone, { day: 'numeric', month: 'numeric'} ).format(date);
	} else if(format == 'aaaa'){ // 2023
		return new Intl.DateTimeFormat(timezone, { year: 'numeric'} ).format(date);
	} else { // 12/02/2023
		return new Intl.DateTimeFormat(timezone).format(date);
	}
};


/**
 * - Cria um formulário para enviar as informações ou navegar entre as páginas
 * @param {String} route Deve ser informado a rota que será utilizada pelo formulário
 * @param {Array} data Pode ser informado as informações que serão enviadas
 * @param {String} method Pode ser informado o método de envio do formulário
 * @param {String} tab Pode ser passado se será aberto em uma nova aba "_blank"
 */
function form(route, data = [], method = 'POST', tab = '') {
	if (route != undefined && method != '') {
		let path = route;
		let form = document.getElementById('vic_form');
		// verifica se o formulário existe para ser removido
		if (exists(form)){
			form.remove();
			form = null;
		}
		// cria o formulário
		buildElement('/body', 'form', { 'id': 'vic_form', 'method': method, 'action': path, 'target': tab });
		// define cada propriedade como um input
		if (Object.keys(data).length > 0){
			for (let property in data) {
				buildElement('vic_form', 'input', { 'name': property, 'value': data[property], 'type': 'hidden' });
			}
		}
		form = document.getElementById('vic_form');
		if (form != undefined){
			form.submit();
		}
	}
}


/**
 * 
 * @param {Event} event Deve ser informado o evento (normalmente "onsubmit")
 * @param {Element} form Deve ser informado o formulário que esta sendo implementado para enviá-lo
 * @param {*} edit Pode ser informado quando o formulário está sendo editado
 */
function form_validate(form_name, edit = ''){
	let status = true;
	deleteElements('legend-error','class'); // remove os elementos que ainda estiverem setados
	remove_classes('input-error','input-error'); // remove os elementos que ainda estiverem setados
	let form = document.getElementById(form_name);
	let elements = form.getElementsByClassName('form-container');
	if (size(elements) > 0){
		for (let i = 0; i < size(elements); i++) {
			let validation = elements[i].getAttribute('validate');
			let validation_name = elements[i].getAttribute('validate-name');
			if (exists(validation)){
				// let lb = elements[i].getElementsByTagName('label')[0];
				let inp = elements[i].getElementsByTagName('input')[0];
				if (!exists(inp)){
					inp = elements[i].getElementsByTagName('textarea')[0];
				}

				// Verifica qual validação deve se utilizada
				if (validation.includes('images')){
					let images = elements[i].getElementsByClassName('img-selected');
					if (validation.includes('just')){
						let just = parseInt(validation.split('-')[2],10);
						if (size(images) != just){
							let help = {
								'1':'',
								'2':'',
								'3':'m',
							};
							if (just > 1){
								help = {
									'1':'em',
									'2':'s',
									'3':'ns',
								};	
							}
							status = false;
							buildElement(elements[i],'div',{'class':'legend-error'},'Precisa ser'+help['1']+' selecionada'+help['2']+' somente '+just+' image'+help['3']+'!');
						}
						
					} else if (validation.includes('max')){
						let max = parseInt(validation.split('-')[2],10);
						if (size(images) > max || size(images) == 0){
							status = false;
							let help = {
								'1':'',
								'2':'',
								'3':'m',
							};
							if (max > 1){
								help = {
									'1':'em',
									'2':'s',
									'3':'ns',
								};	
							}
							buildElement(elements[i],'div',{'class':'legend-error'},'Precisa ser'+help['1']+' selecionada'+help['2']+' 1 e até '+max+' image'+help['3']+'!');
						}
					}
				
				} else if (validation.includes('min')){ // Mínimo de Caracteres
					let min = parseInt(validation.split('-')[1],10);
					if (size(inp.value) < min){
						status = false;
						inp.classList.add('input-error');
						inp.focus();
						buildElement(elements[i],'div',{'class':'legend-error'},'Precisa possuir '+min+' ou mais caracteres!');
					}

				} else if (validation == 'cpf'){ // Formato de CPF
					if (format_validation(inp) == false){
						status = false;
						inp.classList.add('input-error');
						inp.focus();
						buildElement(elements[i],'div',{'class':'legend-error'},'Campo CPF inválido!');
					}

				} else if (validation == 'date'){ // Formato de Data
					if (size(inp.value) == 10){
						if (edit == ''){
							let ontem = new Date().setDate(new Date().getDate() - 1);
							let dataLimite = new Date('2050/01/01');
							let dataFormatada = new Date(inp.value).setDate(new Date(inp.value).getDate() + 1);;
							if (dataFormatada > dataLimite){
								status = false;
								inp.classList.add('input-error');
								inp.focus();
								buildElement(elements[i],'div',{'class':'legend-error'},'Precisa ser maior que ontem e menor que 2050!');
							}
						}
					} else {
						status = false;
						inp.classList.add('input-error');
						inp.focus();
						buildElement(elements[i],'div',{'class':'legend-error'},'Obrigatório preencher a data!');
					}
					
				} else if (validation == 'hour'){ // Formato de Hora
					if (size(inp.value) > 0){
						let hours = '';
						let hourArray = (inp.value).split(':');
						if (size(hourArray) == 2){
							hourArray[2] = '00';
						} else if (size(hourArray) == 1){
							hourArray[1] = '00';
							hourArray[2] = '00';
						}
						hours = parseInt(hourArray[0].padStart(2,'0')+hourArray[1].padStart(2,'0')+hourArray[2].padStart(2,'0'));
						if (hours > 235959){
							status = false;
							inp.classList.add('input-error');
							inp.focus();
							buildElement(elements[i],'div',{'class':'legend-error'},'Digite uma hora válida!');
						}
					}
				} else if (validation.includes('equals')){ // ser igual a Determinado Campo
					let id_equals = validation.split('equals-')[1];
					let field = element(id_equals);
					if (inp.value != field.value || field.value == '' || inp.value == ''){
						status = false;
						inp.classList.add('input-error');
						inp.focus();
						buildElement(elements[i],'div',{'class':'legend-error'},'Precisa ser igual ao campo '+validation_name+'!');
					}
				} else if (validation == 'email'){ // formato de Email
					if (((inp.value).includes('@') == false && (inp.value).includes('.') == false) || size(inp.value) < 12){
						status = false;
						inp.classList.add('input-error');
						inp.focus();
						buildElement(elements[i],'div',{'class':'legend-error'},'Preencha com um e-mail válido!');
					}
				}
			}
		}
	}

	if (!status){
		let btns = document.getElementsByTagName('button');
		for (let i = 0; i < size(btns); i++) {
			btns[i].disabled = true;
			btns[i].classList.add('disabled');
		}
		setTimeout(() => {
			let btns = document.getElementsByTagName('button');
			for (let i = 0; i < size(btns); i++) {
				btns[i].disabled = false;
				btns[i].classList.remove('disabled');
			}
			if (size(element('legend-error','class')) > 0){
				deleteElements('legend-error','class'); // remove os elementos que ainda estiverem setados
			}
			if (size(element('input-error','class')) > 0){
				remove_classes('input-error','input-error'); // remove os elementos que ainda estiverem setados
			}
		}, 3000);
	}
	return status;
}