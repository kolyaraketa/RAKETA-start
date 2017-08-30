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
	var body = document.body;
	var scrollPos;
	function lockScroll(state){
		if(state){
			scrollPos = window.pageYOffset;
			body.classList.add('scroll-locked');
			body.style.top = '-' + scrollPos + 'px';
		}else{
			body.classList.remove('scroll-locked');
			body.style.top = '';
			window.scrollTo(0, scrollPos);
		}
	}

});