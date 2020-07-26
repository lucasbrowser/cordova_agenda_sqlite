var db = null;
            document.addEventListener("deviceready", function(){
                db = window.sqlitePlugin.openDatabase({name: "agenda.db"});
                db.transaction(function(tx) {
                    tx.executeSql("CREATE TABLE IF NOT EXISTS cadastro (id integer primary key, nome text, email text)");
                    agenda_consulta();
                }, function(err){
                    alert("Um erro ocorreu durante a inicialização do app");
                });
            }, false);

            $(document).ready(function(){ 
                $('#edicao').hide();
            });

            function add(){
                var nome = document.getElementById("cadnome").value;
                var email = document.getElementById("cademail").value;
                if(nome == "") {
                    alert("Por favor entre com o seu nome");
                    return;
                }
                if(email == ""){
                    alert("Por favor entre com o seu email");
                    return;
                }
                db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO cadastro (nome, email) VALUES (?,?)", [nome, email], function(tx,res){
                        alert("Dados cadastrados com sucesso!");	
                    });
                }, function(err){
                    alert("Um erro ocorreu durante a inicialização do app");
                });
            }

            function agenda_consulta(){
                db.transaction(agenda_consulta_database, erroDB);
            }
            
            function agenda_consulta_database(tx){
                tx.executeSql('SELECT * FROM cadastro', [], agenda_consulta_dados, erroDB);
            }
        
            function agenda_consulta_dados(tx, results){
                $("#agenda-listagem").empty();
                var len = results.rows.length;
                alert("Tabela Agenda: "+len+" linhas encontradas");
                for (var i=0; i<len; i++){
                    $("#agenda-listagem").append("<tr>"+
                                                    "<td><h4>"+results.rows.item(i).nome+"</h4></td>"+
                                                    "<td><h5>"+results.rows.item(i).email+"</h5></td>"+
                                                    "<td><input type='button' class='btn btn-lg btn-danger' value='X' onclick='agenda_delete("+results.rows.item(i).id +")'><input type='button' class='btn btn-lg btn-warning' value='E' onclick='agenda_update_abrir_tela3("+results.rows.item(i).id+")'></td>"+           
                                                "</tr>"
                                                );
            
                }
            }

            
    function agenda_delete(agenda_id){
    	var id_delete = document.querySelector("#agenda_id_delete").value = agenda_id;
        db.transaction(function(tx) {
            tx.executeSql('DELETE FROM cadastro WHERE id ='+ id_delete +'');
            agenda_consulta();
        }, function(err){
            alert("Um erro ocorreu durante a inicialização do app");
        });
    }

    function agenda_ver(agenda_id){
    	var id_ver = document.querySelector("#agenda_id_delete").value = agenda_id;
        alert(id_ver)
    }



    function agenda_update_abrir_tela3(agenda_id){
        $("#cadastro").hide();
        $("#edicao").show();
        var id_update = document.querySelector("#agenda_id_update").value = agenda_id;
        db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM cadastro WHERE id = ?", [id_update], function(tx, resultado){
                    var nome = resultado.rows.item(0).nome;
                    var email = resultado.rows.item(0).email;
                    document.getElementById("editnome").value = nome;
                    document.getElementById("editemail").value = email;
                    alert("Codigo: "+id_update+" Nome: "+nome);
            });
        }, function(err){
            alert(err.message);
            alert("Um erro ocorreu durante a inicialização do app");
        });
    }


    function agenda_update_fechar_tela2(){
    	$("#edicao").hide();
        $("#cadastro").show();
    }


    function agenda_update2(){
    	var agenda_id_novo = document.getElementById("agenda_id_update").value;
    	var agenda_nome_novo = document.getElementById("editnome").value;
        var agenda_email_novo = document.getElementById("editemail").value;
        db.transaction(function(tx) {
            tx.executeSql('UPDATE cadastro SET nome = "'+agenda_nome_novo+'", email = "'+agenda_email_novo+'" WHERE id = "'+agenda_id_novo+'" ');
            alert("Dados alterados com sucesso");
            agenda_update_fechar_tela2();
            agenda_consulta();
        }, function(err){
            alert(err.message);
            alert("Um erro ocorreu durante a inicialização do app");
        });
    }

            function erroDB(tx, err) {
                alert("Erro ao processar o SQL: "+err);
            }

            function successDB(){
                alert("Sucesso!")
            }