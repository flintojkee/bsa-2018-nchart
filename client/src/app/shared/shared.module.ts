import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';

import { ReactiveFormsModule } from '@angular/forms';
import { SecondaryButtonComponent } from './components/buttons/secondary-button.component';
import { DefaultButtonComponent } from './components/buttons/default-button.component';
import { InputPasswordComponent } from './components/inputs/input-password/input-password.component';
import { InputTextComponent } from './components/inputs/input-text/input-text.component';
import { DropdownSimpleComponent } from './components/dropdowns/dropdown-simple/dropdown-simple.component';
import { DropdownGroupComponent } from './components/dropdowns/dropdown-group/dropdown-group.component';
import { CheckboxComponent } from './components/checkbox/checkbox/checkbox.component';

import { ButtonModule } from 'primeng/button';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonComponent } from '@app/shared/components/input/radioButton/radio-button.component';
import { InputTextareaComponent } from '@app/shared/components/input/inputTextarea/input-textarea.component';


@NgModule({
	imports: [	ReactiveFormsModule,
				BrowserAnimationsModule,
				BrowserModule,
				CommonModule,
				FormsModule,
				RadioButtonModule,
				InputTextareaModule
	],
	exports: [	SecondaryButtonComponent,
				DefaultButtonComponent,
				InputPasswordComponent,
				BrowserAnimationsModule,
				BrowserModule,
				InputTextComponent,
				DropdownSimpleComponent,
				DropdownGroupComponent,
				CheckboxComponent,
				RadioButtonComponent,
				InputTextareaComponent
	],
	declarations: [	SecondaryButtonComponent,
					DefaultButtonComponent,
					InputPasswordComponent,
					InputTextComponent,
					DropdownSimpleComponent,
					DropdownGroupComponent,
					CheckboxComponent,
					RadioButtonComponent,
					InputTextareaComponent
	]
})
export class SharedModule {}
