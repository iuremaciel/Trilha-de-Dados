
import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import course from "./courseData.json";
import "./style.css";

const KEY = "trilha-dados-progress-v1";
const initial = () => { try { return JSON.parse(localStorage.getItem(KEY)) || { done: [], notes: {}, streak: 0, lastStudy: "" }; } catch { return { done: [], notes: {}, streak: 0, lastStudy: "" }; } };
const allLessons = course.flatMap(s => s.disciplines.flatMap(d => d.lessons.map(l => ({...l, semester:s.number, semesterTitle:s.title, discipline:d.title, id:`${s.number}-${d.title}-${l.number}-${l.title}`}))));
const allProjects = course.flatMap(s => s.disciplines.flatMap(d => d.projects.map((p,i) => ({title:p, semester:s.number, discipline:d.title, id:`project-${s.number}-${d.title}-${i}`}))).concat(s.projects.map((p,i)=>({title:p,semester:s.number,discipline:"Projeto integrador",id:`project-${s.number}-extra-${i}`}))));
const videos = (topic) => `https://www.youtube.com/results?search_query=${encodeURIComponent(topic + " tutorial português")}`;
const docs = (topic) => {
 const t=topic.toLowerCase();
 if(t.includes("python")) return "https://docs.python.org/pt-br/3/";
 if(t.includes("pandas")) return "https://pandas.pydata.org/docs/";
 if(t.includes("numpy")) return "https://numpy.org/doc/";
 if(t.includes("sql") || t.includes("banco")) return "https://www.postgresql.org/docs/";
 if(t.includes("scikit") || t.includes("machine learning") || t.includes("ml")) return "https://scikit-learn.org/stable/user_guide.html";
 if(t.includes("tensorflow") || t.includes("deep learning") || t.includes("rede neural")) return "https://www.tensorflow.org/learn";
 if(t.includes("git") || t.includes("github")) return "https://docs.github.com/pt";
 if(t.includes("power bi")) return "https://learn.microsoft.com/pt-br/power-bi/";
 if(t.includes("spark")) return "https://spark.apache.org/docs/latest/";
 if(t.includes("hugging") || t.includes("transformer") || t.includes("llm") || t.includes("nlp")) return "https://huggingface.co/learn";
 if(t.includes("aws") || t.includes("cloud") || t.includes("nuvem")) return "https://aws.amazon.com/pt/getting-started/";
 return "https://developers.google.com/machine-learning?hl=pt-br";
};
function makeLessonContent(lesson) {
 const title = lesson.title.split(".")[0];
 const low = title.toLowerCase();
 const exercise = lesson.exercise || "Crie um pequeno exemplo, teste diferentes entradas e registre o que aprendeu.";
 let intro = `Nesta aula, você vai estudar ${title.toLowerCase()}. O objetivo é compreender o conceito, saber quando ele é útil e aplicar o conhecimento em um problema prático de análise de dados.`;
 let concepts = [
  `**Entenda o problema:** explique com suas palavras o que esse conceito resolve e em quais situações aparece em projetos reais.`,
  `**Conheça as partes:** identifique os elementos principais, as entradas, as saídas e as limitações da técnica.`,
  `**Valide o resultado:** compare o que você esperava com o resultado obtido e procure possíveis erros ou vieses.`
 ];
 let example = `# Roteiro de estudo: ${title}\n# 1. Defina a pergunta que deseja responder\npergunta = "O que quero descobrir com os dados?"\n\n# 2. Registre a hipótese inicial\nhipotese = "Escreva aqui sua hipótese"\n\n# 3. Depois de analisar os dados, documente a conclusão\nconclusao = "Registre o que os resultados mostram"\nprint(pergunta)\nprint("Hipótese:", hipotese)\nprint("Conclusão:", conclusao)`;
 if(low.includes("variáveis") || low.includes("tipos de dados") || low.includes("operadores")) {
  intro = "Variáveis são nomes que apontam para valores guardados durante a execução. Em Python, cada valor tem um tipo: int para inteiros, float para números decimais, str para texto e bool para verdadeiro/falso. Operadores permitem fazer cálculos e comparações.";
  concepts = ["Use nomes claros, como idade, preco e nome_cliente.", "O operador = atribui um valor; == compara dois valores.", "Converta tipos com int(), float() e str() quando necessário."];
  example = 'nome = "Ana"\nidade = 21\naltura = 1.68\nestuda_dados = True\n\nprint(f"{nome} tem {idade} anos")\nprint(idade + 1)\nprint(altura > 1.60)';
 } else if(low.includes("condicionais") || low.includes("if, elif")) {
  intro = "Estruturas condicionais permitem que um programa escolha caminhos diferentes conforme uma condição. Em Python, if testa a primeira condição, elif testa alternativas e else define o caminho padrão.";
  concepts = ["A condição resulta em True ou False.", "A indentação define quais comandos pertencem a cada bloco.", "Teste os limites: abaixo, exatamente no limite e acima."];
  example = 'nota = 7.5\nif nota >= 7:\n    print("Aprovado")\nelif nota >= 5:\n    print("Recuperação")\nelse:\n    print("Reprovado")';
 } else if(low.includes("repetição") || low.includes("for, while")) {
  intro = "Laços de repetição executam um bloco várias vezes. O for é útil para percorrer sequências; o while repete enquanto uma condição for verdadeira. Sempre pense em como o laço termina.";
  concepts = ["range(1, 6) gera os números de 1 a 5.", "Atualize a condição em laços while para evitar repetição infinita.", "Use nomes de variáveis que indiquem o papel de cada item."];
  example = 'numero = 7\nfor i in range(1, 11):\n    print(f"{numero} x {i} = {numero * i}")';
 } else if(low.includes("funções")) {
  intro = "Funções agrupam instruções reutilizáveis. Em Python, def declara uma função, parâmetros recebem dados e return devolve um resultado para quem chamou a função.";
  concepts = ["Uma função deve ter uma responsabilidade clara.", "Parâmetros tornam a função reutilizável com diferentes valores.", "return devolve o resultado; print apenas mostra algo na tela."];
  example = 'def media(valores):\n    if not valores:\n        return 0\n    return sum(valores) / len(valores)\n\nnotas = [8, 7.5, 9]\nprint(media(notas))';
 } else if(low.includes("select") || low.includes("sql:")) {
  intro = "SQL é a linguagem usada para consultar e manipular dados em bancos relacionais. SELECT escolhe colunas, WHERE filtra linhas, ORDER BY ordena resultados e LIMIT restringe a quantidade retornada.";
  concepts = ["SELECT coluna1, coluna2 define o que será exibido.", "WHERE filtra antes da apresentação final.", "Use ORDER BY com ASC ou DESC e limite resultados durante a exploração."];
  example = 'SELECT nome, preco\nFROM produtos\nWHERE preco > 20\nORDER BY preco DESC\nLIMIT 10;';
 } else if(low.includes("pandas")) {
  intro = "Pandas é uma biblioteca Python para trabalhar com dados tabulares. Series representa uma coluna e DataFrame representa uma tabela com linhas e colunas. Ela ajuda a importar, explorar, limpar e transformar conjuntos de dados.";
  concepts = ["Comece observando shape, head(), info() e describe().", "loc seleciona por rótulos; iloc seleciona por posição.", "Documente como valores ausentes e duplicados foram tratados."];
  example = 'import pandas as pd\n\ndf = pd.read_csv("vendas.csv")\nprint(df.head())\nprint(df.info())\nprint(df.describe(numeric_only=True))\n\n# Exemplo: filtrar vendas acima de 100\nprint(df[df["valor"] > 100])';
 } else if(low.includes("estatística descritiva")) {
  intro = "Estatística descritiva resume um conjunto de dados. A média considera todos os valores; a mediana é o valor central ordenado; a moda é o valor mais frequente. Variância e desvio padrão descrevem dispersão.";
  concepts = ["A média pode ser influenciada por valores extremos.", "A mediana costuma ser útil em distribuições assimétricas.", "Sempre informe a unidade e o contexto dos números."];
  example = 'import statistics as st\nnotas = [5, 7, 7, 8, 10]\nprint("Média:", st.mean(notas))\nprint("Mediana:", st.median(notas))\nprint("Moda:", st.mode(notas))\nprint("Desvio padrão:", st.pstdev(notas))';
 } else if(low.includes("visualização") || low.includes("matplotlib") || low.includes("seaborn") || low.includes("plotly")) {
  intro = "A visualização de dados transforma números em representações visuais que ajudam a identificar padrões, comparar grupos e comunicar resultados. Escolha o gráfico de acordo com a pergunta, não apenas pela aparência.";
  concepts = ["Linhas são úteis para evolução no tempo.", "Barras comparam categorias; dispersão investiga relações entre variáveis.", "Títulos, eixos, unidades e fontes devem deixar o gráfico compreensível."];
  example = 'import matplotlib.pyplot as plt\nanos = [2021, 2022, 2023, 2024]\nvalores = [10, 13, 12, 17]\nplt.plot(anos, valores, marker="o")\nplt.title("Evolução ao longo do tempo")\nplt.xlabel("Ano")\nplt.ylabel("Valor")\nplt.grid(True)\nplt.show()';
 } else if(low.includes("regressão")) {
  intro = "Regressão estima uma variável numérica a partir de uma ou mais variáveis explicativas. Uma associação estatística não prova causalidade: fatores não observados podem influenciar os resultados.";
  concepts = ["Separe dados de treino e teste para avaliar generalização.", "Observe os resíduos e métricas como MAE, RMSE e R².", "Evite usar informação que só estaria disponível depois do evento previsto."];
  example = 'from sklearn.linear_model import LinearRegression\n\nX = [[1], [2], [3], [4]]  # horas de estudo\ny = [5, 6, 7, 9]         # notas\nmodelo = LinearRegression()\nmodelo.fit(X, y)\nprint(modelo.predict([[5]]))';
 } else if(low.includes("machine learning") || low.includes("classificação") || low.includes("k-means") || low.includes("random forest")) {
  intro = "Machine Learning usa exemplos de dados para ajustar modelos que fazem previsões ou encontram padrões. Um fluxo responsável inclui definir o objetivo, preparar dados, separar treino e teste, treinar, avaliar e monitorar.";
  concepts = ["Escolha métricas coerentes com o custo dos erros.", "Evite vazamento de dados entre treino e teste.", "Compare com uma solução simples de referência antes de usar modelos complexos."];
  example = 'from sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import classification_report\n\n# X contém atributos; y contém os rótulos\n# X_train, X_test, y_train, y_test = train_test_split(\n#     X, y, test_size=0.2, random_state=42, stratify=y)\n# modelo = RandomForestClassifier(random_state=42)\n# modelo.fit(X_train, y_train)\n# print(classification_report(y_test, modelo.predict(X_test)))';
 } else if(low.includes("redes neurais") || low.includes("deep learning") || low.includes("transformers")) {
  intro = "Deep Learning é uma área de aprendizado de máquina que usa redes neurais com múltiplas camadas para aprender representações complexas. O treinamento ajusta pesos para reduzir uma função de perda.";
  concepts = ["Dados e pré-processamento influenciam fortemente o desempenho.", "Overfitting ocorre quando o modelo memoriza o treino e generaliza mal.", "Use validação, regularização e métricas apropriadas."];
  example = '# Esboço de um experimento de ML\nobjetivo = "Definir a tarefa e a métrica principal"\ndados = "Separar treino, validação e teste"\nmodelo = "Escolher uma arquitetura simples como baseline"\navaliacao = "Comparar resultados e inspecionar erros"\nprint(objetivo, dados, modelo, avaliacao, sep="\\n")';
 } else if(low.includes("git") || low.includes("github")) {
  intro = "Git registra o histórico de alterações do projeto; GitHub hospeda repositórios e facilita colaboração. Commits pequenos e descritivos tornam as mudanças rastreáveis e permitem voltar a versões anteriores.";
  concepts = ["git status mostra arquivos alterados.", "git add prepara mudanças e git commit registra um ponto no histórico.", "Branches permitem experimentar sem alterar diretamente a versão principal."];
  example = 'git status\ngit add .\ngit commit -m "Adiciona análise inicial"\ngit push';
 } else if(low.includes("banco de dados") || low.includes("modelo relacional") || low.includes("join")) {
  intro = "Um banco de dados organiza informações para que possam ser consultadas e atualizadas com consistência. Em modelos relacionais, tabelas guardam registros e chaves relacionam entidades.";
  concepts = ["Chave primária identifica unicamente cada registro.", "Chave estrangeira representa uma relação entre tabelas.", "JOIN combina linhas de tabelas conforme uma condição."];
  example = 'SELECT clientes.nome, pedidos.data_pedido\nFROM clientes\nLEFT JOIN pedidos\n  ON pedidos.cliente_id = clientes.id;';
 }
 return { intro, concepts, example, exercise };
}

