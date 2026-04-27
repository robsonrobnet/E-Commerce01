import { FunctionDeclaration, GoogleGenAI, Type } from "@google/genai";
import { ChatMessage } from "../types";
import { fetchOrdersByDocument } from "./supabaseService";

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  // Use process.env.GEMINI_API_KEY exclusively as per guidelines.
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error("GEMINI_API_KEY not found in environment variables");
    throw new Error("Gemini API Key não configurada no ambiente.");
  }

  const genAI = new GoogleGenAI({ apiKey });
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const prompt = `Crie uma descrição atraente, criativa e vendedora para um produto de papelaria.
    Nome do produto: ${productName}
    Categoria: ${category}
    
    A descrição deve ter cerca de 2 parágrafos curtos. Use um tom encantador e organizado.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text || "Não foi possível gerar a descrição.";
  } catch (error) {
    console.error("Gemini AI Error:", error);
    throw new Error("Falha ao conectar com a IA.");
  }
};

// Define the Function Tool
const checkOrderStatusTool: FunctionDeclaration = {
  name: 'checkOrderStatus',
  description: 'Busca o histórico de pedidos e status atual baseado no CPF ou CNPJ do cliente.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      document: {
        type: Type.STRING,
        description: 'O número do CPF ou CNPJ fornecido pelo cliente para identificação.'
      }
    },
    required: ['document']
  }
};

export const chatWithStoreAgent = async (history: ChatMessage[], newUserMessage: string): Promise<string> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return "Desculpe, estou em manutenção no momento (API Key missing).";
  
    const genAI = new GoogleGenAI({ apiKey });
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `
      Você é a "Papel-IA", a assistente virtual inteligente da Papelaria Encantada.
      
      SEU OBJETIVO:
      Atender clientes em todo o processo de venda, pós-venda, rastreio e suporte com excelência e humanização.

      SUAS REGRAS DE OURO:
      1. **Tom de Voz:** Seja extremamente educada, empática e use emojis fofos (🌸, 🖊️, ✨, 📦). O cliente deve sentir que está falando com alguém que se importa.
      
      2. **Vendas:** Se o cliente perguntar sobre produtos, sugira itens da loja. Se perguntar "Frete", diga que entregamos em toda SP rapidamente.
      
      3. **Rastreio e Pedidos (CRÍTICO):** 
         - Se o cliente perguntar sobre "onde está meu pedido", "status da compra" ou "nota fiscal", você DEVE identificar o cliente.
         - **PASSO 1:** Pergunte educadamente: "Para eu verificar, você poderia me informar o seu CPF ou CNPJ cadastrado na compra? 🌸"
         - **PASSO 2:** Quando o cliente fornecer o número, você DEVE confirmar antes de buscar. Pergunte: "Certo! Você confirma que o documento é [número digitado]?".
         - **PASSO 3:** Somente após o cliente dizer "Sim", "Confirmo" ou "Correto", você deve usar a ferramenta \`checkOrderStatus\`.
         - **NUNCA** invente status de pedidos. Use apenas dados da ferramenta.
      
      4. **Problemas/Suporte:** Se o cliente parecer irritado, pedir reembolso ou a ferramenta não encontrar o pedido, peça desculpas com empatia e sugira: "Sinto muito por isso! Para resolvermos mais rápido, clique no botão 'Falar com Humano' abaixo que vou chamar minha supervisora."
 
      5. **Privacidade:** Nunca mostre dados sensíveis de outros clientes.
      `,
      tools: [{ functionDeclarations: [checkOrderStatusTool] }],
    });
  
    try {
      const contextMessages = history
        .filter(msg => msg.role === 'user' || msg.role === 'model')
        .slice(-10) 
        .map(msg => ({
          role: msg.role === 'model' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        }));
  
      const chat = model.startChat({
        history: contextMessages,
      });

      const result = await chat.sendMessage(newUserMessage);
      const response = result.response;
      
      let finalResponseText = "";

      // Handle function calling
      const call = response.functionCalls()?.[0];
      if (call) {
        if (call.name === 'checkOrderStatus') {
           const docArg = call.args['document'] as string;
           console.log(`[AGENT] Searching DB for document: ${docArg}`);
           const orders = await fetchOrdersByDocument(docArg);
           
           let toolResultData;
           if (orders.length > 0) {
             toolResultData = {
               found: true,
               orders: orders.map(o => ({
                 id: o.id,
                 date: new Date(o.created_at).toLocaleDateString(),
                 total: o.total,
                 status: o.status,
                 tracking: o.tracking_code || "Ainda não gerado",
                 items_count: o.items?.length || 0
               }))
             };
           } else {
             toolResultData = { found: false, message: "Nenhum pedido encontrado com este CPF/CNPJ." };
           }

           const toolResult = await chat.sendMessage([{
             functionResponse: {
               name: 'checkOrderStatus',
               response: { result: toolResultData }
             }
           }]);

           finalResponseText = toolResult.response.text();
        }
      } else {
        finalResponseText = response.text();
      }
  
      return finalResponseText;

    } catch (error) {
      console.error("Chat Agent Error:", error);
      return "Estou tendo um pouquinho de dificuldade para pensar agora. Tente novamente em instantes! 🌸";
    }
};
