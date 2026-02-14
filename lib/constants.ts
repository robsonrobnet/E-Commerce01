import { Product, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Cadernos',
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    name: 'Escrita',
    image_url: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '3',
    name: 'Organização',
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '4',
    name: 'Acessórios',
    image_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '5',
    name: 'Presentes',
    image_url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&q=80&w=400'
  }
];

// Updated with Semantic SEO for São Paulo market context
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Caderno Inteligente A5 Rose Pastel Original',
    description: 'O Caderno Inteligente A5 Rose é a revolução da papelaria moderna. Com sistema de discos que permite reposicionar folhas, ele é perfeito para estudantes da USP, profissionais da Faria Lima e amantes de Bullet Journal. Sua capa dura em tom rosa pastel traz elegância e durabilidade.',
    price: 89.90,
    stock: 25,
    category: 'Cadernos',
    image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1531346878377-a513bc951a46?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    details: {
      long_description: `Descubra a liberdade de organizar suas ideias com o Caderno Inteligente A5 Rose Pastel. Este não é apenas um caderno, é um sistema completo de organização que se adapta à rotina agitada de São Paulo.
      
      Seja para anotações rápidas no metrô ou para reuniões importantes na Avenida Paulista, a tecnologia de discos permite que você adicione, remova e reorganize as folhas como quiser. A capa rígida protege suas anotações, enquanto o acabamento premium em Rose Pastel adiciona um toque de sofisticação ao seu setup de estudos ou trabalho.`,
      benefits: [
        { title: "Personalização Total", desc: "Sistema de discos permite trocar capas e folhas." },
        { title: "Eco-Friendly", desc: "Menos desperdício, reutilize o caderno infinitamente." },
        { title: "Ideal para SP", desc: "Compacto (A5) para carregar na bolsa no dia a dia da capital." }
      ],
      specs: [
        { label: "Tamanho", value: "A5 (15,5cm x 22cm)" },
        { label: "Gramatura", value: "90g (Tinta não vaza)" },
        { label: "Folhas", value: "60 pautadas + 20 lisas" },
        { label: "Material", value: "Capa rígida e discos em ABS" }
      ]
    }
  },
  {
    id: '2',
    name: 'Kit Canetas Gel Vintage 0.5mm - 5 Cores',
    description: 'Dê vida aos seus resumos e anotações com o Kit de Canetas Gel Vintage. Ponta fina 0.5mm que garante uma escrita macia e sem falhas, ideal para lettering e caligrafia. As cores "Sarasa" inspiradas no estilo retrô são tendência em papelarias boutique.',
    price: 45.00,
    stock: 100,
    category: 'Escrita',
    image_url: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    details: {
      long_description: `Transforme seus cadernos em obras de arte com o Kit de Canetas Gel Vintage. Selecionamos as 5 cores mais desejadas pelos influenciadores de 'Studygram' do Brasil. A tinta em gel de secagem ultra-rápida é perfeita para quem escreve muito e precisa de agilidade, evitando borrões — essencial para canhotos.
      
      O design minimalista do corpo da caneta proporciona uma pegada ergonômica, reduzindo a fadiga durante longas sessões de escrita, seja na biblioteca ou no escritório.`,
      benefits: [
        { title: "Secagem Fast-Dry", desc: "Sem borrões, ideal para canhotos." },
        { title: "Cores Exclusivas", desc: "Tons vintage que não passam para o verso." },
        { title: "Ponta Agulha", desc: "Precisão absoluta para detalhes e gráficos." }
      ],
      specs: [
        { label: "Ponta", value: "0.5mm Fine Point" },
        { label: "Tinta", value: "Gel Pigmentado" },
        { label: "Quantidade", value: "5 Canetas" },
        { label: "Cores", value: "Azul Petróleo, Vinho, Mostarda, Verde Musgo, Cinza" }
      ]
    }
  },
  {
    id: '3',
    name: 'Planner Anual 2025 Floral Capa Dura',
    description: 'Planeje seu sucesso em 2025 com nosso Planner Floral exclusivo. Ferramenta completa de organização pessoal e profissional: visão mensal, semanal, controle financeiro e roda da vida.',
    price: 129.90,
    stock: 15,
    category: 'Organização',
    image_url: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506784926709-b2f9752fc184?auto=format&fit=crop&q=80&w=800'
    ],
    featured: true,
    details: {
      long_description: `O ano de 2025 promete ser incrível, e o Planner Floral é a ferramenta que faltava para você alcançar todas as suas metas. Desenvolvido com base em métodos de produtividade testados, ele ajuda a equilibrar vida pessoal e profissional.
      
      Ideal para a mulher moderna de São Paulo que busca mindfulness em meio ao caos urbano. Inclui áreas para gratidão diária, controle de hábitos e planejamento financeiro detalhado. Capa dura com laminação fosca, resistente a riscos e respingos.`,
      benefits: [
        { title: "Metodologia Completa", desc: "Foco, produtividade e bem-estar." },
        { title: "Acabamento Luxo", desc: "Elástico, fitilho e bolso porta-papéis." },
        { title: "Alta Gramatura", desc: "Papel 120g, use marca-texto sem medo." }
      ],
      specs: [
        { label: "Formato", value: "17cm x 24cm" },
        { label: "Páginas", value: "240 páginas" },
        { label: "Extras", value: "Cartela de adesivos + Régua" },
        { label: "Capa", value: "Dura com Hot Stamping Dourado" }
      ]
    }
  },
  {
    id: '4',
    name: 'Marca-texto Pastel Boss - Estojo com 6 Cores',
    description: 'O clássico que nunca sai de moda. O estojo de Marca-textos Tons Pastéis oferece a qualidade premium alemã com tecnologia anti-secagem. Cores suaves que não cansam a vista.',
    price: 39.90,
    stock: 50,
    category: 'Escrita',
    image_url: 'https://images.unsplash.com/photo-1568205612837-0172ef5d94b4?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1568205612837-0172ef5d94b4?auto=format&fit=crop&q=80&w=800'
    ],
    featured: false,
    details: {
      long_description: `Destaque o que importa sem poluição visual. Os Marca-textos Pastel Boss são favoritos entre estudantes de medicina e direito por suas cores suaves que facilitam a leitura e memorização.
      
      Tecnologia Anti-Dry-Out: pode ficar destampado por até 4 horas sem secar. Perfeito para longas sessões de estudo na biblioteca ou madrugadas de revisão. Um clássico do design alemão agora na sua mesa.`,
      benefits: [
        { title: "Cores Pastel", desc: "Tendência 'Aesthetic' mundial." },
        { title: "Durabilidade", desc: "Tinta à base de água de longa duração." },
        { title: "Versatilidade", desc: "Ponta chanfrada: 2mm e 5mm." }
      ],
      specs: [
        { label: "Tecnologia", value: "Anti-Dry-Out (4h)" },
        { label: "Cores", value: "Pêssego, Menta, Lilás, Rosa, Azul, Amarelo" },
        { label: "Origem", value: "Importado (Alemanha)" },
        { label: "Uso", value: "Papéis comuns, copy, fax" }
      ]
    }
  },
  {
    id: '5',
    name: 'Mochila Minimalista Bege Notebook 15.6"',
    description: 'Unindo estilo urbano e funcionalidade, a Mochila Minimalista Bege é perfeita para o trajeto metrô-trabalho. Compartimento acolchoado para notebook de até 15.6 polegadas.',
    price: 219.90,
    stock: 8,
    category: 'Acessórios',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
    images: [
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&q=80&w=800'
    ],
    featured: false,
    details: {
      long_description: `Chegue com elegância em qualquer lugar. A Mochila Minimalista foi desenhada pensando no profissional dinâmico de São Paulo. Seu tecido Oxford impermeável protege seus pertences das garoas repentinas da cidade.
      
      Conta com compartimento antifurto nas costas para celular e carteira, ideal para andar no transporte público com segurança. Espaço interno inteligente com múltiplos bolsos organizadores.`,
      benefits: [
        { title: "Impermeável", desc: "Proteção contra chuvas leves." },
        { title: "Antifurto", desc: "Bolso estratégico para segurança no metrô." },
        { title: "Ergonômica", desc: "Alças acolchoadas e respiráveis." }
      ],
      specs: [
        { label: "Material", value: "Oxford Impermeável" },
        { label: "Capacidade", value: "20 Litros" },
        { label: "Notebook", value: "Até 15.6 polegadas" },
        { label: "Dimensões", value: "42cm x 30cm x 12cm" }
      ]
    }
  }
];

export const SQL_SETUP_SCRIPT = `
-- Copie e execute este script no SQL Editor do Supabase para criar as tabelas necessárias

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC NOT NULL,
  stock INTEGER DEFAULT 0,
  category TEXT,
  image_url TEXT,
  images TEXT[], -- Array de URLs para o carrossel
  featured BOOLEAN DEFAULT false,
  details JSONB, -- Campo para SEO, Benefícios e Especificações
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  total NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending',
  tracking_code TEXT,
  shipping_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  items JSONB
);

-- Atualizações de Schema (Executar caso as tabelas já existam):
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS images TEXT[];
-- ALTER TABLE products ADD COLUMN IF NOT EXISTS details JSONB;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_code TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipping_method TEXT;
`;