System.transpiler = 'babel';

System.paths['*'] = '*.js';

System.import('./helloworld').catch(function(e){
	alert(e);
});