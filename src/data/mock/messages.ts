import type { Message } from "@/types";
import { conversations } from "./conversations";
import { hoursAgo } from "@/lib/time";

// Thread canônica — conv_1842 (John Smith), conforme docs/04-mock-data-acme-cloud.md §6.
const conv1842: Message[] = [
  {
    id: "msg_1842_1",
    conversationId: "conv_1842",
    authorType: "customer",
    authorId: "cus_001",
    body: "Meu pagamento falhou mas fui cobrado duas vezes, por favor me ajudem.",
    createdAt: hoursAgo(4),
  },
  {
    id: "msg_1842_2",
    conversationId: "conv_1842",
    authorType: "agent",
    authorId: "agent_billing",
    body: "Verifiquei seu pagamento — parece ser uma cobrança duplicada. Deixa eu confirmar e resolver isso.",
    createdAt: hoursAgo(3.9),
  },
  {
    id: "msg_1842_3",
    conversationId: "conv_1842",
    authorType: "system",
    authorId: "system",
    body: "A IA escalou para Maria Silva para confirmação (valor acima do limite de aprovação automática).",
    createdAt: hoursAgo(3.8),
  },
  {
    id: "msg_1842_4",
    conversationId: "conv_1842",
    authorType: "human",
    authorId: "usr_maria",
    body: "Confirmado e reembolsei a cobrança duplicada. Desculpa pelo transtorno!",
    createdAt: hoursAgo(3),
  },
];

interface Template {
  customer: string;
  reply?: string;
  replyAuthorType?: "agent" | "human";
  replyAuthorId?: string;
}

