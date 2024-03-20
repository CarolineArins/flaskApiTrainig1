// importa a funcao 'useState' do pacote 'react', e permite adicionar estado a componentes de funcao
import {useState} from "react";

//declara um componente de funcao que retorna um objeto o componente retorna um formulario que será renderizado na interface
const ContactForm=({existingContact = {}, updateCallback}) => {
    //declara variaveis de estado
    //cada variavel de estado é inicializada com uma string vazia
    //com on seu valor padrao, e os sets soa funcoes que atualizarao o estado destas variaveis
    const[firstName, setFirstName]=useState(existingContact.firstName || "");
    const[lastName, setLastName]=useState(existingContact.lastName || "");
    const[email, setEmail]=useState(existingContact.email || "");

    const updating = Object.entries(existingContact).length !==0

    //definicao de uma variavel assincrona 'onSubmit'
    //ela será executada qndo o formulario for submetido e recebe um evento 'e' como argumento
    const onSubmit = async (e) => {
        //previne o comportamento padrao do formulario
        //de carregar a pagina quando submetido
        e.preventDefault()
        //cria um objeto 'data' que contem os valores dos campos 
        //do formulario
        const data= {
            firstName,
            lastName,
            email
        }
        // url do endpoint para onde a requisicao é feita
        const url= "http://127.0.0.1:5000/" + (updating? 'update_contact/${existingContact.id}': "create_contact")
        //definindo as opcoes da requisicao
        const options={
            method:updating ? "PATCH" : "POST",
            //cabecalho: indica que o corpo da requisicao é json
            headers:{
                "Content-Type":"application/json"},
            //corpo: dados convertidos para Json
            body: JSON.stringify(data)
        }
        //faz a requisicao para o servidor utilizando a url
        const response = await fetch(url, options)
        //verifica a resposta; se nao for 200 ou 201 sgnifica que houve um erro
        //analisa a resposta json e emite msg de alerta com 
        //a msg de erro recebida
        if(response.status !== 201 && response.status!==200){
            const data = await response.json()
            alert(data.message)
        }else{
            updateCallback() 
        }
    }
    //retorno do componente: retorna um formulario html com um
    //eventoo 'onSubmit' definido para chamar a funcao qndo o 
    //formulario for submetido
    return(
        <form onSubmit={onSubmit}>
            <div>
                <label htmlFor="firstName">First Name: </label>
                <input type="text" id="firstName"
                    value={firstName}
                    //manipulador de mudanca, que atualiza o estado correspondente
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="lastName">Last Name: </label>
                <input type="text" id="lastName"
                    value={lastName} onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="email">Email: </label>
                <input type="text" id="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <button type="submit">{updating? "Update" : "Create"}</button>
        </form>

    );
};

export default ContactForm
