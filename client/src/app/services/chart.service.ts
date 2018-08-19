import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { BarChartCustomizeSettings } from '@app/shared/components/charts/bar-chart/bar-chart';

@Injectable()
export class ChartService {

	barChartCustomizeSettings: BarChartCustomizeSettings =  {
			width:800, 
			height:600,
			leftMargin:40,
			verticalPadding:17,
			horizontalPadding:0.2,
			isSameScaling:false
		};
		
		data : Array<any>
		values : Array<number>

		originalData = [
			'Jan', 'Feb', 'Mar', 
			'Jan', 'Mar', 'Apr',
			'Jan', 'Jun', 'Jul'
		]
		originalValues = [
			1, 2, 3,
			4, 5, 6,
			7, 8, 9
		]
	
		private _barChartCustomizeSettings = new BehaviorSubject<BarChartCustomizeSettings>(this.barChartCustomizeSettings)
		barChartCustomizeSettingsObs = this._barChartCustomizeSettings.asObservable();

		private _data = new BehaviorSubject<Array<any>>(this.data);
		dataObs = this._data.asObservable();

		private _values = new BehaviorSubject<Array<number>>(this.values);
		valuesObs = this._values.asObservable();

		private _range = new BehaviorSubject<number>(0);
		rangeObs = this._range.asObservable();


		setData(data: Array<any>){
			this._data.next(data);
		}

		setValues(){
			this.data = compressArray(mapValues(mapData(this.originalData), this.originalValues));
			this.setRange();
			this._data.next(this.data);
		}

		setWidth(width: number){
			this.barChartCustomizeSettings.width = width;
			this._barChartCustomizeSettings.next(this.barChartCustomizeSettings);
		}

		setHeight(height: number){
			this.barChartCustomizeSettings.height = height;
			this._barChartCustomizeSettings.next(this.barChartCustomizeSettings);
		}

		setRange(){
			this._range.next(this.getRange());
		}
		
		getRange(){
			return Math.max(...this.data.map(o => o.value));
		}

	constructor() {
		this.data = this.originalData;
		this.values = this.originalValues;
		this.data = compressArray(mapData(this.data));
		this.setData(this.data);
		this.setRange();
		console.log(this.barChartCustomizeSettings);
	}
	
}
				


export function mapData(original : Array<any>) {
	return original.map((name: string | number) => (
			{
		  name: name,
			value: 1,
			color: "#1785FC"
			}
		))
}

export function mapValues(original : Array<any>, values : Array <number>){
	return original.map((obj) => (
				{
					name: obj.name,
					value: values[original.indexOf(obj)],
					color: obj.color
				}
			))
}

export function mapColors(original : Array<any>){
	return original.map((obj) => (
		{
			name: obj.name,
			value: obj.value,
			color: '#'+Math.random().toString(16).substr(2,6)
		}
	))
}

export function compressArray(original) {
	let compressed = [];
	let copy = original.slice(0);
	for (let i = 0; i < original.length; i++) {
		let myCount = 0;	
		for (let w = 0; w < copy.length; w++) {
			if (original[i].name === copy[w].name) {
				myCount+=original[i].value;
				let a = {
					name:"",
					value: 0,
					color: ""
				}
				copy[w] = a;
			}
		}
 
		if (myCount > 0) {
			let a = {
				name:"",
				value: 0,
				color: ""
			}
			a.name = original[i].name;
			a.value = myCount;
			a.color = original[i].color;
			compressed.push(a);
		}
	}
  
	return compressed;
};
