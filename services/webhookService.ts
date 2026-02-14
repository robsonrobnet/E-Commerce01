import { ChatMessage, WebhookPayload } from '../types';

// URL de destino (Simulada ou configurada no AdminMarketing)
const DEFAULT_WEBHOOK_URL = 'https://webhook.site/simulate-agent-handover';

export const sendChatHandover = async (
  department: string, 
  history: ChatMessage[],
  webhookUrl: string = DEFAULT_WEBHOOK_URL
): Promise<boolean> => {
  const payload: WebhookPayload = {
    event: 'chat_handover',
    timestamp: new Date().toISOString(),
    department,
    customerSessionId: crypto.randomUUID(), // Identificador único da sessão
    history
  };

  try {
    console.log(`[WEBHOOK] Sending handover to ${department} at ${webhookUrl}`, payload);
    
    // In a real scenario, uncomment the fetch
    // const response = await fetch(webhookUrl, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    // return response.ok;

    // Simulating network delay and success
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  } catch (error) {
    console.error("[WEBHOOK] Failed to send handover:", error);
    return false;
  }
};