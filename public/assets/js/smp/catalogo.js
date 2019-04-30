$.fn.editable.defaults.mode =  'inline' ;
$(document).ready(function(){
    $('#username').editable({
        url: $('#url_base').val()+'/smp',
        type: 'text',
        pk: 1, 
        source: [
            {value: 'gb', text: 'Great Britain'},
            {value: 'us', text: 'United States'},
            {value: 'ru', text: 'Russia'}
         ],
        name: 'username',
        title: 'Enter username',
        success: function(response, newValue) {
            if(!response) {
                return "Unknown error!";
            }          
            
            if(response.success === false) {
                 return response.msg;
            }
        }  
    });

	$( ".select2-single, .select2-multiple" ).select2( {
        placeholder: placeholder,
        width: null,
        containerCssClass: ':all:'
    } );
} );