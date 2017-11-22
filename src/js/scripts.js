; 'use strict';
document.addEventListener('DOMContentLoaded', function(){
	/**
	 * Input mask
	 * https://github.com/text-mask/text-mask/tree/master/vanilla
	 */
	var phoneMask = ['+', '3', '8', '(', /\d/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/];
	var myInput = document.querySelector('input[type="tel"]');
	if (myInput){
		var maskedInputController = vanillaTextMask.maskInput({
			inputElement: myInput,
			mask: phoneMask,
			guide: false,
			showMask: true,
		});
	}

	/**
	 * Lock scroll function
	 * @param {Boolean} state Enable or disable scrollLock (true/false)
	 */
	var htmlTag = document.querySelector('html');
	var scrollPos;
	function lockScroll(state){
		if(state){
			scrollPos = window.pageYOffset;
			htmlTag.classList.add('scroll-locked');
			htmlTag.style.top = '-' + scrollPos + 'px';
		}else{
			htmlTag.classList.remove('scroll-locked');
			htmlTag.style.top = '';
			window.scrollTo(0, scrollPos);
		}
	}

	/**
 * Esc-event close popups
 */
	document.onkeydown = function(event){
		event = event || window.event;
		if (event.keyCode === 27){
			console.log('Esc pressed! 👌');
			lockScroll(false);
		}
	};
	
	/**
	 * UTM Tracking Code
	 * @param {*} name - name current UTM
	 */
	function getUTM(name) {
		name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
		var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'),
			results = regex.exec(location.search);
		return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
	}

	/**
	* Custom and very simple validation form by Raketa
	* @param {*} formName Name form attribute
	* @param {*} typeEvent Validation event (clickEvent/loadEvent)
	* @return {Boolean} If validated - true, else - false
	*/
	function validateForm(formName, typeEvent){
		var workForm = document.querySelector('form[name="' + formName + '"]');
		var formInputs = workForm.querySelectorAll('input.raketa_validation');
		// var formBtn = workForm.querySelector('button[type="submit"]');
		var regExp;
		var typeInput;
		var curValidation;
		var wrapInput;
		for (var i = 0; i < formInputs.length; i++) {
			var formInput = formInputs[i];
			formInput.onblur = function(){
				if (this.value.length < 2){ //Пустые поля или поля с 1 символом сразу невалидны
					curValidation = false;
				} else {
					typeInput = this.getAttribute('type');
					if (typeInput === 'email'){ //Если имейл
						regExp = /.+@.+\..+/i;
						if (this.value.match(regExp)){
							curValidation = true;
						} else {
							curValidation = false;
						}
					} else if (typeInput === 'tel'){ //Если телефон
						regExp = /^([^\_]|[+]?[0-9\s-\(\)]{3,25})*$/i;
						if (regExp.test(this.value) && this.value.length > 17){
							curValidation = true;
						} else {
							curValidation = false;
						}
					} else {
						curValidation = true; //Для полей, который не умеет валидировать функция
					}
				}
				wrapInput = this.parentNode;
				if (curValidation){
					wrapInput.classList.remove('raketa_error');
					wrapInput.classList.add('raketa_success');
					// formBtn.removeAttribute('disabled');
				} else {
					wrapInput.classList.add('raketa_error');
					wrapInput.classList.remove('raketa_success');
					// formBtn.setAttribute('disabled', 'disabled');
				}
			};
		}
		if (typeEvent === 'clickEvent'){
			for (var index = 0; index < formInputs.length; index++) {
				if (!formInputs[index].parentNode.classList.contains('raketa_success')){
					formInputs[index].parentNode.classList.add('raketa_error');
				}
			}
		}
		if (workForm.querySelector('.raketa_error')){
			return false;
		} else {
			return true;
		}
	}

	/**
	 * Get all buttons form
	 */
	var formBottons = document.querySelectorAll('form button[type="submit"]');
	var curFormName,
			typeEvent,
			valFunction;
	for (var j = 0; j < formBottons.length; j++) {
		curFormName = formBottons[j].parentNode.parentNode.getAttribute('name');
		typeEvent = 'loadEvent';
		validateForm(curFormName, typeEvent);
		formBottons[j].onclick = function(e){
			e.preventDefault();
			curFormName = this.parentNode.parentNode.getAttribute('name');
			typeEvent = 'clickEvent';
			valFunction = validateForm(curFormName, typeEvent);
			if (valFunction){ //Если форма успешно провалидирована
				raketaApi(curFormName);
			}
		};
	}

	/**
	 * Data for working in API Raketa
	 * @param {*} curFormName - Name form attribute
	 */
	function raketaApi(curFormName) {
		var formElement = document.querySelector('form[name="' + curFormName + '"]');
		var btn = formElement.querySelector('.footer__btn');
		btn.disabled = true;
		var formData = new FormData(formElement);
		var url = window.location.href.split('?')[0];
		var ref = document.referrer;
		var data_form = formElement.getAttribute('data-form');
		var utm_source = getUTM('utm_source');
		var utm_term = getUTM('utm_term');
		var utm_content = getUTM('utm_content');
		var utm_campaign = getUTM('utm_campaign');
		var utm_medium = getUTM('utm_medium');
		formData.append('url', url);
		formData.append('ref', ref);
		formData.append('data_form', data_form);
		formData.append('utm_source', utm_source);
		formData.append('utm_term', utm_term);
		formData.append('utm_content', utm_content);
		formData.append('utm_campaign', utm_campaign);
		formData.append('utm_medium', utm_medium);
		// debug formData
		// for (var pair of formData.entries()) {
			// 	console.log(pair[0] + ', ' + pair[1]);
			// }
			// return false;
		var request = new XMLHttpRequest();
		request.onreadystatechange = function () {
			if (this.readyState === 4 && this.status === 200) {
				console.log('👌')
			}
		};
		request.onload = function(){
			if(this.status !== 200){
				console.log(this.statusText + ': ' + this.status);
				btn.disabled = false;
			}
		}
		request.open('POST', 'raketa_api.php', true);
		request.send(formData);
	}
	
});