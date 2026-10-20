# Trilha de Dados — aplicativo de estudos

Aplicativo pessoal baseado no plano de curso enviado: Análise de Dados e Programação, com 8 semestres.

## O que já está incluído
- Navegação por semestres, disciplinas, aulas e projetos.
- Pesquisa por conteúdo.
- Progresso de aulas salvo no dispositivo.
- Área de anotações por aula.
- Conteúdo introdutório, conceitos essenciais e prática guiada.
- Projeto 1 aprofundado: seis módulos de aprendizagem, implementação completa em Python, atividades por nível, quiz e checklist de testes.
- Progresso dos módulos do Projeto 1 salvo no dispositivo.
- Links de busca de videoaulas no YouTube e links para documentação.
- Layout responsivo para celular e desktop.
- GitHub Actions para gerar um APK Android de teste.

## Como testar no computador
1. Instale Node.js 20 ou superior.
2. Na pasta do projeto, execute `npm install`.
3. Execute `npm run dev` para abrir a prévia no navegador.
4. Execute `npm run build` para compilar a versão web.

## Como gerar o APK pelo GitHub
1. Crie um repositório no GitHub e envie todos os arquivos desta pasta.
2. Abra a aba **Actions**.
3. Se necessário, habilite GitHub Actions para o repositório.
4. Execute **Gerar APK Android** em **Run workflow** ou faça um push para a branch principal.
5. O workflow instala as dependências com `npm install` sem depender de cache npm ou de um `package-lock.json` pré-existente. Ao terminar, abra a execução e baixe o artefato **trilha-de-dados-apk**.
6. Extraia o ZIP do artefato e instale `app-debug.apk` no Android. O Android pode pedir autorização para instalar apps dessa fonte.

## Importante
- O APK de debug é para uso pessoal/teste, não é uma versão assinada para publicar na Play Store.
- O progresso e as anotações são salvos localmente neste dispositivo/navegador. Limpar os dados do app pode apagá-los.
- Os links de vídeo abrem buscas do YouTube relacionadas ao tema. Isso evita deixar vídeos aleatórios ou desatualizados fixos no aplicativo.
- O Projeto 1 foi aprofundado como trilha prática guiada. As demais aulas ainda usam conteúdo introdutório expansível e podem ser aprofundadas gradualmente.