const todoProjectCode = `import json
from pathlib import Path

ARQUIVO = Path("tarefas.json")


def carregar_tarefas():
    """Carrega tarefas salvas; se o arquivo não existir, começa vazio."""
    if not ARQUIVO.exists():
        return []
    try:
        with ARQUIVO.open("r", encoding="utf-8") as arquivo:
            dados = json.load(arquivo)
        if isinstance(dados, list):
            return dados
        print("Aviso: formato de arquivo inesperado. Lista vazia iniciada.")
        return []
    except (json.JSONDecodeError, OSError) as erro:
        print(f"Não foi possível ler o arquivo: {erro}")
        return []


def salvar_tarefas(tarefas):
    """Salva a lista completa em JSON para continuar disponível depois."""
    with ARQUIVO.open("w", encoding="utf-8") as arquivo:
        json.dump(tarefas, arquivo, ensure_ascii=False, indent=2)


def listar_tarefas(tarefas):
    if not tarefas:
        print("\\nNenhuma tarefa cadastrada.")
        return
    print("\\n--- MINHAS TAREFAS ---")
    for indice, tarefa in enumerate(tarefas, start=1):
        status = "✓ concluída" if tarefa["concluida"] else "○ pendente"
        print(f"{indice}. {tarefa['titulo']} — {status}")


def adicionar_tarefa(tarefas):
    titulo = input("Digite a descrição da tarefa: ").strip()
    if not titulo:
        print("A descrição não pode ficar vazia.")
        return
    tarefas.append({"titulo": titulo, "concluida": False})
    salvar_tarefas(tarefas)
    print("Tarefa adicionada e salva!")


def concluir_tarefa(tarefas):
    listar_tarefas(tarefas)
    if not tarefas:
        return
    try:
        numero = int(input("Número da tarefa para alternar status: "))
        if numero < 1 or numero > len(tarefas):
            print("Número fora da lista.")
            return
    except ValueError:
        print("Digite um número inteiro válido.")
        return
    tarefa = tarefas[numero - 1]
    tarefa["concluida"] = not tarefa["concluida"]
    salvar_tarefas(tarefas)
    print("Status atualizado e salvo!")


def excluir_tarefa(tarefas):
    listar_tarefas(tarefas)
    if not tarefas:
        return
    try:
        numero = int(input("Número da tarefa para excluir: "))
        if numero < 1 or numero > len(tarefas):
            print("Número fora da lista.")
            return
    except ValueError:
        print("Digite um número inteiro válido.")
        return
    removida = tarefas.pop(numero - 1)
    salvar_tarefas(tarefas)
    print(f"Tarefa removida: {removida['titulo']}")


def menu():
    tarefas = carregar_tarefas()
    while True:
        print("\\n=== ORGANIZADOR DE TAREFAS ===")
        print("1. Listar tarefas")
        print("2. Adicionar tarefa")
        print("3. Marcar/desmarcar conclusão")
        print("4. Excluir tarefa")
        print("0. Sair")
        opcao = input("Escolha uma opção: ").strip()

        if opcao == "1":
            listar_tarefas(tarefas)
        elif opcao == "2":
            adicionar_tarefa(tarefas)
        elif opcao == "3":
            concluir_tarefa(tarefas)
        elif opcao == "4":
            excluir_tarefa(tarefas)
        elif opcao == "0":
            print("Até logo! Suas tarefas permanecem salvas.")
            break
        else:
            print("Opção inválida. Escolha uma opção do menu.")


if __name__ == "__main__":
    menu()
`;

