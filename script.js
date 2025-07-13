// const apiKeyInput = document.querySelector('#apiKey')
const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const quest = document.getElementById('questionInput')
const askButton = document.getElementById('askButton')
const form = document.getElementById('form')
const aiResponse = document.getElementById('aiResponse')
// console.log(apiKeyInput)
// () => {} funçao

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}


const perguntarAi = async(quest, game, apiKey) => {
    const model = "gemini-2.5-flash"
    const geminiURL = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}` 
    const perguntaLol = `
    ## Especialidade
    Voce é um especialista assistente de meta para o jogo ${game}
    -Voce pensa igual um Jogador Profissional, que tem um elo alto, o challenger

    ## Tarefa
    Voce deve responder as perguntas do usuario com base no seu conhecimento do jogo, estrategia build e dicas.

    ## Regras
    -Se voce nao sabe a resposta , responde com "Não Sei" e não tente inventar uma resposta.
    -Se a pergunta não esta relacionada ao jogo , responda essa pargunta com "Essa pergunta não esta relacionada ao jogo"
    -Considere a data atual ${new Date().toLocaleDateString()}
    -faça pesquisas atualizadas sobre o Patch atual, baseado na data atual, para dar uma resposta coerente
    -Nunca responda item que voce não tenha certeza que existe no patch atual.
  
    

    ## Resposta
    -Economize na resposta, seja direto e responda no maximo 1000 caracteres.
    -Responda em markdown
    -Não de nenhuma saudação ou despedida, apenas responda o que o usuario esta querendo
    -respeita a quebra de linha


    ## Exemplo de resposta se o jogo for league of legends ou lol
    pergunta do usuario: melhor build rengar jungle
    resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui.\n\n**Runas:**\n\n

    -----
    Aqui esta a pergunta do usuário:${quest}

    `
    const perguntaTFT = `
        ## Especialidade
    -Voce é um especialista assistente de meta para o jogo ${game}
    -Voce pensa igual um Jogador Profissional, que tem um elo alto, o challenger

    ## Tarefa
    Voce deve responder as perguntas do usuario com base no seu conhecimento do jogo, estrategia build e dicas.

    ## Regras
    -Se voce nao sabe a resposta , responde com "Não Sei" e não tente inventar uma resposta.
    -Se a pergunta não esta relacionada ao jogo , responda essa pargunta com "Essa pergunta não esta relacionada ao jogo"
    -Considere a data atual ${new Date().toLocaleDateString()}
    -faça pesquisas atualizadas sobre o Patch atual, baseado na data atual, para dar uma resposta coerente
    -Nunca responda item que voce não tenha certeza que existe no patch atual.
    -Se for falando/pedido algum item, seja direto e não descreva oq o item faz e não detalhe, pois o jogador ja sabe oq o item faz 
  
    

    ## Resposta
    -Economize na resposta, seja direto e responda no maximo 500 caracteres.
    -Responda em markdown
    -Não de nenhuma saudação ou despedida, apenas responda o que o usuario esta querendo
    - Se o usuario pedir um item do tft(team fight tatics) , voce mostra a melhor comp com maior % em winrate(leve em consideracao que voce sempre joga com oq voce tem, entao sempre de a melhor comp)
    - nao descreva os detalhes dos item do tft
    -respeitar a quebra de linha


    ## Exemplo de resposta 
    pergunta do usuario:darius
    resposta: A  melhor comp Com esse Campeão/Item é:\n\n **Nome Da Composição**\n\ncoloque o nome aqui.\n\n**Time**\n\n coloque aqui todos os campeoes Do time.
    \n\n**Principais Items/Componentes**\n\ncoloque os itens aqui(coloque o nome do campeao e os 3 item dele em categoria, os 3 principais).
    \n\n**Estilo De jogo**\n\n coloque os estilos de jogos aqui: low row, rush 8 ,fale o ideal

    --------
    Aqui esta a pergunta do usuário:${quest}

    `
    let pergunta = ``

    if(game == "lol") {
        pergunta = perguntaLol
    }else{
        pergunta = perguntaTFT
    }



    const contents = [{
        role:"user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search:{}
    }]

    //chamada api
    const response = await fetch(geminiURL, {
        method: 'Post',
        headers:{
            'Content-type': 'application/json'  //conteudo é desse tipo/formato espesifico
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })


    const data = await response.json()
    return data.candidates[0].content.parts[0].text
}

const sendForm = async (event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value 
    const game = gameSelect.value
    const quest = questionInput.value

    

    if(apiKey=='' || game == '' || quest == ''){
        alert('Por favor preencha todos os campos')
        return
    }
    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')


    try{
        //perguntar para ai
        const text = await perguntarAi(quest, game, apiKey)
        aiResponse.querySelector('.response-content').innerHTML = markdownToHTML(text)
        aiResponse.classList.remove('hidden')
    } catch(error) {
        console.log('Erro: ',error)
        }finally{
            askButton.disabled = false
            askButton.textContent = "Perguntar"     //retorna o botao perguntar
            askButton.classList.remove('loading') 
        }
    

}
// script.js

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('box'); // checkbox
    const bodyElement = document.body;

    
    bodyElement.classList.remove('whiteMode'); 
    themeToggle.checked = false; // checkbox esteja desmarcado ao iniciar

    themeToggle.addEventListener('change', () => {
        if (themeToggle.checked) {
            
            bodyElement.classList.add('whiteMode'); 
        } else {
            
            bodyElement.classList.remove('whiteMode'); 
        }
    });
});
form.addEventListener('submit', sendForm)