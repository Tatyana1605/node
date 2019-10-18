class Form {
	constructor(input, template, error) {
		this.input = input;
		this.template = template;
		this.error = error;
		this.send = true;
	}
	
	validateForm() {
    let inputVal = this.input.value;
     event.preventDefault();
		
		if (!inputVal.match(this.template)) {
			this.send = false;
      this.input.value = '';
      this.error.style.border = '2px solid red';
			this.error.style.display = 'block';
       
      
   
			
			setTimeout(() => {
				this.error.style.display = 'none'
				this.input.classList.remove('error');
      },5000);
      
     
    }
    
	}
	
	showResult() {
		if (this.send) {
			document.getElementById('send').style.display = 'block';
		}
	}
}

document.getElementById('btn').onclick = function() {
	let Name = document.getElementById('inputName');
	let templateName = /^[A-Za-zА-Яа-я]+/;
	let errorName = document.getElementById('errorName');
	
	let Phone = document.getElementById('inputPhone');
	let templatePhone = /^\+\d\(\d{3}\)\d{3}\-\d{4}$/;
	let errorPhone = document.getElementById('errorPhone');
	
	let Email = document.getElementById('inputEmail');
	let templateEmail = /^[a-z]+(\.|\-)?[a-z]+\@[a-z]+\.[a-z]{2,4}$/;
  let errorEmail = document.getElementById('errorEmail');

  let Text = document.getElementById('inputText');
	let templateText = /\d{5, }/;
  let errorText = document.getElementById('errorText');
  

	
	let validateName = new Form(Name, templateName, errorName);
	let validatePhone = new Form(Phone, templatePhone, errorPhone);
  let validateEmail = new Form(Email, templateEmail, errorEmail);
  let validateText = new Form(Text, templateText, errorText);

	
	validateName.validateForm();
	validatePhone.validateForm();
	validateEmail.validateForm();
	validateText.validateForm();
	validateEmail.showResult();
};