const todoLessons = [
 {title:"1. Planejamento e requisitos",time:"30 min",goal:"Transformar uma ideia em requisitos claros.",body:["Um programa começa com um problema definido. Nosso problema é lembrar tarefas e consultar seu estado sem depender da memória.","Requisitos funcionais descrevem ações: adicionar, listar, concluir e excluir. Requisitos de qualidade descrevem como o sistema deve se comportar: mensagens compreensíveis, validação de entradas e dados preservados ao fechar o programa.","Antes de programar, desenhe o fluxo: iniciar → carregar arquivo → mostrar menu → executar opção → voltar ao menu → sair."],tasks:["O programa deve permitir adicionar uma tarefa com descrição não vazia.","A lista precisa continuar existindo depois de fechar e abrir o programa.","A entrada inválida não pode encerrar o programa inesperadamente."],exercise:"Escreva mais dois requisitos funcionais e um requisito de qualidade para seu organizador."},
 {title:"2. Modelagem dos dados",time:"35 min",goal:"Representar cada tarefa com uma estrutura simples.",body:["Cada tarefa terá dois campos: titulo (texto) e concluida (booleano True/False). Uma lista agrupa várias tarefas e cada elemento da lista será um dicionário.","Exemplo: {'titulo': 'Estudar Python', 'concluida': False}. Dicionários são úteis quando um registro tem campos nomeados. Listas são úteis quando precisamos guardar vários registros em ordem.","O número mostrado na tela começa em 1, mas os índices de listas começam em 0. Por isso, para acessar o item escolhido pelo usuário, usamos tarefas[numero - 1]."],tasks:["Identifique o tipo de dado de titulo.","Identifique os dois possíveis valores de concluida.","Explique por que numero - 1 é necessário ao acessar uma lista."],exercise:"Crie manualmente uma lista com três tarefas fictícias, duas pendentes e uma concluída."},
 {title:"3. Funções e responsabilidades",time:"40 min",goal:"Dividir o programa em funções menores e testáveis.",body:["Uma função agrupa uma responsabilidade com um nome. carregar_tarefas lê os dados; salvar_tarefas escreve; listar_tarefas apresenta; adicionar_tarefa inclui; concluir_tarefa muda o estado; excluir_tarefa remove; menu coordena o fluxo.","Essa separação evita um único bloco enorme e facilita localizar erros. Cada função recebe ou usa os dados necessários, realiza uma tarefa e retorna o controle ao chamador.","A função input retorna texto. Quando precisamos de um número, convertemos com int() e tratamos ValueError, pois o usuário pode digitar letras."],tasks:["Aponte qual função é responsável por salvar os dados.","Por que a conversão int(input(...)) precisa de tratamento de erro?", "Adicione comentários curtos que expliquem decisões importantes, não cada linha óbvia."],exercise:"Desenhe um mapa das funções e escreva em uma frase o que cada uma faz."},
 {title:"4. Menu, condições e repetição",time:"40 min",goal:"Criar uma interface de terminal que continue funcionando até o usuário sair.",body:["while True mantém o menu ativo. A opção digitada é comparada com if/elif/else para decidir qual função executar. A opção 0 usa break para sair do laço.","A opção deve ser lida como texto e comparada com '1', '2', '3', '4' e '0'. Isso evita converter uma opção que pode conter qualquer caractere.","Toda entrada de índice precisa ser validada: primeiro verificar se a lista não está vazia, depois converter a opção em inteiro e conferir se está entre 1 e len(tarefas)."],tasks:["O que aconteceria se o menu não tivesse break?", "Qual mensagem deve aparecer para a opção 9?", "Por que a lista vazia deve ser verificada antes de escolher uma tarefa?"],exercise:"Acrescente a opção 5 para mostrar quantas tarefas estão pendentes."},
 {title:"5. Persistência em arquivo JSON",time:"45 min",goal:"Salvar e recuperar tarefas entre execuções.",body:["Variáveis existem durante a execução, mas desaparecem quando o programa termina. Persistência significa gravar os dados em um armazenamento durável, neste caso o arquivo tarefas.json.","O módulo json converte listas e dicionários Python para um formato de texto estruturado. json.dump grava; json.load lê. O parâmetro ensure_ascii=False mantém acentos legíveis e indent=2 facilita inspecionar o arquivo.","Path verifica se o arquivo existe. Se não existir, começamos com uma lista vazia. Se o arquivo estiver vazio ou com JSON inválido, tratamos JSONDecodeError para evitar uma falha sem explicação."],tasks:["Qual a diferença entre guardar uma lista numa variável e gravá-la num arquivo?", "Para que serve encoding='utf-8'?", "Abra tarefas.json depois de adicionar uma tarefa e observe a estrutura."],exercise:"Teste o programa: adicione duas tarefas, feche e execute de novo. Confirme se as tarefas foram recuperadas."},
 {title:"6. Testes, depuração e melhorias",time:"35 min",goal:"Verificar os caminhos normais e os casos extremos.",body:["Um teste é uma tentativa planejada de confirmar um comportamento. Não teste apenas o caminho feliz: teste lista vazia, descrição em branco, letras onde se espera um número, índice fora da faixa e arquivo inexistente.","Depurar é localizar a causa de um problema. Leia a última linha do erro, reproduza o comportamento e teste uma alteração por vez. Mensagens claras ajudam tanto o usuário quanto quem desenvolve.","Depois da versão básica, você pode adicionar prioridade, data limite, categorias, pesquisa, edição de título, confirmação de exclusão e testes automatizados. Faça uma melhoria por vez para entender seu impacto."],tasks:["Liste cinco casos de teste e o resultado esperado para cada um.","Simule digitar 'abc' quando o sistema pede o número da tarefa.","Proponha uma melhoria e descreva como você a testaria."],exercise:"Execute a lista de testes finais disponível no final deste projeto e registre os resultados."}
];