const TEMPLATES: Record<string, Template> = {
  conv_1002: {
    customer: "Oi, desde que mudamos para o novo domínio do SSO não consigo mais fazer login — ele só volta para a tela de login. Alguém pode verificar?",
    reply: "Obrigado por avisar, aqui é o Pedro — estou verificando o mapeamento de domínio do seu SSO agora, um momento.",
    replyAuthorType: "human",
    replyAuthorId: "usr_pedro",
  },
  conv_1003: {
    customer: "Estávamos esperando o kit de hardware do onboarding semana passada e ainda não chegou. Alguma atualização sobre o envio?",
    reply: "Já puxei os detalhes de rastreamento do seu envio e estou confirmando o status atual com nosso parceiro logístico.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_technical",
  },
  conv_1004: {
    customer: "Seria possível agendar nossas exportações em massa para rodar automaticamente toda semana em vez de manualmente? Ia economizar bastante nosso tempo.",
    reply: "Ótima ideia — já registrei como uma solicitação de funcionalidade e compartilhei com o time de produto para avaliação.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_success",
  },
  conv_1005: {
    customer: "Fiquei bloqueado da minha conta depois de algumas tentativas de login malsucedidas, e preciso de acesso urgente para uma ligação com cliente.",
    reply: "Entendo a urgência — estou verificando sua identidade agora para desbloquear a conta com segurança.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_support",
  },
  conv_1006: {
    customer: "Poderiam reemitir nossa última nota fiscal com o CNPJ/VAT atualizado? Nosso time financeiro precisa disso para compliance.",
    reply: "Feito! A nota fiscal atualizada com o novo CNPJ/VAT foi enviada para o seu contato de billing.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_billing",
  },
  conv_1007: {
    customer: "Tivemos uma grande indisponibilidade do nosso lado semana passada durante a instabilidade da sua plataforma e perdemos várias horas de trabalho faturável. Estamos solicitando um reembolso por esse período.",
    reply: "Sinto muito pela interrupção. Esse valor de reembolso precisa da confirmação de um gestor dado o impacto que você descreveu — escalando agora para garantir que seja tratado corretamente.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_billing",
  },
  conv_1008: {
    customer: "Nossa validação de assinatura de webhook começou a falhar essa manhã sem nenhuma mudança do nosso lado. Alguma coisa mudou no algoritmo de assinatura?",
    reply: "Nada mudou do nosso lado recentemente, mas vamos verificar novamente o segredo de assinatura e os headers que você está usando — compartilhando nossa documentação atualizada agora.",
    replyAuthorType: "human",
    replyAuthorId: "usr_pedro",
  },
  conv_1009: {
    customer: "O link de redefinição de senha que vocês enviaram expirou antes que eu conseguisse usar. Podem enviar um novo?",
    reply: "Enviei um novo link de redefinição para o seu e-mail cadastrado — é válido pelos próximos 30 minutos.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_support",
  },
  conv_1010: {
    customer: "Fizemos downgrade de Enterprise para Business mês passado, mas a nota fiscal desse mês ainda mostra o preço do Enterprise. Podem verificar?",
    reply: "Obrigada por notar isso — estou puxando o histórico de mudanças da sua assinatura para revisar o que aconteceu e emitir o crédito correto.",
    replyAuthorType: "human",
    replyAuthorId: "usr_maria",
  },
  conv_1011: {
    customer: "Precisamos de uma exportação completa dos dados da nossa conta para uma auditoria de compliance que está chegando. Qual é o processo para isso?",
    reply: "Posso disparar uma exportação completa de compliance para o seu workspace — normalmente completa em algumas horas e vou compartilhar o link seguro de download aqui.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_success",
  },
  conv_1012: {
    customer: "Sinceramente estamos considerando cancelar — o custo do plano ficou difícil de justificar dado o quão pouco estamos usando algumas das funcionalidades.",
    reply: "Agradeço muito você compartilhar isso diretamente. Você estaria aberto a uma ligação rápida com nosso time de Customer Success antes de tomar a decisão final? Talvez consigamos encontrar algo que se encaixe melhor.",
    replyAuthorType: "human",
    replyAuthorId: "usr_sofia",
  },
  conv_1013: {
    customer: "Pequena sugestão — adoraria uma opção de modo escuro para a seção de relatórios, cansa muito a vista de madrugada!",
    reply: "Anotado — obrigado pela sugestão, registrei para o nosso time de design avaliar.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_support",
  },
  conv_1014: {
    customer: "Estamos recebendo erros 429 de rate-limit no nosso job de sincronização em massa que antes funcionava bem. Os limites de taxa mudaram recentemente?",
    reply: "Recentemente apertamos os limites de taxa em endpoints em lote — recomendaria agrupar suas requisições e respeitar o header Retry-After. Compartilhando nosso guia atualizado agora.",
    replyAuthorType: "human",
    replyAuthorId: "usr_pedro",
  },
  conv_1015: {
    customer: "Meu cartão está sendo recusado pela segunda vez essa semana e eu não entendo por quê, isso é muito frustrante.",
    reply: "Desculpa pelo transtorno — estou verificando o cartão cadastrado e vou tentar o pagamento novamente após confirmar os detalhes.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_billing",
  },
  conv_1016: {
    customer: "O envio do nosso kit de compliance parece estar preso na alfândega, vocês têm alguma visibilidade de quando vai liberar?",
    reply: "Verifiquei com nosso parceiro logístico — liberou da alfândega essa manhã e deve chegar em até 2 dias úteis.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_success",
  },
  conv_1017: {
    customer: "Depois da atualização da política de senhas fiquei bloqueado e não consigo redefinir sozinho. Podem me ajudar a voltar a acessar?",
    reply: "Estou te enviando agora um link seguro de redefinição que já está de acordo com a nova política de senhas — me avisa quando conseguir acessar de novo.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_support",
  },
  conv_1018: {
    customer: "Poderiam nos enviar um pacote com todas as notas fiscais deste ano para o fechamento contábil de fim de ano?",
    reply: "Anexei o pacote completo das notas fiscais deste ano — me avisa se o seu time contábil precisar de mais alguma coisa.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_billing",
  },
  conv_1019: {
    customer: "Percebi um item duplicado na nossa última nota fiscal — podem dar uma olhada?",
    reply: "Você está certo, era uma duplicidade — emiti um crédito que vai ser aplicado automaticamente na sua próxima nota fiscal.",
    replyAuthorType: "human",
    replyAuthorId: "usr_maria",
  },
  conv_1020: {
    customer: "Tem alguma chance de vocês adicionarem uma integração com o Slack para recebermos notificações de atualizações de ticket por lá em vez de e-mail?",
    reply: "Na verdade já suportamos notificações no Slack — habilitei para o seu workspace, confira em Settings → Channels.",
    replyAuthorType: "agent",
    replyAuthorId: "agent_support",
  },
};

function buildMessagesFor(conversationId: string, customerId: string, createdAt: string, lastMessageAt: string): Message[] {
  const template = TEMPLATES[conversationId];
  if (!template) return [];
  const list: Message[] = [
    {
      id: `msg_${conversationId}_1`,
      conversationId,
      authorType: "customer",
      authorId: customerId,
      body: template.customer,
      createdAt,
    },
  ];
  if (template.reply) {
    list.push({
      id: `msg_${conversationId}_2`,
      conversationId,
      authorType: template.replyAuthorType ?? "agent",
      authorId: template.replyAuthorId ?? "agent_support",
      body: template.reply,
      createdAt: lastMessageAt,
    });
  }
  return list;
}

const generated = conversations
  .filter((c) => c.id !== "conv_1842")
  .flatMap((c) => buildMessagesFor(c.id, c.customerId, c.createdAt, c.lastMessageAt));

export const messages: Message[] = [...conv1842, ...generated];

export function getMessagesByConversation(conversationId: string): Message[] {
  return messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
}
