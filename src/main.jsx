
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
function App() {
 const [progress,setProgress] = useState(initial);
 const [view,setView] = useState("home");
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
   {view==="projects" && <div className="page"><div className="page-title"><span className="eyebrow">PORTFÓLIO</span><h1>Projetos práticos</h1><p>Transforme teoria em projetos que demonstram suas habilidades.</p></div><div className="project-grid">{allProjects.map(p=><div className="project-card" key={p.id}><span className="project-kicker">SEMESTRE {p.semester} · {p.discipline}</span><h3>{p.title}</h3><p>Defina o problema, documente os dados, implemente uma solução, teste os resultados e registre o que aprendeu.</p><a href={`https://www.youtube.com/results?search_query=${encodeURIComponent(p.title+" tutorial projeto")}`} target="_blank" rel="noreferrer">Ver referências ↗</a></div>)}</div></div>}
   <footer>Trilha de Dados <span>•</span> Estude com consistência, pratique com curiosidade.</footer>
  </main>
 </div>
}
createRoot(document.getElementById("root")).render(<App/>);
