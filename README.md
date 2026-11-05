# Cartão Pro — Estúdio de Cartões Profissionais

Aplicação web responsiva para montar cartões digitais clicáveis e peças para impressão. A edição acontece no navegador; não há backend nem envio automático dos dados pessoais.

## Como executar
Abra `index.html` em um navegador moderno ou publique os três arquivos estáticos em qualquer hospedagem HTTPS.

## Recursos implementados nesta atualização
- Editor responsivo com prévia ao vivo.
- Modelos iniciais por profissão: pastor/ministério, moto entregador, costureira/alfaiate, barbeiro, manicure, cabeleireiro, fotógrafo, advogado, saúde, eletricista, construção, professor, mecânico, limpeza, personal trainer, comércio, designer e modelo genérico.
- Personalização de nome, especialidade, frase, WhatsApp, e-mail, Instagram, site e área de atendimento.
- Paletas profissionais e tipografia.
- Formatos horizontal, vertical, triangular, hexagonal e livre.
- Imagem por arquivo ou câmera, com posições configuráveis.
- Gravação de voz pelo microfone e inclusão de trilha de áudio local opcional.
- Exportação de cartão digital HTML independente com links de contato clicáveis e mídia incorporada.
- Exportação de contato vCard.
- Impressão/PDF com frente e verso.
- Rascunho local e histórico de desfazer/refazer.

## Privacidade e permissões
- O acesso à câmera e ao microfone só ocorre após ação explícita do usuário e depende de permissão do navegador.
- O áudio só é reproduzido após interação da pessoa que abrir o cartão.
- A trilha deve ser própria ou licenciada.
- Os dados de edição são mantidos no armazenamento local do navegador. Arquivos de áudio selecionados/gravações ficam na sessão até a exportação; mantenha uma cópia do HTML exportado.

## Limitações conhecidas / validação pendente
- Testar gravação e exportação de áudio nos navegadores-alvo e em celulares reais.
- Ajustar sangria, margens e dimensões finais de impressão conforme gráfica escolhida.
- Rever acessibilidade por teclado/leitor de tela e contraste para cada paleta.
- Testar compartilhamento de arquivo em Android, iOS e desktop.
- Revisar formatos poligonais em impressoras e navegadores que não suportem `clip-path`.
- A versão atual gera um verso de contatos simples; editor independente do verso e modelos específicos por profissão ainda podem ser aprofundados.

## Estrutura
- `index.html`: estrutura da aplicação.
- `style.css`: identidade visual, responsividade e impressão.
- `app.js`: perfis profissionais, editor, mídia local e exportação.
- `logo.png`: marca existente no repositório.
