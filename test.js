var a = [1,2,3,2,5,4,4,8,9,2];
var b = [];
var is_new = false;

for (var i in a){
	for (var j in a)
		if (i != j)
			if (a[i] == a[j]){
				is_new = false;
				break;
			}
			else
				is_new = true;
		else
			if (a[i] == a[j]){
				is_new = true;
				break;
			}
			else
				is_new = false;
	if (is_new)
		b.push(a[i]);
}

console.log(b);