function ProjectOnePage({onBack}) {
 const [tab,setTab] = useState("trilha");
 const [lessonIndex,setLessonIndex] = useState(0);
 const [answer,setAnswer] = useState("");
 const [checked,setChecked] = useState(false);
 const [quiz,setQuiz] = useState({});
 const [done,setDone] = useState(()=>{try{return JSON.parse(localStorage.getItem("trilha-todo-project-done"))||[]}catch{return[]}});
 useEffect(()=>{localStorage.setItem("trilha-todo-project-done",JSON.stringify(done))},[done]);
 const lesson=todoLessons[lessonIndex];
 const toggleDone=(i)=>setDone(prev=>prev.includes(i)?prev.filter(n=>n!==i):[...prev,i]);
 const questions=[
  {q:"Qual estrutura representa melhor uma tarefa com título e estado?",opts:["Uma string isolada","Um dicionário com título e concluída","Uma matriz NumPy"],correct:1,why:"O dicionário agrupa campos nomeados; a lista reúne várias tarefas."},
  {q:"Por que usamos tarefas[numero - 1]?",opts:["Porque listas começam no índice 1","Porque input sempre retorna 0","Porque a tela conta desde 1, mas a lista começa no índice 0"],correct:2,why:"O número exibido para a pessoa precisa ser convertido para índice Python."},
  {q:"Qual é o papel de json.dump()?",opts:["Gravar dados Python no arquivo JSON","Mostrar o menu","Apagar o arquivo automaticamente"],correct:0,why:"json.dump serializa objetos Python em JSON e os escreve num arquivo."},
  {q:"O que while True faz no menu?",opts:["Executa o menu uma única vez","Repete o menu até uma saída explícita, como break","Cria automaticamente um arquivo"],correct:1,why:"O laço continua até que uma condição de saída seja acionada."},
  {q:"Qual é uma boa forma de lidar com uma entrada que não pode ser convertida para inteiro?",opts:["Ignorar o erro e fechar o programa","Tratar ValueError e pedir uma entrada válida","Transformar tudo em float sem validar"],correct:1,why:"O tratamento de ValueError permite informar o problema e continuar o programa."}
 ];
 return <div className="page project-detail-page">
  <button className="back" onClick={onBack}>← Voltar aos projetos</button>
  <div className="project-hero"><span className="eyebrow">PROJETO 1 · SEMESTRE 1 · PYTHON</span><h1>Organizador de tarefas (To-Do List)</h1><p>Construa um programa de terminal completo para cadastrar, listar, concluir e excluir tarefas, mantendo tudo salvo em um arquivo JSON.</p><div className="project-meta"><span>⏱ 4 a 5 horas</span><span>◎ Iniciante</span><span>⌘ Python 3</span><span>▤ 6 módulos</span></div><div className="project-progress"><div><b>{done.length} de {todoLessons.length} módulos concluídos</b><span>{Math.round(done.length/todoLessons.length*100)}%</span></div><i><span style={{width:`${done.length/todoLessons.length*100}%`}}/></i></div></div>
  <div className="project-learning-grid"><div className="project-learning-card"><b>🎯 Objetivo final</b><p>Entregar uma aplicação funcional que continua lembrando das tarefas depois que o programa é fechado.</p></div><div className="project-learning-card"><b>🧠 Competências</b><p>Variáveis, listas, dicionários, funções, condições, laços, validação e arquivos JSON.</p></div><div className="project-learning-card"><b>📦 Entrega</b><p>Arquivo <code>main.py</code>, arquivo de dados gerado automaticamente e testes documentados.</p></div></div>
  <div className="project-tabs">{[["trilha","Trilha de aulas"],["codigo","Código completo"],["atividades","Atividades"],["avaliacao","Quiz e testes"]].map(([id,label])=><button key={id} className={tab===id?"on":""} onClick={()=>setTab(id)}>{label}</button>)}</div>
  {tab==="trilha"&&<div className="project-course-layout"><nav className="project-lesson-nav"><h3>Roteiro de aprendizagem</h3><p>Estude em sequência. Cada módulo prepara o próximo.</p>{todoLessons.map((l,i)=><button key={l.title} className={lessonIndex===i?"current":""} onClick={()=>setLessonIndex(i)}><span className={done.includes(i)?"module-number complete":"module-number"}>{done.includes(i)?"✓":i+1}</span><span><b>{l.title}</b><small>{l.time}</small></span><span>›</span></button>)}</nav><article className="project-lesson-content"><span className="content-label">MÓDULO {lessonIndex+1} DE {todoLessons.length} · {lesson.time.toUpperCase()}</span><h2>{lesson.title}</h2><p className="module-goal"><b>Ao final deste módulo:</b> {lesson.goal}</p>{lesson.body.map((para,i)=><p key={i}>{para}</p>)}<h3>Atividade guiada</h3><ol>{lesson.tasks.map((t,i)=><li key={i}>{t}</li>)}</ol><div className="project-exercise-box"><b>✍️ Sua atividade</b><p>{lesson.exercise}</p><textarea value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Registre aqui sua resposta, raciocínio ou resultado..." rows="4"/><p className="muted">A resposta fica nesta tela enquanto você estiver no módulo. Para guardar permanentemente, copie para suas anotações.</p></div><div className="module-controls"><button className="outline" disabled={lessonIndex===0} onClick={()=>{setLessonIndex(i=>i-1);setAnswer("")}}>← Módulo anterior</button><button className="primary" onClick={()=>toggleDone(lessonIndex)}>{done.includes(lessonIndex)?"Desmarcar conclusão":"Marcar módulo concluído ✓"}</button><button className="outline" disabled={lessonIndex===todoLessons.length-1} onClick={()=>{setLessonIndex(i=>i+1);setAnswer("")}}>Próximo módulo →</button></div></article></div>}
  {tab==="codigo"&&<div className="content-card project-code-card"><span className="content-label">IMPLEMENTAÇÃO DE REFERÊNCIA</span><h2>Código completo — main.py</h2><p>Crie uma pasta para o projeto e salve o código abaixo em um arquivo chamado <code>main.py</code>. Ele usa apenas a biblioteca padrão do Python; não precisa instalar pacotes adicionais.</p><div className="code-toolbar"><span>Python · main.py</span><button className="outline" onClick={()=>navigator.clipboard?.writeText(todoProjectCode).then(()=>alert("Código copiado!"),()=>alert("Não foi possível copiar automaticamente. Selecione o código e copie manualmente."))}>Copiar código</button></div><pre className="full-code"><code>{todoProjectCode}</code></pre><h3>Como executar</h3><ol><li>Instale o Python 3 e abra um terminal na pasta do projeto.</li><li>Execute <code>python main.py</code>. Em alguns sistemas, use <code>python3 main.py</code>.</li><li>Adicione tarefas pelo menu. O arquivo <code>tarefas.json</code> será criado automaticamente na mesma pasta.</li><li>Feche o programa, execute novamente e confira se as tarefas continuam lá.</li></ol><div className="tip"><b>Por que salvar só depois de alterar a lista?</b><p>O programa chama salvar_tarefas após adicionar, concluir ou excluir. Assim, cada mudança importante é gravada imediatamente.</p></div></div>}
  {tab==="atividades"&&<div className="activity-grid">{[
   {level:"NÍVEL 1 · FUNDAMENTAL",title:"Contador de tarefas",desc:"Adicione ao menu uma opção que informe quantas tarefas existem no total.",steps:["Use len(tarefas).","Crie uma função contar_tarefas(tarefas).","Teste com lista vazia e com três tarefas."],deliver:"A função deve exibir 0 quando não houver tarefas."},
   {level:"NÍVEL 2 · INTERMEDIÁRIO",title:"Resumo de pendências",desc:"Mostre separadamente quantas tarefas estão concluídas e quantas continuam pendentes.",steps:["Percorra a lista com for.","Conte tarefas com concluida igual a True.","Calcule pendentes = total - concluídas."],deliver:"Exiba um resumo como: 5 tarefas, 2 concluídas, 3 pendentes."},
   {level:"NÍVEL 3 · DESAFIO",title:"Prioridade da tarefa",desc:"Amplie o dicionário para guardar uma prioridade: baixa, média ou alta.",steps:["Peça prioridade ao cadastrar.","Valide a entrada antes de salvar.","Mostre a prioridade ao listar tarefas.","Verifique que tarefas antigas sem esse campo não quebrem o programa."],deliver:"Explique como você trataria os dados já gravados no formato antigo."},
   {level:"NÍVEL 4 · PROJETO EXTRA",title:"Editar descrição",desc:"Permita selecionar uma tarefa e trocar seu título sem criar uma nova tarefa.",steps:["Liste as tarefas numeradas.","Valide o número escolhido.","Peça um novo título não vazio.","Atualize a tarefa e salve o arquivo."],deliver:"Demonstre que a tarefa continua com o mesmo estado de conclusão após a edição."}
  ].map((a,i)=><article className="activity-card" key={a.title}><span className="project-kicker">{a.level}</span><h2>{a.title}</h2><p>{a.desc}</p><h3>Passos sugeridos</h3><ol>{a.steps.map(st=><li key={st}>{st}</li>)}</ol><div className="activity-deliver"><b>Critério de conclusão</b><p>{a.deliver}</p></div></article>)}</div>}
  {tab==="avaliacao"&&<div className="quiz-layout"><article className="content-card"><span className="content-label">VERIFIQUE SEU APRENDIZADO</span><h2>Quiz de fundamentos</h2><p>Responda às cinco questões. Depois confira as explicações para revisar os conceitos.</p>{questions.map((q,i)=><div className="quiz-question" key={q.q}><b>{i+1}. {q.q}</b>{q.opts.map((op,j)=><label key={op} className="quiz-option"><input type="radio" name={`q${i}`} checked={quiz[i]===j} onChange={()=>setQuiz(v=>({...v,[i]:j}))}/>{op}</label>)}{checked&&<p className={quiz[i]===q.correct?"quiz-feedback right":"quiz-feedback wrong"}>{quiz[i]===q.correct?"Correto! ":"Revise: "}{q.why}</p>}</div>)}<button className="primary" onClick={()=>setChecked(true)}>Conferir respostas</button>{checked&&<p className="quiz-score">Pontuação: {questions.filter((q,i)=>quiz[i]===q.correct).length} / {questions.length}</p>}</article><aside className="content-card"><h2>Checklist de testes</h2><p>Antes de considerar o projeto pronto, teste manualmente:</p>{["O programa inicia sem tarefas salvas.","Consigo adicionar uma tarefa válida.","Descrição vazia é recusada.","A lista mostra todas as tarefas.","Consigo concluir e reabrir uma tarefa.","Letras no lugar de número não derrubam o programa.","Número fora da faixa gera aviso.","Consigo excluir uma tarefa específica.","As mudanças permanecem após reiniciar.","A opção 0 encerra o programa normalmente."].map((t,i)=><label className="test-check" key={t}><input type="checkbox"/>{t}</label>)}<div className="tip"><b>Entrega final</b><p>Inclua o código, um pequeno README com instruções de execução e uma lista dos testes realizados. Explique também uma dificuldade que encontrou e como resolveu.</p></div></aside></div>}
  <div className="project-resources"><h2>Materiais para aprofundar</h2><a href="https://docs.python.org/pt-br/3/tutorial/" target="_blank" rel="noreferrer">Tutorial oficial de Python ↗</a><a href="https://docs.python.org/pt-br/3/library/json.html" target="_blank" rel="noreferrer">Documentação do módulo json ↗</a><a href="https://www.youtube.com/results?search_query=python+projeto+lista+de+tarefas+arquivo+json+portugu%C3%AAs" target="_blank" rel="noreferrer">Buscar videoaulas sobre To-Do List em Python ↗</a></div>
 </div>
}

function App() {
 const [progress,setProgress] = useState(initial);
 const [view,setView] = useState("home");
 const [projectReturnView,setProjectReturnView] = useState("projects");
 const [selectedSemester,setSelectedSemester] = useState(1);
 const [selectedDiscipline,setSelectedDiscipline] = useState(null);
 const [selectedLesson,setSelectedLesson] = useState(null);
 const [query,setQuery] = useState("");
 const [quizAnswer,setQuizAnswer] = useState("");
 const [showQuiz,setShowQuiz] = useState(false);
 const [activeTab,setActiveTab] = useState("conteudo");
 const [note,setNote] = useState("");
 useEffect(()=>{ localStorage.setItem(KEY,JSON.stringify(progress)); },[progress]);
 const total = allLessons.length;
 const completed = progress.done.length;
 const percent = total ? Math.round(completed/total*100) : 0;
 const filtered = useMemo(()=>allLessons.filter(l => `${l.title} ${l.discipline} ${l.semesterTitle}`.toLowerCase().includes(query.toLowerCase())),[query]);
 const markDone = (lesson) => setProgress(p=>({...p,done:p.done.includes(lesson.id)?p.done.filter(x=>x!==lesson.id):[...p.done,lesson.id],lastStudy:new Date().toISOString().slice(0,10)}));
 const openLesson = (lesson) => {setSelectedLesson(lesson);setSelectedDiscipline(lesson.discipline);setView("lesson");setActiveTab("conteudo");setQuizAnswer("");setShowQuiz(false);setNote(progress.notes[lesson.id]||"");};
 const saveNote = () => setProgress(p=>({...p,notes:{...p.notes,[selectedLesson.id]:note}}));
 const semester = course.find(s=>s.number===selectedSemester) || course[0];
 const goBack = () => { if(view==="lesson") setView("semester"); else setView("home"); };
 return <div className="app-shell">
  <aside className="sidebar">
   <div className="brand"><div className="brand-icon">∑</div><div><b>Trilha de Dados</b><small>Seu curso, seu ritmo</small></div></div>
   <button className={view==="home"?"nav active":"nav"} onClick={()=>setView("home")}>⌂ <span>Início</span></button>
   <button className={view==="semester"?"nav active":"nav"} onClick={()=>setView("semester")}>▤ <span>Meu curso</span></button>
   <button className={view==="search"?"nav active":"nav"} onClick={()=>setView("search")}>⌕ <span>Buscar conteúdo</span></button>
   <button className={view==="projects"?"nav active":"nav"} onClick={()=>setView("projects")}>◇ <span>Projetos práticos</span></button>
   <div className="side-note"><b>Aprenda fazendo</b><p>Estude um pouco todos os dias. Cada aula concluída aproxima você do seu objetivo.</p></div>
  </aside>
  <main className="main">
   <header className="topbar"><button className="mobile-brand" onClick={()=>setView("home")}>∑ Trilha de Dados</button><span className="crumb">Análise de Dados e Programação</span><div className="top-right"><span className="avatar">E</span><span>Meu espaço de estudo</span></div></header>
   {view==="home" && <div className="page">
    <section className="hero"><div><span className="eyebrow">SUA JORNADA COMEÇA AQUI</span><h1>Aprenda dados.<br/><em>Construa o futuro.</em></h1><p>Um caminho organizado do primeiro código em Python até projetos de análise de dados e inteligência artificial.</p><button className="primary" onClick={()=>{setView("semester");setSelectedSemester(1)}}>Continuar estudando <span>→</span></button></div><div className="hero-art"><div className="orb orb1"></div><div className="orb orb2"></div><div className="code-card"><span>● ● ●</span><code>import pandas as pd<br/>dados = pd.read_csv("dados.csv")<br/>dados.head()</code><div className="chart-bars"><i/><i/><i/><i/><i/><i/></div></div><div className="floating f1">Python</div><div className="floating f2">SQL</div><div className="floating f3">AI ✦</div></div></section>
    <section className="stats"><div className="stat"><span className="stat-icon purple">▣</span><div><small>Semestres</small><strong>8</strong><span>jornada completa</span></div></div><div className="stat"><span className="stat-icon blue">▤</span><div><small>Aulas no plano</small><strong>{total}</strong><span>para explorar</span></div></div><div className="stat"><span className="stat-icon green">✓</span><div><small>Concluídas</small><strong>{completed}</strong><span>{percent}% do curso</span></div></div></section>
    <section className="section-head"><div><h2>Seu caminho de aprendizagem</h2><p>Avance semestre por semestre, da base à especialização.</p></div><button className="text-button" onClick={()=>setView("semester")}>Ver curso completo →</button></section>
    <div className="semester-grid">{course.map(s=><button className="semester-card" key={s.number} onClick={()=>{setSelectedSemester(s.number);setView("semester")}}><div className="semester-top"><span className="semester-number">{String(s.number).padStart(2,"0")}</span><span className="arrow">↗</span></div><h3>{s.title.replace(/^[^—]+—\s*/,"")}</h3><p>{s.disciplines.length} disciplinas • {s.disciplines.reduce((n,d)=>n+d.lessons.length,0)} aulas</p><div className="mini-progress"><i style={{width:`${Math.round(s.disciplines.reduce((n,d)=>n+d.lessons.filter(l=>progress.done.includes(`${s.number}-${d.title}-${l.number}-${l.title}`)).length,0)/Math.max(1,s.disciplines.reduce((n,d)=>n+d.lessons.length,0))*100)}%`}}/></div></button>)}</div>
    <section className="section-head"><div><h2>Continue de onde parou</h2><p>Uma pequena sessão hoje mantém seu progresso.</p></div></section>
    <div className="continue-card"><div className="continue-icon">⌘</div><div><b>{allLessons.find(l=>!progress.done.includes(l.id))?.title || "Você concluiu todas as aulas cadastradas!"}</b><p>{allLessons.find(l=>!progress.done.includes(l.id))?.discipline || "Parabéns pela dedicação."}</p></div><button className="outline" onClick={()=>{const l=allLessons.find(x=>!progress.done.includes(x.id)); if(l)openLesson(l);else setView("semester")}}>Abrir aula →</button></div>
   </div>}
   {view==="semester" && <div className="page">
    <button className="back" onClick={goBack}>← Voltar ao início</button><div className="page-title"><span className="eyebrow">PLANO DE ESTUDOS</span><h1>Meu curso</h1><p>Escolha um semestre e abra uma disciplina para estudar.</p></div>
    <div className="semester-tabs">{course.map(s=><button key={s.number} className={selectedSemester===s.number?"selected":""} onClick={()=>setSelectedSemester(s.number)}>{s.number}º semestre</button>)}</div>
    <div className="semester-banner"><div><span className="eyebrow">SEMESTRE {semester.number}</span><h2>{semester.title.replace(/^[^—]+—\s*/,"")}</h2><p>{semester.disciplines.length} disciplinas para desenvolver sua base e avançar com prática.</p></div><div className="banner-count">{semester.disciplines.reduce((n,d)=>n+d.lessons.length,0)}<small>aulas</small></div></div>
    <div className="discipline-list">{semester.disciplines.map((d,i)=><div className="discipline" key={d.title}><div className="discipline-heading"><div className="discipline-icon">{["⌘","∑","▦","◈","⌁"][i%5]}</div><div className="discipline-title"><h3>{d.title}</h3><p>{d.lessons.length} aulas • {d.projects.length} projetos</p></div><span className="disc-progress">{d.lessons.filter(l=>progress.done.includes(`${semester.number}-${d.title}-${l.number}-${l.title}`)).length}/{d.lessons.length}</span></div>{d.lessons.map(l=>{const obj={...l,semester:semester.number,semesterTitle:semester.title,discipline:d.title,id:`${semester.number}-${d.title}-${l.number}-${l.title}`};return <button className="lesson-row" key={obj.id} onClick={()=>openLesson(obj)}><span className={progress.done.includes(obj.id)?"lesson-check done":"lesson-check"}>{progress.done.includes(obj.id)?"✓":l.number}</span><span className="lesson-row-title"><b>{l.title}</b>{l.exercise&&<small>Prática: {l.exercise}</small>}</span><span className="row-arrow">→</span></button>})}{d.projects.map((p,i)=><div className="project-row" key={p}><span>◇</span><div><b>Projeto prático {i+1}</b><p>{p}</p></div></div>)}</div>)}</div>
   </div>}
   {view==="lesson" && selectedLesson && <div className="page lesson-page"><button className="back" onClick={()=>setView("semester")}>← Voltar às disciplinas</button><div className="lesson-header"><span className="eyebrow">SEMESTRE {selectedLesson.semester} · {selectedLesson.discipline}</span><h1>{selectedLesson.title}</h1><p>Estude no seu ritmo, pratique e marque a aula como concluída quando se sentir seguro.</p><div className="lesson-actions"><button className={progress.done.includes(selectedLesson.id)?"success":"primary"} onClick={()=>markDone(selectedLesson)}>{progress.done.includes(selectedLesson.id)?"✓ Aula concluída":"Marcar como concluída"}</button><button className="outline" onClick={()=>setActiveTab("anotacoes")}>✎ Minhas anotações</button></div></div>
    <div className="lesson-tabs"><button className={activeTab==="conteudo"?"on":""} onClick={()=>setActiveTab("conteudo")}>Conteúdo da aula</button><button className={activeTab==="pratica"?"on":""} onClick={()=>setActiveTab("pratica")}>Exercício prático</button><button className={activeTab==="materiais"?"on":""} onClick={()=>setActiveTab("materiais")}>Vídeos e materiais</button><button className={activeTab==="anotacoes"?"on":""} onClick={()=>setActiveTab("anotacoes")}>Minhas anotações</button></div>
    {activeTab==="conteudo" && <div className="lesson-content"><article className="content-card"><span className="content-label">O QUE VOCÊ VAI APRENDER</span><p>{makeLessonContent(selectedLesson).intro}</p><h2>Conceitos essenciais</h2><ul>{makeLessonContent(selectedLesson).concepts.map((c,i)=><li key={i}>{c}</li>)}</ul><div className="tip"><b>💡 Dica de estudo</b><p>Leia uma vez para entender a ideia geral. Depois, explique o conceito com suas próprias palavras e tente dar um exemplo sem consultar o material.</p></div><h2>Resumo para revisar</h2><p>Ao terminar, você deve conseguir definir o tema, explicar para que serve, reconhecer quando usá-lo e aplicar o conceito em um pequeno exercício. Se ainda não conseguir, revise os conceitos essenciais e tente novamente.</p></article><aside className="lesson-aside"><div className="aside-card"><b>Checklist da aula</b><p>Marque mentalmente cada etapa antes de avançar.</p><ul className="checklist"><li>Entendi a ideia principal</li><li>Consigo explicar com minhas palavras</li><li>Fiz o exercício</li><li>Registrei minhas dúvidas</li></ul></div><div className="aside-card"><b>Aprender é praticar</b><p>Faça pequenos testes, observe os resultados e anote os erros. Eles fazem parte do aprendizado.</p></div></aside></div>}
    {activeTab==="pratica" && <div className="content-card practice"><span className="content-label">MÃO NA MASSA</span><h2>Desafio da aula</h2><p>{makeLessonContent(selectedLesson).exercise}</p><h3>Exemplo guiado</h3><p>Use este exemplo como ponto de partida. Leia cada linha, altere os valores e observe o que muda.</p><pre><code>{makeLessonContent(selectedLesson).example}</code></pre><div className="tip"><b>Desafio extra</b><p>Resolva novamente sem copiar o exemplo. Depois, altere uma condição ou use outro conjunto de dados para verificar se sua solução continua funcionando.</p></div><button className="primary" onClick={()=>markDone(selectedLesson)}>{progress.done.includes(selectedLesson.id)?"Aula já concluída ✓":"Concluir aula após praticar"}</button></div>}
    {activeTab==="materiais" && <div className="resource-grid"><div className="resource-card"><div className="resource-icon red">▶</div><h3>Videoaulas no YouTube</h3><p>Encontre explicações e demonstrações práticas relacionadas ao tema desta aula.</p><a href={videos(selectedLesson.title+" "+selectedLesson.discipline)} target="_blank" rel="noreferrer">Buscar vídeos sobre este tema ↗</a></div><div className="resource-card"><div className="resource-icon blue">⌘</div><h3>Documentação e tutoriais</h3><p>Consulte materiais de referência para aprofundar o assunto e conferir exemplos.</p><a href={docs(selectedLesson.title+" "+selectedLesson.discipline)} target="_blank" rel="noreferrer">Abrir documentação ↗</a></div><div className="resource-card"><div className="resource-icon purple">⌕</div><h3>Pesquisa complementar</h3><p>Busque o tema junto com palavras como “exemplo prático”, “exercícios” e “projeto”.</p><a href={`https://www.google.com/search?q=${encodeURIComponent(selectedLesson.title+" "+selectedLesson.discipline+" exemplos exercícios")}`} target="_blank" rel="noreferrer">Pesquisar materiais ↗</a></div></div>}
    {activeTab==="anotacoes" && <div className="content-card"><h2>Minhas anotações</h2><p>Guarde definições, dúvidas, comandos úteis e exemplos que queira revisar depois.</p><textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Escreva suas anotações desta aula..." rows="9"/><button className="primary" onClick={saveNote}>Salvar anotações</button><p className="muted">As anotações ficam salvas neste dispositivo.</p></div>}
   </div>}
   {view==="search" && <div className="page"><div className="page-title"><span className="eyebrow">BIBLIOTECA DO CURSO</span><h1>Buscar conteúdo</h1><p>Pesquise por assunto, disciplina ou semestre.</p></div><input className="search-input" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Ex.: Python, SQL, regressão, redes neurais..."/><div className="search-results"><p>{filtered.length} aulas encontradas</p>{filtered.map(l=><button key={l.id} className="search-result" onClick={()=>openLesson(l)}><span className="lesson-check">{l.semester}</span><span><b>{l.title}</b><small>{l.discipline} · Semestre {l.semester}</small></span><span>→</span></button>)}</div></div>}
   {view==="projects" && <div className="page"><div className="page-title"><span className="eyebrow">PORTFÓLIO</span><h1>Projetos práticos</h1><p>Transforme teoria em projetos que demonstram suas habilidades.</p></div><div className="project-grid">{allProjects.map((p,index)=><div className="project-card" key={p.id}><span className="project-kicker">SEMESTRE {p.semester} · {p.discipline}</span><h3>{p.title}</h3><p>{index===0?"Projeto guiado completo: aulas em sequência, código comentado, atividades progressivas, quiz e checklist de testes.":"Defina o problema, documente os dados, implemente uma solução, teste os resultados e registre o que aprendeu."}</p>{index===0?<button className="primary" onClick={()=>{setProjectReturnView("projects");setView("project-detail")}}>Estudar projeto completo →</button>:<a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(p.title+" tutorial projeto")}`} target="_blank" rel="noreferrer">Ver referências ↗</a>}</div>)}</div></div>}
   {view==="project-detail" && <ProjectOnePage onBack={()=>setView(projectReturnView)}/>}
   <footer>Trilha de Dados <span>•</span> Estude com consistência, pratique com curiosidade.</footer>
  </main>
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);
