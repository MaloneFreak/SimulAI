SimulAI 🤖
Sobre o Projeto
O SimulAI é uma ferramenta web inovadora que transforma textos gerados por Inteligência Artificial em simulados interativos. A ideia, concebida por Pedro, resolve um problema comum para estudantes: a dificuldade de criar e corrigir provas de estudo de forma rápida e eficiente.

Com o SimulAI, você pode pedir a qualquer IA (GPT, Gemini, Claude, etc.) para criar questões sobre um determinado tópico e, com um simples "copiar e colar", a ferramenta gera um simulado que pode ser respondido e avaliado instantaneamente, com feedback e justificativas para cada resposta.

(Sugestão: Grave um GIF rápido mostrando o fluxo do app e substitua este link!)

✨ Funcionalidades
Análise Inteligente de Texto: Copie e cole o texto diretamente da IA. O SimulAI cuida do resto.

Geração de Simulado Interativo: As questões são transformadas em um formulário de múltipla escolha limpo e fácil de usar.

Avaliação Instantânea: Com um clique no botão "AvaliaAI", suas respostas são corrigidas.

Feedback Construtivo: Respostas erradas são destacadas em vermelho e a justificativa correta é exibida automaticamente. Para as respostas certas, a justificativa pode ser visualizada opcionalmente.

Histórico de Simulados: Todos os seus resultados são salvos em um histórico privado, permitindo que você acompanhe seu progresso e refaça os simulados para reforçar o aprendizado.

🚀 Como Usar
A utilização do SimulAI é extremamente simples, graças ao conceito do "Prompt Mágico".

Passo 1: Gere as Questões
Copie o prompt abaixo e cole na sua IA de preferência (ChatGPT, Gemini, etc.), substituindo [SEU TEMA AQUI] pelo assunto que deseja estudar.

Crie X questões sobre [SEU TEMA AQUI]. Para CADA questão (mesmo que seja uma sub-pergunta como "Pergunta 1", "Pergunta 2"), siga este formato EXATO:

Comece com o texto da questão (pode incluir um enunciado antes).

Liste as alternativas (A, B, C, D).

Marque a resposta correta com o emoji ✅ antes da letra (ex: ✅ C) ...).

Forneça uma justificativa começando com "💡 Justificativa:".

Não adicione números de questão (como 1., 2., etc.) no início, apenas escreva a questão.

IMPORTANTE: Separe CADA questão com "---" em uma linha própria.

Passo 2: Cole no SimulAI
Copie toda a resposta gerada pela IA e cole na área de texto do SimulAI.

Passo 3: Simule e Avalie
Clique em "Analisar e Simular Prova", responda às questões e, ao final, clique em "AvaliaAI ✨" para ver sua performance e aprender com a correção.

Passo 4: Acompanhe seu Progresso
Acesse a aba "Histórico" para ver todos os simulados que você já fez, suas notas e a opção de refazê-los.

🛠️ Configuração Local (Para Desenvolvedores)
Para rodar o SimulAI localmente ou fazer um fork do projeto, você precisará configurar um projeto no Firebase para a funcionalidade de histórico.

Crie um Projeto no Firebase:

Acesse o console do Firebase.

Clique em "Adicionar projeto" e siga as instruções.

Crie um Aplicativo Web:

No painel do seu projeto, clique no ícone da web (</>) para adicionar um novo aplicativo web.

Dê um nome ao seu aplicativo e clique em "Registrar aplicativo".

O Firebase fornecerá um objeto de configuração firebaseConfig. Você não precisa salvá-lo, pois o código já está preparado para recebê-lo de outra forma.

Configure o Firestore Database:

No menu lateral, vá em "Cloud Firestore".

Clique em "Criar banco de dados" e inicie no modo de produção.

Escolha a localização do seu banco de dados (recomenda-se southamerica-east1 para o Brasil).

Adicione as Regras de Segurança:

Ainda no Firestore, vá para a aba "Regras".

Copie e cole o conteúdo do arquivo firestore.rules deste repositório. Essas regras garantem que cada usuário só possa ver e escrever em seu próprio histórico.

Clique em "Publicar".

Execute o Arquivo index.html:

Para que o histórico funcione, o arquivo index.html precisa ser servido por um servidor local (por exemplo, usando a extensão "Live Server" no VS Code) ou hospedado em uma plataforma como GitHub Pages, Vercel ou Netlify. Abrir o arquivo diretamente no navegador pode não funcionar devido às políticas de segurança dos módulos JavaScript.

💻 Tecnologias Utilizadas
HTML5

CSS3 com Tailwind CSS para estilização rápida e responsiva.

JavaScript (ES6 Modules) para toda a lógica da aplicação.

Firebase (Firestore) para o armazenamento seguro e privado do histórico de simulados.

🤝 Como Contribuir
Contribuições são o que tornam a comunidade de código aberto um lugar incrível para aprender, inspirar e criar. Qualquer contribuição que você fizer será muito bem-vinda.

Faça um Fork do Projeto

Crie sua Feature Branch (git checkout -b feature/FuncionalidadeIncrivel)

Faça o Commit de suas mudanças (git commit -m 'Adiciona alguma FuncionalidadeIncrivel')

Faça o Push para a Branch (git push origin feature/FuncionalidadeIncrivel)

Abra um Pull Request

📄 Licença
Distribuído sob a Licença MIT. Veja LICENSE para mais informações.

Projeto idealizado por Pedro e desenvolvido com a assistência de uma IA.
