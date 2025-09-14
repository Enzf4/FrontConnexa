# 🎓 Connexa - Frontend React

Plataforma de grupos de estudo universitários desenvolvida em React com integração completa ao backend Node.js.

## 🚀 Funcionalidades

### 🔐 Autenticação

- **Login** com email institucional (@alunos.unisanta.br)
- **Cadastro** com validações completas
- **Recuperação de senha** via email
- **Validação de domínio** universitário em tempo real

### 👥 Grupos de Estudo

- **Criar grupos** com informações detalhadas
- **Buscar grupos** com filtros avançados (matéria, local, texto)
- **Entrar/Sair** de grupos com confirmação
- **Visualizar detalhes** completos do grupo
- **Gerenciar participantes** (admin)

### 💬 Chat em Tempo Real

- **Interface de chat** intuitiva
- **Mensagens em tempo real** (via polling)
- **Identificação de usuários** com foto e curso
- **Auto-scroll** para mensagens recentes
- **Validação de caracteres** (máx 1000)

### 👤 Perfil do Usuário

- **Editar informações** pessoais
- **Upload de foto** de perfil (JPG, PNG, GIF, WEBP)
- **Validação de arquivos** (máx 5MB)
- **Preview da imagem** antes do upload
- **Exclusão de conta** com confirmação

### 🔔 Sistema de Notificações

- **Painel de notificações** completo
- **Filtros por tipo** (mensagens, membros, alterações)
- **Marcar como lida** individual ou em lote
- **Deletar notificações** específicas ou todas
- **Estatísticas** detalhadas

### 📱 Design Responsivo

- **Mobile-first** approach
- **Bootstrap 5** para componentes
- **Breakpoints** otimizados (320px, 768px, 1024px)
- **Navegação intuitiva** com menu fixo
- **Feedback visual** claro (loading, success, error)

## 🛠️ Tecnologias Utilizadas

- **React 18** - Framework principal
- **React Router DOM** - Roteamento
- **React Bootstrap** - Componentes UI
- **Axios** - Requisições HTTP
- **React Toastify** - Notificações
- **Font Awesome** - Ícones
- **CSS3** - Estilos customizados

## 📦 Instalação

### Pré-requisitos

- Node.js 16+
- npm ou yarn
- Backend Connexa rodando na porta 3001

### Passos

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd connexa-frontend
```

2. **Instale as dependências**

```bash
npm install
```

3. **Configure a API**

```javascript
// src/services/api.js
const api = axios.create({
  baseURL: "http://localhost:3001/api", // URL do seu backend
  // ...
});
```

4. **Execute a aplicação**

```bash
npm start
```

5. **Acesse no navegador**

```
http://localhost:3000
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── Navbar.js       # Barra de navegação
├── contexts/           # Contextos React (Estado global)
│   ├── AuthContext.js      # Autenticação
│   ├── GroupsContext.js    # Grupos
│   └── NotificationsContext.js # Notificações
├── pages/              # Páginas da aplicação
│   ├── Login.js            # Login
│   ├── Register.js         # Cadastro
│   ├── Dashboard.js        # Dashboard principal
│   ├── Groups.js           # Lista de grupos
│   ├── CreateGroup.js      # Criar grupo
│   ├── GroupDetails.js     # Detalhes do grupo
│   ├── GroupChat.js        # Chat do grupo
│   ├── Profile.js          # Perfil do usuário
│   └── Notifications.js    # Notificações
├── services/           # Serviços externos
│   └── api.js          # Configuração da API
├── App.js              # Componente principal
├── index.js            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🔧 Configuração da API

A aplicação está configurada para se comunicar com o backend na porta 3001. Para alterar:

```javascript
// src/services/api.js
const api = axios.create({
  baseURL: "http://localhost:3001/api", // Altere aqui
  // ...
});
```

## 📱 Funcionalidades por Página

### Login (`/login`)

- Validação de email institucional
- Validação de senha (8+ caracteres)
- Link para recuperação de senha
- Redirecionamento automático após login

### Cadastro (`/register`)

- Formulário completo com validações
- Seleção de curso e período
- Validação de senha forte
- Campo de interesses opcional

### Dashboard (`/dashboard`)

