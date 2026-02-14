
// Simulates an external notification provider (like SendGrid, Twilio, or Meta API)

interface AlertParams {
  recipient: string;
  message: string;
  type: 'email' | 'whatsapp';
}

export const sendSystemAlert = async ({ recipient, message, type }: AlertParams): Promise<boolean> => {
  console.log(`[${type.toUpperCase()} ALERT] Preparing to send to ${recipient}...`);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!recipient) {
    console.warn(`[${type.toUpperCase()} FAILED] No recipient configured.`);
    return false;
  }

  // In a real application, here would be the fetch() call to your backend or third-party API
  // Example:
  // await fetch('https://api.sendgrid.com/v3/mail/send', { ... })

  console.log(`[${type.toUpperCase()} SENT] To: ${recipient} | Msg: ${message}`);
  return true;
};
