exports.load = function(file_name, fs){

    function out(  ){
        try{
            console.log('Views load file: /views/'+file_name);
            return fs.readFileSync('./views/'+file_name, 'utf-8');;
        } catch(err){
            console.log(err);
            return 'Internal Server Error | Code: ' + err.errn + ' | Syscall: ' + err.syscall;
        }
    }

    return out( );
}