- Resumo da atividade do usuário
- Cards de estatísticas
- Grupos recentes
- Notificações recentes
- Ações rápidas

### Grupos (`/groups`)

- Lista de todos os grupos
- Filtros de busca (matéria, local, texto)
- Cards informativos
- Status de lotação
- Botão para criar grupo

### Criar Grupo (`/groups/create`)

- Formulário detalhado
- Validações completas
- Seleção de matéria
- Campo de objetivo
- Configuração de local e limite

### Detalhes do Grupo (`/groups/:id`)

- Informações completas
- Lista de participantes
- Ações (entrar/sair/deletar)
- Status de lotação
- Link para chat

### Chat (`/groups/:id/chat`)

- Interface de mensagens
- Envio em tempo real
- Identificação de usuários
- Auto-scroll
- Validação de caracteres

### Perfil (`/profile`)

- Edição de informações
- Upload de foto
- Preview da imagem
- Validação de arquivos
- Exclusão de conta

### Notificações (`/notifications`)

- Lista de notificações
- Filtros por tipo
- Ações em lote
- Estatísticas
- Marcar como lida

## 🎨 Design System

### Cores Principais

- **Primary**: #3498db (Azul)
- **Success**: #27ae60 (Verde)
- **Warning**: #f39c12 (Amarelo)
- **Danger**: #e74c3c (Vermelho)
- **Info**: #17a2b8 (Ciano)

### Componentes

- **Cards**: Sombra sutil, hover effects
- **Botões**: Estados de loading, ícones
- **Formulários**: Validação visual, feedback
- **Navegação**: Menu fixo, badges de notificação

## 🔒 Segurança

- **JWT Token** para autenticação
- **Validação client-side** completa
- **Sanitização** de inputs
- **Headers de autorização** automáticos
- **Redirecionamento** em caso de token inválido

## 📊 Performance

- **Lazy loading** de componentes
- **Otimização de imagens** com fallback
- **Debounce** em buscas
- **Cache** de dados frequentes
- **Loading states** em todas as operações

## 🧪 Testes

Para executar os testes:

```bash
npm test
```

## 🚀 Deploy

### Build para produção

```bash
npm run build
```

### Servir arquivos estáticos

```bash
# Usando serve
npx serve -s build

# Usando nginx
# Copie os arquivos de build/ para o diretório do nginx
```

## 🔄 Integração com Backend

A aplicação se integra completamente com a API Connexa seguindo as melhores práticas:

### ✅ **Serviços Organizados**

```
src/services/
├── api.js                    # Configuração base do Axios
├── authService.js           # Autenticação e usuários
├── userService.js           # Perfil e dados do usuário
├── groupService.js          # Grupos de estudo
├── messageService.js        # Chat e mensagens
└── notificationService.js   # Sistema de notificações
```

### ✅ **Hooks Personalizados**

```
src/hooks/
├── useAuth.js              # Autenticação
├── useGroups.js            # Grupos
└── useNotifications.js     # Notificações
```

### ✅ **Funcionalidades Integradas**

- **Autenticação**: JWT tokens com interceptors automáticos
- **Grupos**: CRUD completo com filtros avançados
- **Chat**: Mensagens em tempo real via polling
- **Notificações**: Sistema completo com estatísticas
- **Upload**: Fotos de perfil com validação
- **Validações**: Sincronizadas com backend
- **Error Handling**: Tratamento centralizado de erros
- **Loading States**: Indicadores visuais em todas as operações

## 📝 Scripts Disponíveis

- `npm start` - Executa em modo desenvolvimento
- `npm run build` - Gera build de produção
- `npm test` - Executa testes
- `npm run eject` - Ejecta configurações (não recomendado)

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 🆘 Suporte

Para dúvidas ou problemas:

1. Verifique se o backend está rodando
2. Confirme as configurações da API
3. Verifique os logs do console
4. Teste a conectividade com o backend

## 🔮 Próximas Funcionalidades

- [ ] WebSocket para chat em tempo real
- [ ] Notificações push
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
- [ ] Testes automatizados
- [ ] Internacionalização
- [ ] Temas customizáveis

---

**Desenvolvido com ❤️ para a comunidade universitária**
