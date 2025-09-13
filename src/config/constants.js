// Configurações da aplicação Connexa

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
  }
};

export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  MAX_DIMENSIONS: {
    width: 2000,
    height: 2000
  }
};

export const CHAT_CONFIG = {
  POLLING_INTERVAL: 3000, // 3 segundos
  MAX_MESSAGE_LENGTH: 1000,
  MESSAGES_PER_PAGE: 50
};

export const NOTIFICATIONS_CONFIG = {
  POLLING_INTERVAL: 10000, // 10 segundos
  PER_PAGE: 20
};

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100
  },
  GROUP: {
    NAME_MIN_LENGTH: 3,
    NAME_MAX_LENGTH: 100,
    OBJECTIVE_MIN_LENGTH: 10,
    OBJECTIVE_MAX_LENGTH: 500,
    MIN_PARTICIPANTS: 2,
    MAX_PARTICIPANTS: 50
  },
  MESSAGE: {
    MAX_LENGTH: 1000
  }
};

export const EMAIL_DOMAINS = [
  '@univali.br',
  '@edu.univali.br'
];

export const COURSES = [
  'Ciência da Computação',
  'Engenharia de Software',
  'Sistemas de Informação',
  'Engenharia Civil',
  'Engenharia Mecânica',
  'Engenharia Elétrica',
  'Administração',
  'Direito',
  'Medicina',
  'Psicologia',
  'Outro'
];

export const PERIODS = ['1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º', '10º'];

export const SUBJECTS = [
  'Cálculo I', 'Cálculo II', 'Cálculo III',
  'Física I', 'Física II', 'Física III',
  'Química', 'Biologia', 'Matemática',
  'Programação', 'Estrutura de Dados',
  'Banco de Dados', 'Redes de Computadores',
  'Engenharia de Software', 'Sistemas Operacionais',
  'Outro'
];

export const NOTIFICATION_TYPES = {
  NEW_MESSAGE: 'nova_mensagem',
  NEW_MEMBER: 'novo_membro',
  GROUP_CHANGE: 'alteracao_grupo'
};

export const GROUP_STATUS = {
  AVAILABLE: 'available',
  ALMOST_FULL: 'almost_full',
  FULL: 'full'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MEMBER: 'membro'
};

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  GROUPS: '/groups',
  CREATE_GROUP: '/groups/create',
  GROUP_DETAILS: '/groups/:id',
  GROUP_CHAT: '/groups/:id/chat',
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications'
};
