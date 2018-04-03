'use strict';
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
	var scrollPos = 0;
	function lockScroll(state){
		if(scrollPos === 0){
			scrollPos = window.pageYOffset;
		}
		if(state === 'toggle'){
			if(htmlTag.classList.contains('scroll-locked')){
				htmlTag.classList.remove('scroll-locked');
				window.scrollTo(0, scrollPos);
				scrollPos = 0;
			}else{
				htmlTag.style.top = '-' + scrollPos + 'px';
				htmlTag.classList.add('scroll-locked');
			}
		} else {
			if(state){
				htmlTag.style.top = '-' + scrollPos + 'px';
				htmlTag.classList.add('scroll-locked');
			}else{
				htmlTag.classList.remove('scroll-locked');
				htmlTag.style.top = '';
				window.scrollTo(0, scrollPos);
				scrollPos = 0;
			}
		}
	}

	/**
 * Esc-event close popups
 */
	document.onkeydown = function(event){
		event = event || window.event;
		if (event.keyCode === 27){
			popupOrder.classList.remove('popup__order-visible');
			lockScroll(false);
		}
	};

});