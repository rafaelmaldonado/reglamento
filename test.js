var a = new Array();
a = [1,2,3,2,5,4,4,8,9,2];
var b = [];
console.log(a);
var i = 0, j = 0, salir = false;
while(i < a.length){
	while(j < a.length){
		if (i != j){
			if (a[i] == a[j]){
				console.log('. a[' + i + '] = ' + a[i] + ' a[' + j + '] = ' + a[j]);
			} else {
				b.push(a[i]);
				salir = true;
				console.log(b);
				console.log('+ a[' + i + '] = ' + a[i] + ' a[' + j + '] = ' + a[j]);
			}
		} else {
			if (a[i] == a[j]){
				console.log('. a[' + i + '] = ' + a[i] + ' a[' + j + '] = ' + a[j]);
			} else {
				b.push(a[i]);
				salir = true;
				console.log(b);
				console.log('+ a[' + i + '] = ' + a[i] + ' a[' + j + '] = ' + a[j]);
			}
		}
		if (salir)
			break;
		j++;
	}
	i++;
}
console.log(b);

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};