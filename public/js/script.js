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

				// Verifica qual validação deve se utilizada
				if (validation.includes('images')){
					let images = elements[i].getElementsByClassName('img-selected');
					if (validation.includes('just')){
						let just = parseInt(validation.split('-')[2],10);
						if (size(images) != just){
							status = false;
							buildElement(elements[i],'div',{'class':'legend-error'},'Precisa serem selecionadas '+just+' imagens!');
						}
						
					} else if (validation.includes('max')){
						let max = parseInt(validation.split('-')[2],10);
						if (size(images) > max || size(images) == 0){
							status = false;
							buildElement(elements[i],'div',{'class':'legend-error'},'Precisa serem selecionadas 1 e até '+max+' imagens!');
						}
					}
				
				} else if (validation.includes('min')){ // Mínimo de Caracteres
					let min = parseInt(validation.split('-')[1],10);
					if (size(inp.value) < min){
						status = false;
						inp.classList.add('input-error');
						buildElement(elements[i],'div',{'class':'legend-error'},'Precisa possuir '+min+' ou mais caracteres!');
					}

				} else if (validation == 'cpf'){ // Formato de CPF
					if (format_validation(inp) == false){
						status = false;
						inp.classList.add('input-error');
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
								buildElement(elements[i],'div',{'class':'legend-error'},'Precisa ser maior que ontem e menor que 2050!');
							}
						}
					} else {
						status = false;
						inp.classList.add('input-error');
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
							buildElement(elements[i],'div',{'class':'legend-error'},'Digite uma hora válida!');
						}
					}
				} else if (validation.includes('equals')){ // ser igual a Determinado Campo
					let id_equals = validation.split('equals-')[1];
					let field = element(id_equals);
					if (inp.value != field.value || field.value == '' || inp.value == ''){
						status = false;
						inp.classList.add('input-error');
						buildElement(elements[i],'div',{'class':'legend-error'},'Precisa ser igual ao campo '+validation_name+'!');
					}
				} else if (validation == 'email'){ // formato de Email
					if (((inp.value).includes('@') == false && (inp.value).includes('.') == false) || size(inp.value) < 12){
						status = false;
						inp.classList.add('input-error');
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