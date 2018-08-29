import { Injectable } from '@angular/core';
import ColorHash from 'color-hash';
import {
	BarChartCustomize,
	OptionalType,
	fieldsValidators,
	BarChartDataObj
} from '@app/models';
import { FormService } from '@app/services/form.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { minValidator } from '@app/shared/components/form-field/form-validators';
import { CustomizeControl } from '@app/models/customize-control.model';
@Injectable()
export class BarChartService {
	static spinners = [
		'width',
		'height',
		'leftMargin',
		'verticalPadding',
		'horizontalPadding'
	];
	static checkBox = ['useSameScale'];
	static dropDown = [];
	static colorScale = ['colourScale'];

	constructor(
		private formService: FormService,
		private formBuilder: FormBuilder
	) {}

	data: any[];

	static getType(k: string): string {
		if (this.spinners.indexOf(k) > -1) {
			return 'spinner';
		}
		if (this.checkBox.indexOf(k) > -1) {
			return 'checkBox';
		}
		if (this.dropDown.indexOf(k) > -1) {
			return 'dropDown';
		}
		if (this.colorScale.indexOf(k) > -1) {
			return 'colourScale';
		}
	}

	static arrayToObject(data: any[]): BarChartDataObj {
		const dataObj: BarChartDataObj = data.reduce((obj, item) => {
			obj[item.name] = item.values;
			return obj;
		}, {});
		return dataObj;
	}

	static mapData(original: any[]) {
		return original.map((name: string | number) => ({
			name: name,
			value: 1,
			group: name,
			id: 1,
			color: '#69bf69'
		}));
	}

	static mapColors(original: any[], colors: any) {
		if (colors.length) {
			const colorHash = new ColorHash();
			return original.map(obj => ({
				name: obj.name,
				value: obj.value,
				group: obj.group,
				id: obj.id,
				color: colorHash.hex(colors[original.indexOf(obj)] + '')
			}));
		} else {
			return original;
		}
	}

	static mapValues(original: any[], values: any[]) {
		if (values.length) {
			return original.map(obj => ({
				name: obj.name,
				value: values[original.indexOf(obj)],
				group: obj.group,
				id: obj.id,
				color: obj.color
			}));
		} else {
			return original;
		}
	}

	static mapGroups(original: any[], groups: any[]) {
		if (groups.length) {
			return original.map(obj => ({
				name: obj.name,
				value: obj.value,
				group: groups[original.indexOf(obj)],
				id: obj.id,
				color: obj.color
			}));
		} else {
			return original;
		}
	}

	static mapGroupsId(original: any[], groups: any[]) {
		if (groups.length) {
			const ids = [];
			const map = BarChartService.mapGroups(original, groups);
			map.forEach((part, index) => {
				map[index].id = map[index].id = ids[part.group] = ids[
					part.group
				]
					? ids[part.group] + 1
					: 1;
			});
			return map;
		} else {
			return original;
		}
	}
	static compressArray(original) {
		const compressed = [];
		const copy = original.slice(0);
		for (let i = 0; i < original.length; i++) {
			let myCount = 0;
			for (let w = 0; w < copy.length; w++) {
				if (original[i].name === copy[w].name) {
					myCount += copy[w].value;
					const a = {
						name: '',
						value: 0,
						group: '',
						id: '',
						color: ''
					};
					copy[w] = a;
				}
			}
			if (myCount > 0) {
				const a = {
					name: '',
					value: 0,
					group: '',
					id: '',
					color: ''
				};
				a.name = original[i].name;
				a.value = myCount;
				a.group = original[i].group;
				a.id = original[i].id;
				a.color = original[i].color;
				compressed.push(a);
			}
		}
		return compressed;
	}

	static getValues(barChartCustomize): BarChartCustomize {
		return {
			width: barChartCustomize.width.value,
			height: barChartCustomize.height.value,
			leftMargin: barChartCustomize.leftMargin.value,
			verticalPadding: barChartCustomize.verticalPadding.value,
			horizontalPadding: barChartCustomize.horizontalPadding.value,
			useSameScale: barChartCustomize.useSameScale.value,
			colourScale: barChartCustomize.colourScale.value
		};
	}

	getCustomizeControls(formGroup: FormGroup): CustomizeControl[] {
		return Object.entries(formGroup.controls).map(c => ({
			type: BarChartService.getType(c[0]),
			label: c[0],
			control: c[1]
		}));
	}

	getData(data: any) {
		const dataObj = BarChartService.arrayToObject(data);
		this.data = BarChartService.mapData(dataObj.xaxis);
		this.data = BarChartService.mapValues(this.data, dataObj.size);
		this.data = BarChartService.mapGroupsId(this.data, dataObj.group);
		this.data = BarChartService.mapColors(this.data, dataObj.color);
		if (!dataObj.group.length) {
			this.data = BarChartService.compressArray(this.data);
		}

		return this.data;
	}

	createBarChartCustomizeForm(barChartCustomize): FormGroup {
		const initialValues: OptionalType<
			BarChartCustomize
		> = BarChartService.getValues(barChartCustomize);

		const validators: fieldsValidators<BarChartCustomize> = {
			width: [minValidator('Minimum value is', 0)],
			height: [minValidator('Minimum value is', 0)],
			leftMargin: [minValidator('Minimum value is', 0)],
			verticalPadding: [minValidator('Minimum value is', 0)],
			horizontalPadding: [minValidator('Minimum value is', 0)],
			useSameScale: [],
			colourScale: []
		};

		const controls = this.formService.createFormControls(
			initialValues,
			validators
		);

		return this.formBuilder.group(controls);
	}
}
