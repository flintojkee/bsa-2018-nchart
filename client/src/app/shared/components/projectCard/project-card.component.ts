import {Component, Input, OnInit} from '@angular/core';

@Component({
	selector: 'app-project-card',
	templateUrl: './project-card.component.html',
	animations: []
})
export class ProjectCardComponent implements OnInit {
	itemsObjs = [
		{
			label: 'New row',
			icon: 'fa fa-plus'
		}
		];

	constructor() {
	}

	@Input()
	companyName: string;

	@Input()
	groupName: string;

	@Input()
	projectId: number;

	@Input()
	projectName: string;

	@Input()
	userName: string;

	@Input()
	email: string;

	ngOnInit() {
	}
}
