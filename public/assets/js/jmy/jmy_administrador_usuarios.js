$(document).ready( function () {
   /* $.notify({
        icon: "ti-gift",
        message: "Welcome to <b>Paper Dashboard</b> - a beautiful dashboard for every web developer."

    },{
        type: 'info',
        timer: 4000,
        placement: {
            from: 'top',
            align: 'center'
        }
    });*/
    const url_base=$('#url_base').val();
    function modulos_sav() {
        let g ={};
        $(".modulos_def").each(function(){
            g[$(this).data('api')]={permisos:$(this).val()};
        });
        console.log(g,url_base+"/administrador/usuarios/modulos");
        
        $.ajax({
            url: url_base+"/administrador/usuarios/modulos",
            type: "POST",
            data: JSON.stringify({u:$("#uid").val(),g:g}),
            contentType:false,
            dataType: 'json',
            cache: false,
            processData: false,
            success: function(r){
                console.log(r);	
            
                swal(r.mensaje,'',((r.error)?"error":"success"), {
                    buttons: false,
                    timer: 3000,
                  });
        },error: function(result) {console.log(result);}
        });
    }
    $("#guardar_modulos").on('click',function(){
        $(this).prop( "disabled", true );	
        $('.modulos_def').each( function(){ $(this).prop( "disabled", true ); });
        
        $.when(modulos_sav()).then(function(){
            $('.modulos_def').prop( "disabled", false );	
            $('.modulos_def').on('change', function() {
                $("#guardar_modulos").prop( "disabled", false );	
            });
        });
    });
    $('#card_ver_perfil').hide();
    $('#card_editar_perfil').hide();
    $('#equipo_de_trabajo').hide();
    $('.loading_editor').hide();
    $('.loading_lista').hide();
    $('#ver_mi_perfil').on('click',function(){
        $('#card_nuevo_perfil').hide(20);
        $('#card_ver_perfil').show(30);
        $('#card_editar_perfil').hide(20);
    });
    $('#tabla_usuarios').DataTable();

    function actualizar_usuarios() {
        console.log('Obetenido lista de usuarios');  
        $('.loading_lista').show(30);      
        $.ajax({
            url: url_base+"/administrador/usuarios/listausuarios",
            type: "POST",
            data: JSON.stringify({ttpt:1}),
            contentType: "text/plain",
            dataType: 'json',
            cache: false,
            processData: false,
            success: function(r){ 
            let h = ''; 
            console.log("RRRR",r);
            
            r.forEach(u => {
                u=u.jmy_ver;
                h=h+'<tr><td></td><td>'+u.ot.info.nombre+'</td><td>'+u.ot.info.email+'</td><td data-uid="'+u.id_f+'"></td></tr>';
            });
            $('#tabla-usuarios').find('tbody').html();
            $('#tabla-usuarios').find('tbody').html(h);
            var $t_usuarios = $('#tabla-usuarios');
             
            window.operateEvents = {
                'click .ver_usuario': function (e, value, row, index) {
                    info = JSON.stringify(row);
                    document.getElementById("uid").value = row._actions_data.uid;
                    modulos_perfil();
                    console.log(e);
                },
                'click .editar_usuario': function (e, value, row, index) {
                    info = JSON.stringify(row);
                    document.getElementById("uid").value = row._actions_data.uid;
                    modulos_perfil();
                    console.log(info);
                }
            };
            $t_usuarios.bootstrapTable({
                toolbar: ".tabla-usuarios-toolbar",
                clickToSelect: true,
                showRefresh: true,
                search: true,
                showToggle: true,
                showColumns: true,
                pagination: true,
                searchAlign: 'left',
                pageSize: 100,
                clickToSelect: false,
                pageList: [100,200,300],
        
                formatShowingRows: function(pageFrom, pageTo, totalRows){
                    //do nothing here, we don't want to show the text "showing x of y from..."
                },
                formatRecordsPerPage: function(pageNumber){
                    return pageNumber + " rows visible";
                },
                icons: {
                    refresh: 'fa fa-refresh',
                    toggle: 'fa fa-th-list',
                    columns: 'fa fa-columns',
                    detailOpen: 'fa fa-plus-circle',
                    detailClose: 'ti-close'
                }
            });
                
            $(window).resize(function () {
                $t_usuarios.bootstrapTable('resetView');
            });
                
                console.log(url_base+"/administrador/usuarios/listausuarios");
                console.log('LISTA DE USUARIOS',r);	
                $('#collapseOne').collapse('show');
                $('#collapseTwo').collapse('hide');
                $('#collapseThree').collapse('hide');  
                $('#card_nuevo_perfil').show(20);
                $('#card_ver_perfil').hide(30);
                $('.loading_editor').hide(30);		
                $('.loading_lista').hide(60);
        },error: function(result) {console.log(result); console.log(url_base+"/administrador/usuarios/modulos");}
        });        
    }
    $(".actualizar_usuarios").on('click',function(){
        console.log('Obetenido lista de usuarios');         
        actualizar_usuarios();
    });
    $(".ver_usuarios").on('click',function(){
        console.log('Obetenido lista de usuarios');         
        $('#collapseOne').collapse('show');
        $('#collapseTwo').collapse('hide');
        $('#collapseThree').collapse('hide');  
    });


    function modulos_perfil() {
        const u =$("#uid").val();
        console.log('us:',u);
        $('.modulos_def').prop( "disabled", true );	
        $('.loading_editor').show(60);
        $('#collapseTwo').collapse('hide');
        $('#collapseThree').collapse('hide');  
        let g ={};
        $.ajax({
            url: url_base+"/administrador/usuarios/perfil",
            type: "POST",
            data: JSON.stringify({u:u}),
            contentType:false,
            dataType: 'json',
            cache: false,
            processData: false,
            success: function(r){
                const i = {
                    info:r.info.info || {},
                    perfil:r.info.perfil || {},
                };
                let d = {};
                $(".formulario-usuario").each(function(){
                    const ig = $(this).attr("id");
                    d[ig]=i.perfil[ig] || i.info[ig];
                    $("#"+ig).val(d[ig] || "");
                });
                $('.modulos_def').data('def','0');
                $(".modulos_def option").attr('selected',false);
                Object.keys(r.modulos).forEach(e => {
                    const d = r.modulos[e];
                    $("#sele_"+e).data('def',d.permisos);
                    $("#sele_"+e+" option[value="+d.permisos+"]").attr('selected','selected');       
                }); 
                $('#collapseOne').collapse('hide');
                $('#collapseTwo').collapse('show');
                $('#collapseThree').collapse('show');  
                $('#card_nuevo_perfil').hide(20);
                $('#card_ver_perfil').hide(20);                
                $('#card_editar_perfil').show(40);
                $('.loading_editor').hide(30);
                $('.modulos_def').prop( "disabled", false );
        },error: function(result) {
            swal("UPS!","Ocurrió algo, al parecer esta listo. Intenta de nuevo.","warning", {
                buttons: false,
                timer: 3000,
              });
              $('.loading_editor').hide(30);
            console.log(result);}
        });
    }
    $("#guardar-usuario").on('click',function(){
        $(this).prop( "disabled", true );	
        $('.formulario-usuario').each( function(){ $(this).prop( "disabled", true ); });
        
        $.when(usuario_sav()).then(function(){
            $('.formulario-usuario').prop( "disabled", false );	
            $('.formulario-usuario').on('change', function() {
                $("#guardar-usuario").prop( "disabled", false );	
            });
        });
    });

    function usuario_sav() {
        let g ={};
        $(".formulario-usuario").each(function(){
            g[$(this).attr('id')]=$(this).val();
        });
        console.log(g,url_base+"/administrador/usuarios/guardar-perfil");
        
        $.ajax({
            url: url_base+"/administrador/usuarios/guardar-perfil",
            type: "POST",
            data: JSON.stringify({u:$("#uid").val(),g:g}),
            contentType:false,
            dataType: 'json',
            cache: false,
            processData: false,
            success: function(r){
                console.log(r);	
            
                swal(((r.mensaje!=undefined)?r.mensaje:'Guardado correctamente'),'',((r.error)?"error":"success"), {
                    buttons: false,
                    timer: 3000,
                  });
        },error: function(result) {
            swal("UPS!","Ocurrió algo, al parecer esta listo. Intenta de nuevo.","warning", {
                buttons: false,
                timer: 3000,
              });
              $('.loading_editor').hide(30);
            console.log(result);}
        });
    }
    var $table = $('#bootstrap-table');
  

    window.operateEvents = {
        'click .view': function (e, value, row, index) {
            info = JSON.stringify(row);

            swal('You click view icon, row: ', info);
            console.log(info);
        },
        'click .edit': function (e, value, row, index) {
            info = JSON.stringify(row);

            swal('You click edit icon, row: ', info);
            console.log(info);
        },
        'click .remove': function (e, value, row, index) {
            console.log(row);
            $table.bootstrapTable('remove', {
                field: 'id',
                values: [row.id]
            });
        }
    };

    $table.bootstrapTable({
        toolbar: ".tabla-usuarios-toolbar",
        clickToSelect: true,
        showRefresh: true,
        search: true,
        showToggle: true,
        showColumns: true,
        pagination: true,
        searchAlign: 'left',
        pageSize: 8,
        clickToSelect: false,
        pageList: [8,10,25,50,100],

        formatShowingRows: function(pageFrom, pageTo, totalRows){
            //do nothing here, we don't want to show the text "showing x of y from..."
        },
        formatRecordsPerPage: function(pageNumber){
            return pageNumber + " rows visible";
        },
        icons: {
            refresh: 'fa fa-refresh',
            toggle: 'fa fa-th-list',
            columns: 'fa fa-columns',
            detailOpen: 'fa fa-plus-circle',
            detailClose: 'ti-close'
        }
    });
  

    //activate the tooltips after the data table is initialized
    $('[rel="tooltip"]').tooltip();
    modulos_def();       
    actualizar_usuarios();
    $(window).resize(function () {
        $table.bootstrapTable('resetView');
    });
} );
function operateFormatterUsuarios(value, row, index) {    
    return [
        '<div class="table-icons">',
            '<a rel="tooltip" title="Ver pefil" data-uid="'+row._actions_data.uid+'" class="btn btn-simple btn-info btn-icon table-action ver_usuario" href="javascript:void(0)">',
                '<i class="ti-image"></i>',
            '</a>',
            '<a rel="tooltip" title="Editar"  data-uid="'+row._actions_data.uid+'" class="btn btn-simple btn-warning btn-icon table-action editar_usuario" href="javascript:void(0)">',
                '<i class="ti-pencil-alt"></i>',
            '</a>',
        '</div>',
    ].join('');
}
function modulos_def() {
    console.log('def inc');
    $(".modulos_def").each(function(){
        let d = $(this).data('def');
        console.log('def',d);
        $('option[value='+d+']',this).attr('selected','selected');
    });
}
