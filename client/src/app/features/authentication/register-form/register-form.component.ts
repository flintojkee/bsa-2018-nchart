import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StoreService } from '@app/services/store.service';
import { Register } from '@app/models';
import { Register as RegisterAction } from '@app/store/actions/user/user.actions';

@Component({
	selector: 'app-register-form',
	templateUrl: './register-form.component.html',
	styleUrls: ['./register-form.component.sass']
})
export class RegisterFormComponent implements OnInit {
	@Input()
	registerForm: FormGroup;

	constructor(private storeService: StoreService) {}

	ngOnInit() {}

	initForm() {}

	onClickCreateProfile() {
		const register = new Register(
			this.registerForm.controls['name'].value,
			this.registerForm.controls['email'].value,
			this.registerForm.controls['password'].value
		);

		this.storeService.dispatch(new RegisterAction(register));
	}
}
