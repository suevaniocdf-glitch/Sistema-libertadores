import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from "recharts";
import {
  Trophy, TrendingUp, BookOpen, HandHeart, HeartHandshake, LogOut,
  Plus, Bell, Users, Target, ChevronRight, Check, X, Calendar,
  Award, Flame, ArrowLeft, Search, Trash2, UserPlus, Megaphone,
  BarChart3, ClipboardList, Settings, Sparkles, Package, MapPin, MessageSquare
} from "lucide-react";

/* ============================================================
   DADOS BASE — Catálogo (preço público = meta de vendas)
   ============================================================ */
const CATALOGO = [
  { id: "bem01", categoria: "Bem Estar", nome: "21 Dias para Mudar", preco: 212.64 },
  { id: "bem02", categoria: "Bem Estar", nome: "Revolucione o Seu Futuro", preco: 187.98 },
  { id: "bem03", categoria: "Bem Estar", nome: "Mente Positiva - Enc.", preco: 269.82 },
  { id: "bem04", categoria: "Bem Estar", nome: "O Amanhã Começa Hoje - Magabook", preco: 195.42 },
  { id: "bem05", categoria: "Bem Estar", nome: "Sucesso em Dose Dupla - Enc.", preco: 238.62 },
  { id: "bib01", categoria: "Bíblias", nome: "Bíblia CPB RA06 - Mistério da Profecia", preco: 49.20 },
  { id: "bib02", categoria: "Bíblias", nome: "Coleção Bíblia Ilustrada Família - 6 Volumes", preco: 1281.15 },
  { id: "bib03", categoria: "Bíblias", nome: "O Mundo Colorido da Bíblia", preco: 192.10 },
  { id: "den01", categoria: "Denominacionais", nome: "A Última Chamada", preco: 211.86 },
  { id: "den02", categoria: "Denominacionais", nome: "Desejado de Todas as Nações, O", preco: 88.20 },
  { id: "den03", categoria: "Denominacionais", nome: "Grande Conflito, O", preco: 83.48 },
  { id: "den04", categoria: "Denominacionais", nome: "Mistério da Profecia, O", preco: 161.64 },
  { id: "den05", categoria: "Denominacionais", nome: "Vida de Jesus Luxo - Magabook", preco: 264.72 },
  { id: "den06", categoria: "Denominacionais", nome: "Vida de Jesus - Missão Resgate", preco: 113.94 },
  { id: "den07", categoria: "Denominacionais", nome: "Vida de Jesus - Especial de Natal", preco: 125.22 },
  { id: "fam01", categoria: "Família", nome: "Coleção Projeto Vencedores N.A - 28 vol.", preco: 613.49 },
  { id: "fam02", categoria: "Família", nome: "Felizes no Amor - Enc.", preco: 155.87 },
  { id: "fam03", categoria: "Família", nome: "Felizes no Amor Enc. - Edição Atualizada", preco: 206.81 },
  { id: "fam04", categoria: "Família", nome: "Filhos Vencedores - Enc.", preco: 202.74 },
  { id: "fam05", categoria: "Família", nome: "Filhos Vencedores - Edição Atualizada", preco: 252.48 },
  { id: "sau01", categoria: "Saúde", nome: "101 Segredos Para Viver Melhor", preco: 263.46 },
  { id: "sau02", categoria: "Saúde", nome: "Corpo Saudável", preco: 359.04 },
  { id: "sau03", categoria: "Saúde", nome: "Maravilhoso Poder das Plantas", preco: 211.86 },
  { id: "sau04", categoria: "Saúde", nome: "Poder Medicinal dos Alimentos, O - Enc.", preco: 299.82 },
  { id: "sau05", categoria: "Saúde", nome: "Poder Medicinal dos Sucos e Shakes, O", preco: 359.04 },
  { id: "sau06", categoria: "Saúde", nome: "Sabor da Saúde, O - Enc.", preco: 255.24 },
  { id: "sau07", categoria: "Saúde", nome: "Saúde com Sabor - Enc.", preco: 241.38 },
  { id: "sau08", categoria: "Saúde", nome: "Saúde com Sabor - Missão Resgate", preco: 113.94 },
  { id: "sau09", categoria: "Saúde", nome: "Segredo da Saúde, O - Missão Resgate", preco: 179.22 },
  { id: "rev01", categoria: "Revistas", nome: "Revista Nosso Amiguinho Junior - Atrasado", preco: 20.41 },
  { id: "rev02", categoria: "Revistas", nome: "Revista Nosso Amiguinho - Nº Atrasado", preco: 26.93 },
  { id: "rev03", categoria: "Revistas", nome: "Revista Vida e Saúde - Promocional", preco: 28.94 },
];

const CATEGORIAS_COLPORTOR = ["Estudantes", "Sonhando Alto", "Permanentes"];

/* Campanhas já programadas pelo diretor — usadas para popular o sistema na
   primeira execução, caso ainda não haja nenhuma campanha salva. */
const CAMPANHAS_INICIAIS = [
  { id: "camp-sonhando-garanhuns", nome: "Sonhando Alto Garanhuns", categoria: "Sonhando Alto", inicio: "2026-08-08", fim: "2026-12-01" },
  { id: "camp-estudantes-petrolina", nome: "Estudantes Petrolina", categoria: "Estudantes", inicio: "2026-06-10", fim: "2026-08-31" },
];

// Campanhas reais já realizadas (resultados oficiais do razão APMS). São injetadas
// uma única vez. Quando um colportor se cadastra com o nome igual ao do razão na
// campanha correspondente, ele passa a ver o próprio resultado e o ranking oficial.
const CAMPANHAS_OFICIAIS = [
  {
    id: "camp-oficial-sonhando-alto-2026-1",
    nome: "Sonhando Alto 2026.1 — Caruaru/PE",
    categoria: "Sonhando Alto",
    inicio: "2026-02-19", fim: "2026-06-30",
    tipoResultado: "campanha",
    lider: "Norma Guerra",
    resultados: [
      { posicao: 1, nome: "Jackson Gomes de Sousa", vendido: 6366.76, deposito: 8324.30 },
      { posicao: 2, nome: "Carolina de Oliveira", vendido: 4599.23, deposito: 3874.25 },
      { posicao: 3, nome: "Daniel Pereira Saraiva", vendido: 1707.82, deposito: 2768.91 },
      { posicao: 4, nome: "William Nunes de Franca", vendido: 1550.67, deposito: 2225.00 },
      { posicao: 5, nome: "Allyson Silva Lopes", vendido: 1168.00, deposito: 2193.64 },
      { posicao: 6, nome: "Juliana Sacramento Silva Sousa", vendido: 1096.21, deposito: 2206.55 },
      { posicao: 7, nome: "Pedro Gabriel de Moura Araujo", vendido: 855.80, deposito: 1515.00 },
      { posicao: 8, nome: "Vitor dos Santos Izidio", vendido: 794.85, deposito: 1629.30 },
      { posicao: 9, nome: "Pedro Henrique Gomes da Cruz", vendido: 624.76, deposito: 570.05 },
      { posicao: 10, nome: "Emilly Vitoria da Silva Brito", vendido: 497.57, deposito: 894.98 },
      { posicao: 11, nome: "Kevin Salustiano da Silva", vendido: 258.22, deposito: 1712.53 },
    ],
  },
  {
    id: "camp-oficial-estudantes-2026-1",
    nome: "Estudantes 2026.1 — Caruaru/PE",
    categoria: "Estudantes",
    inicio: "2025-11-01", fim: "2026-03-31",
    tipoResultado: "campanha",
    lider: "Ana Carolina",
    resultados: [
      { posicao: 1, nome: "Carla Fernanda dos Santos Ramalho", vendido: 22537.39, deposito: 32120.23 },
      { posicao: 2, nome: "Carlos Daniel de Souza", vendido: 21857.44, deposito: 30253.00 },
      { posicao: 3, nome: "Thaina Barbosa Alves dos Santos", vendido: 19611.56, deposito: 31212.80 },
      { posicao: 4, nome: "Haroldo Rodrigues de Lima Junior", vendido: 19606.19, deposito: 50699.60 },
      { posicao: 5, nome: "Norma do Egito Guerra", vendido: 9616.58, deposito: 15376.06 },
      { posicao: 6, nome: "Jose Benedito da Silva", vendido: 6266.14, deposito: 9651.48 },
      { posicao: 7, nome: "Laura Rebeca de Santana Alves", vendido: 3909.03, deposito: 6231.73 },
      { posicao: 8, nome: "Filipe Matheus Bezerra da Silva", vendido: 3744.86, deposito: 4092.18 },
      { posicao: 9, nome: "Yan Lucas de Oliveira Gomes", vendido: 2875.10, deposito: 5049.29 },
      { posicao: 10, nome: "Francisco Ray da Silva Lopes", vendido: 2704.59, deposito: 5229.81 },
      { posicao: 11, nome: "Dayvid Ruan Freire Novaes de Sá", vendido: 2272.08, deposito: 3659.48 },
      { posicao: 12, nome: "Léo Gabriel Fernandes de Brito", vendido: 2243.79, deposito: 3349.91 },
      { posicao: 13, nome: "Hadriam Rickewmme da Silva", vendido: 2243.70, deposito: 5711.00 },
      { posicao: 14, nome: "Emilly Mascarenhas dos Santos Pereira", vendido: 2166.56, deposito: 6747.40 },
      { posicao: 15, nome: "Vitor Pedro da Silva", vendido: 2084.19, deposito: 8386.10 },
      { posicao: 16, nome: "Enzzo Harlley Brasiliano", vendido: 2000.81, deposito: 2624.07 },
      { posicao: 17, nome: "Juliana Goncalves Souza", vendido: 1929.90, deposito: 2853.77 },
      { posicao: 18, nome: "Ana Paula da Silva Brito", vendido: 1847.51, deposito: 3580.00 },
      { posicao: 19, nome: "Graziele de Oliveira Santos", vendido: 1761.74, deposito: 2974.93 },
      { posicao: 20, nome: "Nicolas Adriel Vieira de Miranda", vendido: 1750.46, deposito: 3315.96 },
      { posicao: 21, nome: "Elysson Leandro Nunes da Silva", vendido: 1528.20, deposito: 3000.00 },
      { posicao: 22, nome: "Marcelo Luiz dos Santos", vendido: 1526.36, deposito: 3468.50 },
      { posicao: 23, nome: "Ana Julia de Albuquerque", vendido: 1247.61, deposito: 2645.68 },
      { posicao: 24, nome: "Ramon Nunes do Nascimento", vendido: 987.83, deposito: 2789.30 },
      { posicao: 25, nome: "Anthony Daniel Lima Costa", vendido: 942.86, deposito: 1620.00 },
      { posicao: 26, nome: "Jaqueline Horas Rufino", vendido: 930.07, deposito: 1521.50 },
      { posicao: 27, nome: "Marjorie Gabrielle Sousa Camelo", vendido: 741.21, deposito: 1382.00 },
      { posicao: 28, nome: "Kallyel da Silva Holanda Bezerra", vendido: 704.34, deposito: 1343.80 },
      { posicao: 29, nome: "Joao Weslley Dionizio Mendes", vendido: 659.58, deposito: 1591.53 },
      { posicao: 30, nome: "Jackson Gomes de Sousa", vendido: 596.45, deposito: 2036.00 },
      { posicao: 31, nome: "Matheus Pereira da Silva", vendido: 517.80, deposito: 0.00 },
      { posicao: 32, nome: "Luísa Brandão Rocha", vendido: 475.53, deposito: 1499.81 },
      { posicao: 33, nome: "Paulo Emanuel Nunes dos Santos", vendido: 363.77, deposito: 380.00 },
      { posicao: 34, nome: "Alexandra Rodrigues de Souza", vendido: 314.14, deposito: 3667.58 },
      { posicao: 35, nome: "Silas Pessoa da Silva", vendido: 229.08, deposito: 411.61 },
      { posicao: 36, nome: "Alicia Maria Miranda Azevedo", vendido: 205.71, deposito: 721.40 },
      { posicao: 37, nome: "Camile Renata da Silva", vendido: 188.66, deposito: 910.00 },
      { posicao: 38, nome: "Ana Cecilia Vieira Pontes", vendido: 85.68, deposito: 786.60 },
      { posicao: 39, nome: "Samire Franca de Souza", vendido: 0.00, deposito: 0.00 },
      { posicao: 40, nome: "Luiz Carlos Rodrigues Soares", vendido: 0.00, deposito: 0.00 },
      { posicao: 41, nome: "Kauã Rafael Sales Santos", vendido: 0.00, deposito: 540.00 },
    ],
  },
  {
    id: "camp-oficial-permanentes-2026",
    nome: "Permanentes (Efetivos) — Jan a Maio 2026",
    categoria: "Permanentes",
    inicio: "2026-01-01", fim: "2026-05-31",
    tipoResultado: "permanente",
    resultados: [
      { nome: "Arivone Oliveira de Carvalho", tipo: "Ocasional", vendido: 121.81, devolvido: 0, liquido: 121.81, bonificado: 121.81 },
      { nome: "Elias Oliveira Dos Santos", tipo: "Licenciado", vendido: 244.80, devolvido: 0, liquido: 244.80, bonificado: 244.80 },
      { nome: "Gislane da Silva Santana", tipo: "Aspirante", vendido: 12158.86, devolvido: 1133.14, liquido: 11025.72, bonificado: 11025.72 },
      { nome: "Jeysa Nayalle Rodrigues de Sousa", tipo: "Ocasional", vendido: 2664.20, devolvido: 0, liquido: 2664.20, bonificado: 2664.20 },
      { nome: "Jose de Arimateia Rodrigues", tipo: "Ocasional", vendido: 121.81, devolvido: 0, liquido: 121.81, bonificado: 121.81 },
      { nome: "Joseane Gomes Custodio", tipo: "Ocasional", vendido: 1558.96, devolvido: 0, liquido: 1558.96, bonificado: 1558.96 },
      { nome: "Laercia Freires dos Santos", tipo: "Ocasional", vendido: 126.72, devolvido: 0, liquido: 126.72, bonificado: 126.72 },
      { nome: "Lucinete dos Santos Lima Araújo", tipo: "Aspirante", vendido: 5199.52, devolvido: 0, liquido: 5199.52, bonificado: 5199.52 },
      { nome: "Maria Cecilia Praca da Silva", tipo: "Aspirante", vendido: 509.46, devolvido: 0, liquido: 509.46, bonificado: 509.46 },
      { nome: "Maria Goretti Gomes dos Santos", tipo: "Ocasional", vendido: 126.72, devolvido: 0, liquido: 126.72, bonificado: 126.72 },
      { nome: "Maria Luciana Lopes de Oliveira", tipo: "Ocasional", vendido: 529.11, devolvido: 0, liquido: 529.11, bonificado: 529.11 },
      { nome: "Paulo Goes da Silva", tipo: "Ocasional", vendido: 1147.21, devolvido: 0, liquido: 1147.21, bonificado: 1147.21 },
      { nome: "Ramon Nunes do Nascimento", tipo: "Iniciante", vendido: 60393.25, devolvido: 0, liquido: 60393.25, bonificado: 60393.25 },
      { nome: "Rogério Correia da Silva", tipo: "Ocasional", vendido: 90.84, devolvido: 0, liquido: 90.84, bonificado: 90.84 },
      { nome: "Ronilda Silva Rebelo Oliveira", tipo: "Credenciado", vendido: 33251.18, devolvido: 0, liquido: 33251.18, bonificado: 33027.18 },
      { nome: "Suelita Santos Pereira Batista", tipo: "Ocasional", vendido: 35.88, devolvido: 0, liquido: 35.88, bonificado: 35.88 },
    ],
  },
];

// Normaliza nome para comparação (sem acento, minúsculo, espaços colapsados).
function normNome(s) {
  return (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/\s+/g, " ");
}

// Procura o resultado oficial de uma pessoa: pela campanha vinculada (com
// resultados) ou, para permanentes, na campanha oficial de efetivos.
function acharResultadoOficial(me, campanhas) {
  if (!me) return null;
  if (me.campanhaId) {
    const camp = campanhas.find((c) => c.id === me.campanhaId);
    if (camp && camp.resultados) {
      const r = camp.resultados.find((x) => normNome(x.nome) === normNome(me.nome));
      if (r) return { campanha: camp, resultado: r, tipo: camp.tipoResultado || "campanha" };
    }
  }
  if (me.categoria === "Permanentes") {
    const camp = campanhas.find((c) => c.tipoResultado === "permanente" && c.resultados);
    if (camp) {
      const r = camp.resultados.find((x) => normNome(x.nome) === normNome(me.nome));
      if (r) return { campanha: camp, resultado: r, tipo: "permanente" };
    }
  }
  return null;
}
const SEGMENTOS = ["Indicação", "Porta a Porta", "Igrejas", "Agendamento", "Palestra em Empresa"];

/* ============================================================
   META — Estudantes / Sonhando Alto: valor da semestralidade
   (1º Semestre 2026) x2. Fonte: Tabela de Semestralidades 2026-1.
   ============================================================ */
const SEMESTRALIDADES = [
  { colegio: "FAP (antigo IAP)", curso: "Ensino Fundamental", valor: 24696.00 },
  { colegio: "FAP (antigo IAP)", curso: "Ensino Médio", valor: 27276.00 },
  { colegio: "FAP (antigo IAP)", curso: "Ciências Contábeis", valor: 23040.00 },
  { colegio: "FAP (antigo IAP)", curso: "Enfermagem", valor: 24237.00 },
  { colegio: "FAP (antigo IAP)", curso: "Pedagogia", valor: 23040.00 },
  { colegio: "FAP (antigo IAP)", curso: "Psicologia", valor: 26934.00 },
  { colegio: "FAP (antigo IAP)", curso: "Teologia - Bacharel", valor: 27234.00 },
  { colegio: "FAP (antigo IAP)", curso: "Teologia - Licenciatura", valor: 24990.00 },
  { colegio: "FAP (antigo IAP)", curso: "Cursos Tecnólogos - TI", valor: 20514.00 },

  { colegio: "FAAMA", curso: "Ensino Fundamental I", valor: 20940.00 },
  { colegio: "FAAMA", curso: "Ensino Fundamental II", valor: 22140.00 },
  { colegio: "FAAMA", curso: "Ensino Médio", valor: 23790.00 },
  { colegio: "FAAMA", curso: "Enfermagem", valor: 23190.00 },
  { colegio: "FAAMA", curso: "Pedagogia", valor: 18840.00 },
  { colegio: "FAAMA", curso: "Psicologia", valor: 23190.00 },
  { colegio: "FAAMA", curso: "Teologia", valor: 23190.00 },
  { colegio: "FAAMA", curso: "Direito", valor: 21900.00 },
  { colegio: "FAAMA", curso: "Análise e Desenvolvimento de Sistemas", valor: 19194.00 },

  { colegio: "Uniaene", curso: "Ensino Fundamental", valor: 17925.00 },
  { colegio: "Uniaene", curso: "Ensino Médio 1º e 2º", valor: 18945.00 },
  { colegio: "Uniaene", curso: "Ensino Médio 3º", valor: 20145.00 },
  { colegio: "Uniaene", curso: "Administração", valor: 15915.00 },
  { colegio: "Uniaene", curso: "Ciências Contábeis", valor: 15915.00 },
  { colegio: "Uniaene", curso: "Direito", valor: 21705.00 },
  { colegio: "Uniaene", curso: "Enfermagem", valor: 22005.00 },
  { colegio: "Uniaene", curso: "Fisioterapia", valor: 20703.00 },
  { colegio: "Uniaene", curso: "Gestão de TI", valor: 18129.00 },
  { colegio: "Uniaene", curso: "Gastronomia", valor: 17601.00 },
  { colegio: "Uniaene", curso: "Nutrição", valor: 19605.00 },
  { colegio: "Uniaene", curso: "Odontologia", valor: 33147.00 },
  { colegio: "Uniaene", curso: "Pedagogia", valor: 15915.00 },
  { colegio: "Uniaene", curso: "Psicologia", valor: 21855.00 },
  { colegio: "Uniaene", curso: "Teologia", valor: 22005.00 },
  { colegio: "Uniaene", curso: "Medicina Veterinária", valor: 23805.00 },

  { colegio: "FADMINAS", curso: "Administração", valor: 24288.00 },
  { colegio: "FADMINAS", curso: "Ciências Contábeis", valor: 24288.00 },
  { colegio: "FADMINAS", curso: "Ensino Fundamental", valor: 26088.00 },
  { colegio: "FADMINAS", curso: "Ensino Médio 1º e 2º", valor: 26982.00 },
  { colegio: "FADMINAS", curso: "Ensino Médio 3º ano", valor: 27882.00 },
  { colegio: "FADMINAS", curso: "Pedagogia", valor: 22488.00 },
  { colegio: "FADMINAS", curso: "Publicidade e Propaganda", valor: 24438.00 },
  { colegio: "FADMINAS", curso: "Design Gráfico", valor: 22488.00 },
  { colegio: "FADMINAS", curso: "Direito", valor: 26388.00 },
  { colegio: "FADMINAS", curso: "Psicologia", valor: 26988.00 },

  { colegio: "UNASP I", curso: "Administração", valor: 9948.00 },
  { colegio: "UNASP I", curso: "Arquitetura e Urbanismo", valor: 11148.00 },
  { colegio: "UNASP I", curso: "Ciência da Computação", valor: 11148.00 },
  { colegio: "UNASP I", curso: "Ciências Biológicas", valor: 9528.00 },
  { colegio: "UNASP I", curso: "Ciências Contábeis", valor: 9948.00 },
  { colegio: "UNASP I", curso: "Comunicação Social (Pub. e Prop.)", valor: 9948.00 },
  { colegio: "UNASP I", curso: "Direito", valor: 11148.00 },
  { colegio: "UNASP I", curso: "Educação Física Bacharel + Licenciatura", valor: 9948.00 },
  { colegio: "UNASP I", curso: "Enfermagem", valor: 12348.00 },
  { colegio: "UNASP I", curso: "Engenharia da Computação", valor: 11148.00 },
  { colegio: "UNASP I", curso: "Fisioterapia", valor: 11148.00 },
  { colegio: "UNASP I", curso: "Nutrição", valor: 11148.00 },
  { colegio: "UNASP I", curso: "Pedagogia", valor: 9108.00 },
  { colegio: "UNASP I", curso: "Psicologia", valor: 12348.00 },
  { colegio: "UNASP I", curso: "Tecnólogo em Análise de Sistemas", valor: 9108.00 },

  { colegio: "UNASP II", curso: "Administração / Ciências Contábeis / Música", valor: 23568.00 },
  { colegio: "UNASP II", curso: "Arquitetura e Urbanismo", valor: 25968.00 },
  { colegio: "UNASP II", curso: "Comunicação Social (Public, Rádio e TV)", valor: 25188.00 },
  { colegio: "UNASP II", curso: "Direito", valor: 26868.00 },
  { colegio: "UNASP II", curso: "Engenharia Agronômica", valor: 26148.00 },
  { colegio: "UNASP II", curso: "Engenharia Civil", valor: 25848.00 },
  { colegio: "UNASP II", curso: "Engenharia da Computação", valor: 26868.00 },
  { colegio: "UNASP II", curso: "Engenharia de Produção", valor: 25848.00 },
  { colegio: "UNASP II", curso: "Farmácia", valor: 25188.00 },
  { colegio: "UNASP II", curso: "Letras / Tradutor", valor: 23268.00 },
  { colegio: "UNASP II", curso: "Jornalismo", valor: 25188.00 },
  { colegio: "UNASP II", curso: "Medicina Veterinária", valor: 32388.00 },
  { colegio: "UNASP II", curso: "Pedagogia", valor: 23268.00 },
  { colegio: "UNASP II", curso: "Psicologia", valor: 26868.00 },
  { colegio: "UNASP II", curso: "Sistemas de Informação", valor: 26268.00 },
  { colegio: "UNASP II", curso: "Teologia", valor: 26088.00 },
  { colegio: "UNASP II", curso: "Ensino Médio Exatas", valor: 27564.00 },
  { colegio: "UNASP II", curso: "Ensino Médio TI", valor: 27864.00 },

  { colegio: "UNASP III", curso: "Administração / Ciências Contábeis", valor: 23262.00 },
  { colegio: "UNASP III", curso: "Direito", valor: 25542.00 },
  { colegio: "UNASP III", curso: "Educação Física", valor: 23622.00 },
  { colegio: "UNASP III", curso: "Enfermagem", valor: 25542.00 },
  { colegio: "UNASP III", curso: "Engenharia da Computação", valor: 25542.00 },
  { colegio: "UNASP III", curso: "Medicina", valor: 82542.00 },
  { colegio: "UNASP III", curso: "Psicologia", valor: 25542.00 },
  { colegio: "UNASP III", curso: "Publicidade e Propaganda", valor: 23262.00 },
  { colegio: "UNASP III", curso: "Sistemas de Informação", valor: 23622.00 },
];
const COLEGIOS_SEMESTRALIDADE = [...new Set(SEMESTRALIDADES.map((s) => s.colegio))];
// Opção "Outro": para o colportor que não vai estudar em nenhuma das
// faculdades listadas. A meta usa o mesmo valor de referência de
// Teologia na Uniaene (não multiplicado de novo — calcularMetaEstudante
// já aplica o x2 padrão a partir desse valor).
const COLEGIO_OUTRO = "Outro";
const COLEGIOS = [...COLEGIOS_SEMESTRALIDADE, COLEGIO_OUTRO];

/* ============================================================
   META — Permanentes: por categoria (Iniciante/Aspirante/
   Licenciado/Credenciado) e tipo (Livros/Revistas), valor x2.
   ============================================================ */
const NIVEIS_PERMANENTE = ["Iniciante", "Aspirante", "Licenciado", "Credenciado"];
const TIPOS_PERMANENTE = ["Livros", "Revistas"];
const META_PERMANENTE = {
  Livros: { Iniciante: 2647.20, Aspirante: 3176.64, Licenciado: 6618.00, Credenciado: 9265.20 },
  Revistas: { Iniciante: 2908.26, Aspirante: 3554.54, Licenciado: 7270.65, Credenciado: 10178.91 },
};
// Cota reduzida: exceção para colportor Credenciado com mais de 25 anos na
// função. Valor já é o valor MENSAL final (não é multiplicado por 2 como as
// demais metas de Permanente).
const COTA_REDUZIDA_VALOR = 12214.70;

const PERGUNTAS_SECRETAS = [
  "Nome da sua mãe",
  "Nome da sua cidade natal",
  "Nome do seu primeiro animal de estimação",
  "Nome da sua escola na infância",
  "Apelido de infância",
];

const fmt = (n) => "R$ " + (n || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const todayStr = () => new Date().toISOString().slice(0, 10);
const formatarDataBR = (iso) => iso ? new Date(iso + "T00:00").toLocaleDateString("pt-BR") : "";
const uid = (p = "") => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// Máscara de moeda estilo "centavos para frente" (como apps de banco): o usuário
// digita só números e o valor vai se formatando como R$ 1.234,56 em tempo real.
function centavosParaTexto(centavos) {
  const reais = centavos / 100;
  return reais.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function textoParaCentavos(texto) {
  const digitos = (texto || "").replace(/\D/g, "");
  return digitos ? parseInt(digitos, 10) : 0;
}

// Calcula a meta de vendas automaticamente conforme a categoria do colportor.
// Estudantes/Sonhando Alto: semestralidade do curso escolhido x2.
// Permanentes: valor da tabela por tipo+nível x2.
function calcularMetaEstudante(colegio, curso) {
  if (colegio === COLEGIO_OUTRO) {
    const referencia = SEMESTRALIDADES.find((s) => s.colegio === "Uniaene" && s.curso === "Teologia");
    return referencia ? referencia.valor * 2 : 0;
  }
  const item = SEMESTRALIDADES.find((s) => s.colegio === colegio && s.curso === curso);
  return item ? item.valor * 2 : 0;
}
function calcularMetaPermanente(tipo, nivel, cotaReduzida = false) {
  if (cotaReduzida) return COTA_REDUZIDA_VALOR;
  const valor = META_PERMANENTE[tipo]?.[nivel];
  return valor ? valor * 2 : 0;
}

// Uma campanha está "encerrada" quando a data de hoje já passou do fim dela.
// Ao encerrar, o vínculo do colportor com ela fica inativo: ele não envia mais
// relatórios por ela, mas segue ativo nas demais campanhas em que participa.
function campanhaEncerrada(c) {
  if (!c || !c.fim) return false;
  return todayStr() > c.fim;
}

// Campanha "em vigor": hoje está dentro do período (não é futura nem encerrada).
function campanhaEmVigor(c) {
  if (!c) return false;
  const hoje = todayStr();
  return (!c.inicio || hoje >= c.inicio) && (!c.fim || hoje <= c.fim);
}

// Aniversário hoje? (compara apenas mês-dia)
function ehAniversarioHoje(nascimento) {
  if (!nascimento) return false;
  return nascimento.slice(5) === todayStr().slice(5);
}

// O aniversário cai dentro do período da campanha? (completa ano na campanha)
function aniversarioNaCampanha(nascimento, camp) {
  if (!nascimento || !camp || !camp.inicio || !camp.fim) return false;
  const md = nascimento.slice(5);
  const yIni = +camp.inicio.slice(0, 4), yFim = +camp.fim.slice(0, 4);
  for (let y = yIni; y <= yFim; y++) {
    const d = `${y}-${md}`;
    if (d >= camp.inicio && d <= camp.fim) return true;
  }
  return false;
}

// Idade a partir da data de nascimento (anos completos).
function idade(nascimento) {
  if (!nascimento) return null;
  const hoje = new Date();
  const n = new Date(nascimento + "T00:00");
  let a = hoje.getFullYear() - n.getFullYear();
  const m = hoje.getMonth() - n.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < n.getDate())) a--;
  return a;
}

// Estoque do colportor por título: o que ele RETIROU menos o que já VENDEU nos
// relatórios menos o que DEVOLVEU ao depósito. Tudo derivado em tempo real.
// As devoluções ficam na mesma coleção de movimentos, com tipo "devolucao".
function calcularEstoque(colportorId, retiradas, relatorios) {
  const retirado = {};
  const devolvido = {};
  (retiradas || []).filter((r) => r.colportorId === colportorId).forEach((r) => {
    if (r.tipo === "devolucao") {
      devolvido[r.itemId] = (devolvido[r.itemId] || 0) + (r.qtd || 0);
    } else {
      retirado[r.itemId] = (retirado[r.itemId] || 0) + (r.qtd || 0);
    }
  });
  const vendido = {};
  (relatorios || []).filter((r) => r.colportorId === colportorId).forEach((rel) => {
    (rel.vendas || []).forEach((v) => {
      vendido[v.itemId] = (vendido[v.itemId] || 0) + (v.qtd || 0);
    });
  });
  const itens = {};
  CATALOGO.forEach((item) => {
    const ret = retirado[item.id] || 0;
    const dev = devolvido[item.id] || 0;
    const ven = vendido[item.id] || 0;
    itens[item.id] = { retirado: ret, devolvido: dev, vendido: ven, disponivel: ret - ven - dev };
  });
  return itens;
}

// Soma o estoque de vários colportores (ou de todos) por título. Usado na visão
// do diretor: estoque geral na mão da equipe e visão por colportor.
function calcularEstoqueAgregado(colportorIds, retiradas, relatorios) {
  const idSet = new Set(colportorIds);
  const itens = {};
  CATALOGO.forEach((item) => { itens[item.id] = { retirado: 0, vendido: 0, devolvido: 0, disponivel: 0 }; });
  (retiradas || []).filter((r) => idSet.has(r.colportorId)).forEach((r) => {
    if (!itens[r.itemId]) itens[r.itemId] = { retirado: 0, vendido: 0, devolvido: 0, disponivel: 0 };
    if (r.tipo === "devolucao") itens[r.itemId].devolvido += r.qtd || 0;
    else itens[r.itemId].retirado += r.qtd || 0;
  });
  (relatorios || []).filter((r) => idSet.has(r.colportorId)).forEach((rel) => {
    (rel.vendas || []).forEach((v) => {
      if (!itens[v.itemId]) itens[v.itemId] = { retirado: 0, vendido: 0, devolvido: 0, disponivel: 0 };
      itens[v.itemId].vendido += v.qtd || 0;
    });
  });
  Object.keys(itens).forEach((k) => { itens[k].disponivel = itens[k].retirado - itens[k].vendido - itens[k].devolvido; });
  return itens;
}

// ===== Sistema de bonificação (pontos) =====
const PONTOS = {
  relatorioNoDia: 100,   // relatório enviado no próprio dia
  relatorioAtrasado: 50, // relatório de um dia anterior (lançado depois)
  metaDia: 200,          // bateu/passou a meta do dia
  ofertas10: 100,        // mais de 10 ofertas no dia
  candidato: 100,        // por candidato a estudo (limite 2/dia)
  estoque: 100,          // atualizou o estoque (uma vez)
  bolsa: 1000,           // bateu a bolsa (total vendido >= meta)
  indicacao: 300,        // indicou um possível novo colportor
  aniversario: 300,      // completa ano durante a campanha
};
const PONTOS_POR_REAL = 20; // na loja, R$1 do preço = 20 pontos

function calcularPontos(colp, ctx) {
  const { relatorios = [], candidatos = [], retiradas = [], indicacoes = [], campanhas = [] } = ctx;
  if (!colp) return { total: 0, det: {}, totalVendido: 0 };
  const det = { relatorios: 0, atrasados: 0, metaDia: 0, ofertas: 0, candidatos: 0, estoque: 0, bolsa: 0, indicacoes: 0, aniversario: 0 };

  const camp = campanhas.find((c) => c.id === colp.campanhaId);
  let dias = 1;
  if (camp && camp.inicio && camp.fim) {
    dias = Math.max(1, Math.round((new Date(camp.fim + "T00:00") - new Date(camp.inicio + "T00:00")) / 86400000) + 1);
  }
  const metaDiaria = (colp.meta || 0) > 0 ? colp.meta / dias : 0;

  let totalVendido = 0;
  relatorios.filter((r) => r.colportorId === colp.id && r.confirmado !== false).forEach((r) => {
    const dataSub = (r.criadoEm || "").slice(0, 10);
    if (!dataSub || dataSub === r.data) det.relatorios += PONTOS.relatorioNoDia;
    else det.atrasados += PONTOS.relatorioAtrasado;
    const vendaDia = (r.vendas || []).reduce((s, v) => {
      const it = CATALOGO.find((c) => c.id === v.itemId);
      return s + (it?.preco || 0) * v.qtd;
    }, 0);
    totalVendido += vendaDia;
    if (metaDiaria > 0 && vendaDia >= metaDiaria) det.metaDia += PONTOS.metaDia;
    if ((r.ofertas || 0) > 10) det.ofertas += PONTOS.ofertas10;
  });

  const candPorDia = {};
  candidatos.filter((c) => c.colportorId === colp.id && c.confirmado !== false).forEach((c) => {
    const d = (c.criadoEm || "").slice(0, 10);
    candPorDia[d] = (candPorDia[d] || 0) + 1;
  });
  Object.values(candPorDia).forEach((n) => { det.candidatos += Math.min(n, 2) * PONTOS.candidato; });

  if (retiradas.some((r) => r.colportorId === colp.id && r.tipo !== "devolucao")) det.estoque = PONTOS.estoque;
  det.indicacoes = indicacoes.filter((i) => i.colportorId === colp.id).length * PONTOS.indicacao;
  if ((colp.meta || 0) > 0 && totalVendido >= colp.meta) det.bolsa = PONTOS.bolsa;
  if (colp.nascimento && aniversarioNaCampanha(colp.nascimento, camp)) det.aniversario = PONTOS.aniversario;

  const total = Object.values(det).reduce((s, x) => s + x, 0);
  return { total, det, totalVendido };
}

// Pontos disponíveis = ganhos - já trocados na loja.
function pontosDisponiveis(colp, ctx, resgates) {
  const ganhos = calcularPontos(colp, ctx).total;
  const gastos = (resgates || []).filter((r) => r.colportorId === colp.id).reduce((s, r) => s + (r.pontos || 0), 0);
  return { ganhos, gastos, saldo: ganhos - gastos };
}

/* ============================================================
   STORAGE HELPERS
   ============================================================ */
async function loadShared(key, fallback) {
  try {
    const r = await window.storage.get(key, true);
    return r ? JSON.parse(r.value) : fallback;
  } catch (e) {
    return fallback;
  }
}
async function saveShared(key, value) {
  try {
    await window.storage.set(key, JSON.stringify(value), true);
  } catch (e) {
    console.error("Erro ao salvar", key, e);
  }
}

/* ============================================================
   APP RAIZ
   ============================================================ */
export default function App() {
  const [loading, setLoading] = useState(true);
  const [colportores, setColportores] = useState([]);
  const [relatorios, setRelatorios] = useState([]);
  const [avisos, setAvisos] = useState([]);
  const [semanas, setSemanas] = useState([]);
  const [campanhas, setCampanhas] = useState([]);
  const [lideres, setLideres] = useState([]);
  const [relatoriosLider, setRelatoriosLider] = useState([]);
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [retiradas, setRetiradas] = useState([]);
  const [candidatos, setCandidatos] = useState([]);
  const [mensagens, setMensagens] = useState([]);
  const [indicacoes, setIndicacoes] = useState([]);
  const [resgates, setResgates] = useState([]);

  useEffect(() => {
    if (!document.getElementById("libertadores-fonts")) {
      const link = document.createElement("link");
      link.id = "libertadores-fonts";
      link.rel = "stylesheet";
      link.href = FONT_FACES_URL;
      document.head.appendChild(link);
    }
    if (!document.getElementById("libertadores-anim")) {
      const style = document.createElement("style");
      style.id = "libertadores-anim";
      style.innerHTML = GLOBAL_ANIM_CSS;
      document.head.appendChild(style);
    }
  }, []);
  const [session, setSession] = useState(null); // { role: 'admin'|'lider'|'colportor', id }
  const [view, setView] = useState("login");
  const [toast, setToast] = useState(null);

  useEffect(() => {
    (async () => {
      const c = await loadShared("colportagem:colportores", []);
      const r = await loadShared("colportagem:relatorios", []);
      const a = await loadShared("colportagem:avisos", []);
      const s = await loadShared("colportagem:semanas", []);
      let cp = await loadShared("colportagem:campanhas", []);
      const l = await loadShared("colportagem:lideres", []);
      const rl = await loadShared("colportagem:relatoriosLider", []);
      const sol = await loadShared("colportagem:solicitacoes", []);
      const ret = await loadShared("colportagem:retiradas", []);
      const cand = await loadShared("colportagem:candidatos", []);
      const msgs = await loadShared("colportagem:mensagens", []);
      const inds = await loadShared("colportagem:indicacoes", []);
      const resg = await loadShared("colportagem:resgates", []);
      if (cp.length === 0) {
        cp = CAMPANHAS_INICIAIS;
        await saveShared("colportagem:campanhas", cp);
      }
      // Injeta as campanhas oficiais (resultados do razão) uma única vez.
      const seedAplicado = await loadShared("colportagem:seedOficialV1", false);
      if (!seedAplicado) {
        const idsExistentes = new Set(cp.map((c) => c.id));
        const faltantes = CAMPANHAS_OFICIAIS.filter((c) => !idsExistentes.has(c.id));
        if (faltantes.length > 0) {
          cp = [...cp, ...faltantes];
          await saveShared("colportagem:campanhas", cp);
        }
        await saveShared("colportagem:seedOficialV1", true);
      }
      setColportores(c);
      setRelatorios(r);
      setAvisos(a);
      setSemanas(s);
      setCampanhas(cp);
      setLideres(l);
      setRelatoriosLider(rl);
      setSolicitacoes(sol);
      setRetiradas(ret);
      setCandidatos(cand);
      setMensagens(msgs);
      setIndicacoes(inds);
      setResgates(resg);
      setLoading(false);
    })();
  }, []);

  const showToast = useCallback((msg, type = "ok") => {
    setToast({ msg, type, key: Date.now() });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const persistColportores = useCallback(async (next) => {
    setColportores(next);
    await saveShared("colportagem:colportores", next);
  }, []);
  const persistRelatorios = useCallback(async (next) => {
    setRelatorios(next);
    await saveShared("colportagem:relatorios", next);
  }, []);
  const persistAvisos = useCallback(async (next) => {
    setAvisos(next);
    await saveShared("colportagem:avisos", next);
  }, []);
  const persistSemanas = useCallback(async (next) => {
    setSemanas(next);
    await saveShared("colportagem:semanas", next);
  }, []);
  const persistCampanhas = useCallback(async (next) => {
    setCampanhas(next);
    await saveShared("colportagem:campanhas", next);
  }, []);
  const persistLideres = useCallback(async (next) => {
    setLideres(next);
    await saveShared("colportagem:lideres", next);
  }, []);
  const persistRelatoriosLider = useCallback(async (next) => {
    setRelatoriosLider(next);
    await saveShared("colportagem:relatoriosLider", next);
  }, []);
  const persistSolicitacoes = useCallback(async (next) => {
    setSolicitacoes(next);
    await saveShared("colportagem:solicitacoes", next);
  }, []);
  const persistRetiradas = useCallback(async (next) => {
    setRetiradas(next);
    await saveShared("colportagem:retiradas", next);
  }, []);
  const persistCandidatos = useCallback(async (next) => {
    setCandidatos(next);
    await saveShared("colportagem:candidatos", next);
  }, []);
  const persistMensagens = useCallback(async (next) => {
    setMensagens(next);
    await saveShared("colportagem:mensagens", next);
  }, []);
  const persistIndicacoes = useCallback(async (next) => {
    setIndicacoes(next);
    await saveShared("colportagem:indicacoes", next);
  }, []);
  const persistResgates = useCallback(async (next) => {
    setResgates(next);
    await saveShared("colportagem:resgates", next);
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingScreen}>
        <LogoMark size={72} />
        <div style={{ fontFamily: FONT_SERIF, color: COL.areia, fontSize: 15, letterSpacing: 1 }}>
          Carregando Libertadores...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <LoginScreen
        colportores={colportores}
        setColportores={persistColportores}
        lideres={lideres}
        setLideres={persistLideres}
        campanhas={campanhas}
        onLogin={(s) => { setSession(s); setView(s.role === "admin" ? "admin-painel" : s.role === "lider" ? "lider-painel" : "col-painel"); }}
        showToast={showToast}
        toast={toast}
      />
    );
  }

  if (session.role === "admin") {
    return (
      <AdminApp
        colportores={colportores} setColportores={persistColportores}
        relatorios={relatorios} setRelatorios={persistRelatorios}
        avisos={avisos} setAvisos={persistAvisos}
        semanas={semanas} setSemanas={persistSemanas}
        campanhas={campanhas} setCampanhas={persistCampanhas}
        lideres={lideres} setLideres={persistLideres}
        relatoriosLider={relatoriosLider}
        solicitacoes={solicitacoes} setSolicitacoes={persistSolicitacoes}
        retiradas={retiradas}
        candidatos={candidatos} setCandidatos={persistCandidatos}
        mensagens={mensagens} setMensagens={persistMensagens}
        indicacoes={indicacoes} setIndicacoes={persistIndicacoes}
        resgates={resgates} setResgates={persistResgates}
        onLogout={() => { setSession(null); setView("login"); }}
        showToast={showToast} toast={toast}
        view={view} setView={setView}
      />
    );
  }

  if (session.role === "lider") {
    const meuLider = lideres.find((l) => l.id === session.id);
    if (!meuLider) {
      return (
        <LoginScreen colportores={colportores} setColportores={persistColportores} lideres={lideres} setLideres={persistLideres} campanhas={campanhas} onLogin={(s) => { setSession(s); setView("lider-painel"); }} showToast={showToast} toast={toast} />
      );
    }
    return (
      <LiderApp
        meuLider={meuLider}
        colportores={colportores} setColportores={persistColportores}
        relatorios={relatorios} setRelatorios={persistRelatorios}
        candidatos={candidatos} setCandidatos={persistCandidatos}
        relatoriosLider={relatoriosLider} setRelatoriosLider={persistRelatoriosLider}
        campanhas={campanhas}
        onLogout={() => { setSession(null); setView("login"); }}
        showToast={showToast} toast={toast}
      />
    );
  }

  const me = colportores.find((c) => c.id === session.id);
  if (!me) {
    return (
      <LoginScreen colportores={colportores} setColportores={persistColportores} lideres={lideres} setLideres={persistLideres} campanhas={campanhas} onLogin={(s) => { setSession(s); setView("col-painel"); }} showToast={showToast} toast={toast} />
    );
  }

  return (
    <ColportorApp
      me={me} colportores={colportores}
      relatorios={relatorios} setRelatorios={persistRelatorios}
      avisos={avisos}
      semanas={semanas}
      campanhas={campanhas}
      lideres={lideres}
      relatoriosLider={relatoriosLider} setRelatoriosLider={persistRelatoriosLider}
      solicitacoes={solicitacoes} setSolicitacoes={persistSolicitacoes}
      retiradas={retiradas} setRetiradas={persistRetiradas}
      candidatos={candidatos} setCandidatos={persistCandidatos}
      mensagens={mensagens} setMensagens={persistMensagens}
      indicacoes={indicacoes} setIndicacoes={persistIndicacoes}
      resgates={resgates} setResgates={persistResgates}
      onLogout={() => { setSession(null); setView("login"); }}
      showToast={showToast} toast={toast}
    />
  );
}

/* ============================================================
   DESIGN TOKENS
   ============================================================ */
const COL = {
  petroleo: "#1A1714",        // preto quente do logo — usado como "escuro institucional"
  petroleoEscuro: "#0E0C0A",  // preto profundo do fundo do logo
  terracota: "#D9650F",       // laranja vibrante do círculo do logo
  terracotaClaro: "#F0922E",  // variação clara do laranja para destaques
  anelTerracota: "#A8431A",   // anel terracota entre o preto e o laranja do logo
  areia: "#FBF3E7",           // fundo claro neutro (não compete com o laranja)
  areiaEscura: "#EADCC6",
  oliva: "#5C7A52",
  grafite: "#241F1A",
  vermelho: "#A8423A",
  branco: "#FFFFFF",
};
const FONT_SERIF = "'Fraunces', 'Source Serif Pro', Georgia, serif";
const FONT_SANS = "'Manrope', 'Inter', -apple-system, sans-serif";
const FONT_FACES_URL = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..900&family=Manrope:wght@500;600;700;800&display=swap";

const GLOBAL_ANIM_CSS = `
@keyframes slideUp { from { opacity:0; transform: translate(-50%, 12px); } to { opacity:1; transform: translate(-50%, 0); } }
@keyframes fadeRise { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: translateY(0); } }
@keyframes popIn { from { opacity:0; transform: scale(0.92); } to { opacity:1; transform: scale(1); } }
@keyframes logoSpinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(217,101,15,0.45); }
  50% { box-shadow: 0 0 0 10px rgba(217,101,15,0); }
}
@keyframes shimmerBar {
  0% { background-position: -200px 0; }
  100% { background-position: 200px 0; }
}
@keyframes floatLogo {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-5px) rotate(-2deg); }
}
.lib-fade-in { animation: fadeRise 0.45s cubic-bezier(.22,1,.36,1) backwards; }
.lib-pop-in { animation: popIn 0.3s cubic-bezier(.22,1,.36,1) backwards; }
.lib-card-hover { transition: transform 0.18s ease, box-shadow 0.18s ease; }
.lib-card-hover:active { transform: scale(0.98); }
.lib-btn { transition: transform 0.12s ease, filter 0.12s ease, box-shadow 0.12s ease; }
.lib-btn:active { transform: scale(0.97); filter: brightness(0.95); }
.lib-tab-btn { transition: all 0.18s ease; }
.lib-progress-fill { transition: width 0.7s cubic-bezier(.22,1,.36,1); position: relative; overflow: hidden; }
.lib-progress-fill.shimmer::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
  background-size: 200px 100%; animation: shimmerBar 1.8s linear infinite;
}
.lib-rank-row { transition: transform 0.15s ease, background 0.15s ease; }
.lib-rank-row:active { transform: scale(0.99); }
input:focus, select:focus, textarea:focus { border-color: #D9650F !important; box-shadow: 0 0 0 3px rgba(217,101,15,0.14); }
* { scrollbar-width: thin; }
@media (prefers-reduced-motion: reduce) {
  .lib-fade-in, .lib-pop-in, .lib-progress-fill.shimmer::after { animation: none !important; }
}
`;

/* Logo Libertadores recriado em SVG (fiel ao logo enviado: anel preto > anel
   terracota > disco laranja > ícone de livro estilizado em preto) */
const LOGO_DATA_URI = "data:image/jpeg;base64,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";

function LogoMark({ size = 64 }) {
  return (
    <img
      src={LOGO_DATA_URI}
      alt="Libertadores"
      width={size}
      height={size}
      style={{ display: "block", borderRadius: "50%", objectFit: "cover" }}
    />
  );
}

const styles = {
  loadingScreen: {
    minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", gap: 16, background: `linear-gradient(160deg, ${COL.petroleoEscuro} 0%, ${COL.petroleo} 100%)`,
  },
};

/* ============================================================
   COMPONENTE: TOAST
   ============================================================ */
function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div key={toast.key} style={{
      position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
      background: toast.type === "error" ? COL.vermelho : COL.petroleoEscuro,
      color: COL.areia, padding: "12px 20px", borderRadius: 10, fontFamily: FONT_SANS,
      fontSize: 14, zIndex: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      display: "flex", alignItems: "center", gap: 8, maxWidth: "90vw",
      animation: "slideUp 0.25s ease",
    }}>
      {toast.type === "error" ? <X size={16} /> : <Check size={16} />}
      {toast.msg}
    </div>
  );
}

/* ============================================================
   TELA DE LOGIN
   ============================================================ */
const DIRETOR_NOME = "Suevanio Vieira de Luna";
const DIRETOR_TELEFONE = "81979000058";
const DIRETOR_SENHA = "2012";

function LoginScreen({ colportores, setColportores, lideres, setLideres, campanhas, onLogin, showToast, toast }) {
  const [mode, setMode] = useState("entrar"); // entrar | cadastro | recuperar
  const [tel, setTel] = useState("");
  const [senha, setSenha] = useState("");
  const [escolhaVinculos, setEscolhaVinculos] = useState(null); // vínculos p/ escolher no login

  // cadastro — etapas: dados -> verificação de telefone -> concluído
  const [passo, setPasso] = useState("dados"); // dados | verificar
  const [cFuncao, setCFuncao] = useState("colportor"); // colportor | lider
  const [cNome, setCNome] = useState("");
  const [cTel, setCTel] = useState("");
  const [cSenha, setCSenha] = useState("");
  const [cSenha2, setCSenha2] = useState("");
  const [cSegmento, setCSegmento] = useState(SEGMENTOS[0]);
  const [cNascimento, setCNascimento] = useState("");
  // tipoCadastro: "campanha" (Estudantes/Sonhando Alto, via campanha) ou "permanente"
  const [cTipoCadastro, setCTipoCadastro] = useState("campanha");
  const [cCampanhaId, setCCampanhaId] = useState("");
  // meta automática — Estudantes/Sonhando Alto: colégio + curso
  const [cColegio, setCColegio] = useState(COLEGIOS[0]);
  const [cCurso, setCCurso] = useState(SEMESTRALIDADES.find((s) => s.colegio === COLEGIOS[0])?.curso || "");
  // meta automática — Permanentes: tipo + nível
  const [cTipoPermanente, setCTipoPermanente] = useState(TIPOS_PERMANENTE[0]);
  const [cNivelPermanente, setCNivelPermanente] = useState(NIVEIS_PERMANENTE[0]);
  const [cCotaReduzida, setCCotaReduzida] = useState(false);
  const [cPergunta, setCPergunta] = useState(PERGUNTAS_SECRETAS[0]);
  const [cResposta, setCResposta] = useState("");

  const campanhaSelecionada = campanhas.find((c) => c.id === cCampanhaId);
  const cCategoria = cTipoCadastro === "permanente" ? "Permanentes" : (campanhaSelecionada?.categoria || "Estudantes");
  const cursosDoColegio = SEMESTRALIDADES.filter((s) => s.colegio === cColegio);
  const cMetaCalculada = cCategoria === "Permanentes"
    ? calcularMetaPermanente(cTipoPermanente, cNivelPermanente, cNivelPermanente === "Credenciado" && cCotaReduzida)
    : calcularMetaEstudante(cColegio, cCurso);

  useEffect(() => {
    if (cursosDoColegio.length > 0 && !cursosDoColegio.some((c) => c.curso === cCurso)) {
      setCCurso(cursosDoColegio[0].curso);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cColegio]);

  // recuperação de senha — etapas: telefone -> pergunta -> nova senha
  const [recPasso, setRecPasso] = useState("telefone"); // telefone | pergunta | nova
  const [recTel, setRecTel] = useState("");
  const [recResposta, setRecResposta] = useState("");
  const [recNovaSenha, setRecNovaSenha] = useState("");
  const [recNovaSenha2, setRecNovaSenha2] = useState("");

  function entrar() {
    const limpo = tel.replace(/\D/g, "");
    if (!limpo || !senha) {
      showToast("Preencha telefone e senha.", "error");
      return;
    }

    // Diretor entra pelo mesmo formulário, identificado por telefone + senha fixos
    if (limpo === DIRETOR_TELEFONE && senha === DIRETOR_SENHA) {
      onLogin({ role: "admin", id: "admin" });
      return;
    }

    // Uma mesma pessoa (mesmo telefone) pode ter vários vínculos: colportor em
    // campanhas diferentes e/ou líder de uma campanha. Reunimos todos eles.
    const lideresPessoa = lideres.filter((l) => l.telefone.replace(/\D/g, "") === limpo);
    const colportoresPessoa = colportores.filter((c) => c.telefone.replace(/\D/g, "") === limpo);

    if (lideresPessoa.length === 0 && colportoresPessoa.length === 0) {
      showToast("Número não cadastrado.", "error");
      return;
    }

    const todosVinculos = [...lideresPessoa, ...colportoresPessoa];
    if (!todosVinculos.some((x) => x.senha === senha)) {
      showToast("Senha incorreta.", "error");
      return;
    }

    // Monta os vínculos que podem acessar agora (aprovados). Campanha encerrada
    // ainda entra, mas em modo somente leitura (sem envio de relatório).
    const opcoes = [];
    lideresPessoa.forEach((l) => {
      if (l.senha !== senha || l.status === "pendente" || l.status === "rejeitado") return;
      const camp = campanhas.find((c) => c.id === l.campanhaId);
      opcoes.push({ role: "lider", id: l.id, titulo: "Líder", sub: camp ? camp.nome : l.categoria, encerrada: campanhaEncerrada(camp) });
    });
    colportoresPessoa.forEach((c) => {
      if (c.senha !== senha || c.status === "pendente" || c.status === "rejeitado") return;
      const camp = campanhas.find((x) => x.id === c.campanhaId);
      opcoes.push({ role: "colportor", id: c.id, titulo: "Colportor", sub: camp ? camp.nome : c.categoria, encerrada: campanhaEncerrada(camp) });
    });

    if (opcoes.length === 0) {
      if (todosVinculos.some((x) => x.status === "pendente")) {
        showToast("Seu cadastro ainda está em análise pelo diretor.", "error");
      } else {
        showToast("Seu cadastro não foi aprovado. Fale com o diretor.", "error");
      }
      return;
    }

    if (opcoes.length === 1) {
      onLogin({ role: opcoes[0].role, id: opcoes[0].id });
      return;
    }

    // Mais de um vínculo ativo → a pessoa escolhe por qual quer entrar.
    setEscolhaVinculos(opcoes);
  }

  async function enviarCadastro() {
    if (!cNome.trim() || !cTel.trim() || !cSenha) {
      showToast("Preencha todos os campos para se cadastrar.", "error");
      return;
    }
    if (cSenha.length < 4) {
      showToast("A senha precisa ter pelo menos 4 caracteres.", "error");
      return;
    }
    if (cSenha !== cSenha2) {
      showToast("As senhas não coincidem.", "error");
      return;
    }
    if (!cResposta.trim()) {
      showToast("Responda a pergunta de segurança. Ela será usada se você esquecer a senha.", "error");
      return;
    }
    if (!cNascimento) {
      showToast("Informe sua data de nascimento.", "error");
      return;
    }
    const limpo = cTel.replace(/\D/g, "");
    if (limpo.length < 10) {
      showToast("Digite um telefone válido com DDD.", "error");
      return;
    }
    if (limpo === DIRETOR_TELEFONE) {
      showToast("Esse telefone já está em uso. Faça login.", "error");
      return;
    }
    if (colportores.some((c) => c.telefone.replace(/\D/g, "") === limpo)) {
      showToast("Esse telefone já tem cadastro. Faça login.", "error");
      return;
    }
    if (lideres.some((l) => l.telefone.replace(/\D/g, "") === limpo)) {
      showToast("Esse telefone já tem cadastro. Faça login.", "error");
      return;
    }

    if (cTipoCadastro === "campanha") {
      if (!cCampanhaId) {
        showToast("Selecione a campanha que você vai participar.", "error");
        return;
      }
      if (!cCurso && cColegio !== COLEGIO_OUTRO) {
        showToast("Selecione o colégio e o curso para calcular sua meta.", "error");
        return;
      }
    }
    if (!cMetaCalculada) {
      showToast("Não foi possível calcular a meta. Confira as opções selecionadas.", "error");
      return;
    }

    if (cFuncao === "lider") {
      const novoLider = {
        id: uid("lid"), nome: cNome.trim(), telefone: cTel.trim(), senha: cSenha,
        nascimento: cNascimento || null,
        categoria: cCategoria, meta: cMetaCalculada,
        ...(cCategoria === "Permanentes"
          ? { tipoPermanente: cTipoPermanente, nivelPermanente: cNivelPermanente, cotaReduzida: cNivelPermanente === "Credenciado" ? cCotaReduzida : false }
          : { campanhaId: cCampanhaId, colegio: cColegio, curso: cCurso }),
        pergunta: cPergunta, resposta: cResposta.trim().toLowerCase(),
        status: "pendente",
        solicitadoEm: new Date().toISOString(),
      };
      await setLideres([...lideres, novoLider]);
      setPasso("enviado");
      return;
    }

    const novo = {
      id: uid("col"), nome: cNome.trim(), telefone: cTel.trim(), senha: cSenha,
      nascimento: cNascimento || null,
      segmento: cSegmento, categoria: cCategoria, meta: cMetaCalculada,
      ...(cCategoria === "Permanentes"
        ? { tipoPermanente: cTipoPermanente, nivelPermanente: cNivelPermanente, cotaReduzida: cNivelPermanente === "Credenciado" ? cCotaReduzida : false }
        : { campanhaId: cCampanhaId, colegio: cColegio, curso: cCurso }),
      pergunta: cPergunta, resposta: cResposta.trim().toLowerCase(),
      status: "pendente",
      solicitadoEm: new Date().toISOString(),
    };
    await setColportores([...colportores, novo]);
    setPasso("enviado");
  }

  function reiniciarCadastro() {
    setPasso("dados");
    setCFuncao("colportor");
    setCNome(""); setCTel(""); setCSenha(""); setCSenha2("");
    setCSegmento(SEGMENTOS[0]); setCNascimento("");
    setCTipoCadastro("campanha"); setCCampanhaId("");
    setCColegio(COLEGIOS[0]); setCCurso(SEMESTRALIDADES.find((s) => s.colegio === COLEGIOS[0])?.curso || "");
    setCTipoPermanente(TIPOS_PERMANENTE[0]); setCNivelPermanente(NIVEIS_PERMANENTE[0]); setCCotaReduzida(false);
    setCPergunta(PERGUNTAS_SECRETAS[0]); setCResposta("");
  }

  function reiniciarRecuperacao() {
    setRecPasso("telefone");
    setRecTel(""); setRecResposta("");
    setRecNovaSenha(""); setRecNovaSenha2("");
  }

  function trocarModo(novoModo) {
    setMode(novoModo);
    if (novoModo === "entrar") { reiniciarCadastro(); reiniciarRecuperacao(); }
  }

  function buscarPorTelefone(limpo) {
    const col = colportores.find((c) => c.telefone.replace(/\D/g, "") === limpo);
    if (col) return { pessoa: col, tipo: "colportor" };
    const lid = lideres.find((l) => l.telefone.replace(/\D/g, "") === limpo);
    if (lid) return { pessoa: lid, tipo: "lider" };
    return null;
  }

  function irParaPergunta() {
    const limpo = recTel.replace(/\D/g, "");
    if (!limpo) {
      showToast("Digite o telefone cadastrado.", "error");
      return;
    }
    const achado = buscarPorTelefone(limpo);
    if (!achado) {
      showToast("Telefone não encontrado.", "error");
      return;
    }
    if (!achado.pessoa.pergunta || !achado.pessoa.resposta) {
      showToast("Esse cadastro não tem pergunta de segurança. Fale com o diretor.", "error");
      return;
    }
    setRecResposta("");
    setRecPasso("pergunta");
  }

  function confirmarRespostaSecreta() {
    const limpo = recTel.replace(/\D/g, "");
    const achado = buscarPorTelefone(limpo);
    if (!achado) {
      showToast("Não foi possível localizar o cadastro.", "error");
      setRecPasso("telefone");
      return;
    }
    if (recResposta.trim().toLowerCase() !== achado.pessoa.resposta) {
      showToast("Resposta incorreta. Tente novamente.", "error");
      return;
    }
    setRecPasso("nova");
  }

  async function salvarNovaSenha() {
    if (!recNovaSenha || recNovaSenha.length < 4) {
      showToast("A nova senha precisa ter pelo menos 4 caracteres.", "error");
      return;
    }
    if (recNovaSenha !== recNovaSenha2) {
      showToast("As senhas não coincidem.", "error");
      return;
    }
    const limpo = recTel.replace(/\D/g, "");
    const achado = buscarPorTelefone(limpo);
    if (!achado) {
      showToast("Não foi possível localizar o cadastro.", "error");
      setMode("entrar"); reiniciarRecuperacao();
      return;
    }
    if (achado.tipo === "lider") {
      await setLideres(lideres.map((l) => l.id === achado.pessoa.id ? { ...l, senha: recNovaSenha } : l));
    } else {
      await setColportores(colportores.map((c) => c.id === achado.pessoa.id ? { ...c, senha: recNovaSenha } : c));
    }
    showToast("Senha alterada! Faça login com a nova senha.");
    setMode("entrar");
    reiniciarRecuperacao();
    setTel(achado.pessoa.telefone);
    setSenha("");
  }

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(160deg, ${COL.petroleo} 0%, ${COL.petroleoEscuro} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: FONT_SANS, position: "relative", overflow: "hidden",
    }}>
      <Toast toast={toast} />
      {escolhaVinculos && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(14,12,10,0.78)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 20 }}>
          <div style={{ background: COL.branco, borderRadius: 18, padding: 24, width: "100%", maxWidth: 380 }} className="lib-pop-in">
            <h3 style={{ fontFamily: FONT_SERIF, color: COL.petroleo, margin: "0 0 6px", fontSize: 21, fontWeight: 800 }}>Como deseja entrar?</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#8A8478", lineHeight: 1.5 }}>Você participa de mais de uma frente. Escolha por qual quer acessar agora.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {escolhaVinculos.map((o, i) => (
                <button key={i} onClick={() => { setEscolhaVinculos(null); onLogin({ role: o.role, id: o.id }); }} className="lib-btn" style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                  padding: "13px 16px", borderRadius: 12, border: `1.5px solid ${COL.areiaEscura}`,
                  background: COL.areia, cursor: "pointer", textAlign: "left",
                }}>
                  <span>
                    <span style={{ display: "block", fontWeight: 800, color: COL.grafite, fontSize: 14.5 }}>{o.titulo}</span>
                    <span style={{ display: "block", fontSize: 12.5, color: "#8A8478", marginTop: 2 }}>
                      {o.sub}{o.encerrada ? " · encerrada (só leitura)" : ""}
                    </span>
                  </span>
                  <ChevronRight size={18} color={COL.terracota} />
                </button>
              ))}
            </div>
            <button onClick={() => setEscolhaVinculos(null)} style={{ marginTop: 14, width: "100%", background: "none", border: "none", color: "#8A8478", fontSize: 13, cursor: "pointer", fontWeight: 600 }}>Cancelar</button>
          </div>
        </div>
      )}
      <div style={{
        position: "absolute", top: -120, right: -120, width: 320, height: 320,
        borderRadius: "50%", background: `radial-gradient(circle, ${COL.terracota}22, transparent 70%)`,
      }} />
      <div style={{
        position: "absolute", bottom: -100, left: -100, width: 280, height: 280,
        borderRadius: "50%", background: `radial-gradient(circle, ${COL.anelTerracota}1A, transparent 70%)`,
      }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 400 }}>
        <div className="lib-fade-in" style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            margin: "0 auto 18px", width: 76,
            filter: "drop-shadow(0 14px 26px rgba(217,101,15,0.45))",
            animation: "floatLogo 4.5s ease-in-out infinite",
          }}>
            <LogoMark size={76} />
          </div>
          <h1 style={{
            fontFamily: FONT_SERIF, color: COL.areia, fontSize: 36, margin: 0,
            letterSpacing: 0.2, fontWeight: 900, fontOpticalSizing: "auto",
          }}>
            Libertadores
          </h1>
          <p style={{ color: COL.terracotaClaro, fontSize: 12.5, marginTop: 8, letterSpacing: 2.5, textTransform: "uppercase", fontWeight: 700 }}>
            Equipe de Colportagem
          </p>
        </div>

        <div className="lib-pop-in" style={{ background: COL.areia, borderRadius: 18, padding: 26, boxShadow: "0 20px 50px rgba(0,0,0,0.5)", maxHeight: "78vh", overflowY: "auto" }}>
          {mode === "entrar" && (
            <>
              <label style={lbl}>Telefone</label>
              <input
                value={tel} onChange={(e) => setTel(e.target.value)}
                placeholder="(00) 00000-0000" style={inp}
              />
              <label style={lbl}>Senha</label>
              <input
                type="password" value={senha} onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••" style={inp}
                onKeyDown={(e) => e.key === "Enter" && entrar()}
              />
              <button onClick={entrar} className="lib-btn" style={btnPrimary}>
                Entrar <ChevronRight size={16} />
              </button>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                <button onClick={() => trocarModo("recuperar")} className="lib-btn" style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "#8A8478", fontWeight: 700, fontSize: 12.5, padding: "4px 0",
                }}>
                  Esqueci minha senha
                </button>
                <button onClick={() => trocarModo("cadastro")} className="lib-btn" style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: COL.terracota, fontWeight: 700, fontSize: 13.5, padding: "4px 0",
                }}>
                  Cadastre-se
                </button>
              </div>
            </>
          )}

          {mode === "recuperar" && recPasso === "telefone" && (
            <div className="lib-fade-in">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <button onClick={() => trocarModo("entrar")} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8478", display: "flex", padding: 4 }}>
                  <ArrowLeft size={18} />
                </button>
                <h3 style={{ fontFamily: FONT_SERIF, color: COL.petroleo, margin: 0, fontSize: 18, fontWeight: 800 }}>Recuperar senha</h3>
              </div>
              <p style={{ fontSize: 13, color: "#8A8478", margin: "0 0 16px", lineHeight: 1.5 }}>
                Informe o telefone cadastrado. Você vai responder sua pergunta de segurança para criar uma nova senha.
              </p>
              <label style={lbl}>Telefone</label>
              <input
                value={recTel} onChange={(e) => setRecTel(e.target.value)} style={inp}
                placeholder="(00) 00000-0000"
                onKeyDown={(e) => e.key === "Enter" && irParaPergunta()}
              />
              <button onClick={irParaPergunta} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota }}>
                Continuar <ChevronRight size={16} />
              </button>
            </div>
          )}

          {mode === "recuperar" && recPasso === "pergunta" && (() => {
            const limpo = recTel.replace(/\D/g, "");
            const achado = buscarPorTelefone(limpo);
            const found = achado?.pessoa;
            return (
              <div className="lib-fade-in">
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <button onClick={() => setRecPasso("telefone")} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8478", display: "flex", padding: 4 }}>
                    <ArrowLeft size={18} />
                  </button>
                  <h3 style={{ fontFamily: FONT_SERIF, color: COL.petroleo, margin: 0, fontSize: 18, fontWeight: 800 }}>Pergunta de segurança</h3>
                </div>

                <div style={{ background: `${COL.terracota}14`, border: `1.5px dashed ${COL.terracota}`, borderRadius: 12, padding: "14px 16px", marginBottom: 18 }}>
                  <p style={{ margin: 0, fontSize: 12.5, color: "#8A8478" }}>Responda a pergunta que você cadastrou:</p>
                  <p style={{ margin: "6px 0 0", fontWeight: 800, color: COL.petroleo, fontSize: 15.5 }}>{found?.pergunta || "Pergunta não encontrada"}</p>
                </div>

                <label style={lbl}>Sua resposta</label>
                <input
                  value={recResposta} onChange={(e) => setRecResposta(e.target.value)} style={inp}
                  placeholder="Digite a resposta"
                  onKeyDown={(e) => e.key === "Enter" && confirmarRespostaSecreta()}
                />
                <button onClick={confirmarRespostaSecreta} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota }}>
                  Confirmar resposta <ChevronRight size={16} />
                </button>
              </div>
            );
          })()}

          {mode === "recuperar" && recPasso === "nova" && (
            <div className="lib-fade-in">
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <button onClick={() => setRecPasso("pergunta")} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8478", display: "flex", padding: 4 }}>
                  <ArrowLeft size={18} />
                </button>
                <h3 style={{ fontFamily: FONT_SERIF, color: COL.petroleo, margin: 0, fontSize: 18, fontWeight: 800 }}>Crie uma nova senha</h3>
              </div>

              <label style={lbl}>Nova senha</label>
              <input
                type="password" value={recNovaSenha} onChange={(e) => setRecNovaSenha(e.target.value)} style={inp}
                placeholder="Mínimo 4 caracteres"
              />
              <label style={lbl}>Confirme a nova senha</label>
              <input
                type="password" value={recNovaSenha2} onChange={(e) => setRecNovaSenha2(e.target.value)} style={inp}
                placeholder="Repita a senha"
                onKeyDown={(e) => e.key === "Enter" && salvarNovaSenha()}
              />
              <button onClick={salvarNovaSenha} className="lib-btn" style={{ ...btnPrimary, background: COL.oliva }}>
                <Check size={16} /> Salvar nova senha
              </button>
            </div>
          )}

          {mode === "cadastro" && passo === "dados" && (
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <button onClick={() => trocarModo("entrar")} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8478", display: "flex", padding: 4 }}>
                  <ArrowLeft size={18} />
                </button>
                <h3 style={{ fontFamily: FONT_SERIF, color: COL.petroleo, margin: 0, fontSize: 18, fontWeight: 800 }}>Criar minha conta</h3>
              </div>

              <label style={lbl}>Você é</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                {[
                  { id: "colportor", label: "Colportor" },
                  { id: "lider", label: "Líder" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCFuncao(opt.id)}
                    className="lib-btn"
                    style={{
                      flex: 1, padding: "11px 6px", borderRadius: 10, border: `1.5px solid ${cFuncao === opt.id ? COL.terracota : COL.areiaEscura}`,
                      cursor: "pointer", background: cFuncao === opt.id ? `${COL.terracota}14` : COL.branco,
                      color: cFuncao === opt.id ? COL.terracota : COL.grafite, fontWeight: 700, fontSize: 12.5,
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <label style={lbl}>Nome completo</label>
              <input value={cNome} onChange={(e) => setCNome(e.target.value)} style={inp} placeholder="Ex.: João da Silva Santos" />

              <label style={lbl}>Telefone</label>
              <input value={cTel} onChange={(e) => setCTel(e.target.value)} style={inp} placeholder="(00) 00000-0000" />

              <label style={lbl}>Data de nascimento</label>
              <input type="date" value={cNascimento} max={todayStr()} onChange={(e) => setCNascimento(e.target.value)} style={inp} />

              <label style={lbl}>Crie uma senha</label>
              <input type="password" value={cSenha} onChange={(e) => setCSenha(e.target.value)} style={inp} placeholder="Mínimo 4 caracteres" />

              <label style={lbl}>Confirme a senha</label>
              <input type="password" value={cSenha2} onChange={(e) => setCSenha2(e.target.value)} style={inp} placeholder="Repita a senha" />

              <label style={lbl}>Pergunta de segurança</label>
              <select value={cPergunta} onChange={(e) => setCPergunta(e.target.value)} style={inp}>
                {PERGUNTAS_SECRETAS.map((p) => <option key={p}>{p}</option>)}
              </select>

              <label style={lbl}>Resposta (use para recuperar sua senha depois)</label>
              <input value={cResposta} onChange={(e) => setCResposta(e.target.value)} style={inp} placeholder="Digite sua resposta" />

              {cFuncao === "lider" ? (
                <>
                  <p style={{ fontSize: 12, color: "#8A8478", margin: "0 0 12px", lineHeight: 1.5 }}>
                    Sua meta é só de acompanhamento — não soma com a meta dos colportores que você vai assistir.
                  </p>

                  <label style={lbl}>Você vai liderar como</label>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    {[
                      { id: "campanha", label: "Estudante / Sonhando Alto" },
                      { id: "permanente", label: "Permanente" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setCTipoCadastro(opt.id)}
                        className="lib-btn"
                        style={{
                          flex: 1, padding: "11px 6px", borderRadius: 10, border: `1.5px solid ${cTipoCadastro === opt.id ? COL.terracota : COL.areiaEscura}`,
                          cursor: "pointer", background: cTipoCadastro === opt.id ? `${COL.terracota}14` : COL.branco,
                          color: cTipoCadastro === opt.id ? COL.terracota : COL.grafite, fontWeight: 700, fontSize: 12.5,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {cTipoCadastro === "permanente" ? (
                    <>
                      <label style={lbl}>Tipo</label>
                      <select value={cTipoPermanente} onChange={(e) => setCTipoPermanente(e.target.value)} style={inp}>
                        {TIPOS_PERMANENTE.map((t) => <option key={t}>{t}</option>)}
                      </select>

                      <label style={lbl}>Categoria de colportor</label>
                      <select value={cNivelPermanente} onChange={(e) => setCNivelPermanente(e.target.value)} style={inp}>
                        {NIVEIS_PERMANENTE.map((n) => <option key={n}>{n}</option>)}
                      </select>

                      {cNivelPermanente === "Credenciado" && (
                        <>
                          <label style={lbl}>Você tem cota reduzida?</label>
                          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                            {[{ id: false, label: "Não" }, { id: true, label: "Sim" }].map((opt) => (
                              <button
                                key={String(opt.id)}
                                onClick={() => setCCotaReduzida(opt.id)}
                                className="lib-btn"
                                style={{
                                  flex: 1, padding: "11px 6px", borderRadius: 10, border: `1.5px solid ${cCotaReduzida === opt.id ? COL.terracota : COL.areiaEscura}`,
                                  cursor: "pointer", background: cCotaReduzida === opt.id ? `${COL.terracota}14` : COL.branco,
                                  color: cCotaReduzida === opt.id ? COL.terracota : COL.grafite, fontWeight: 700, fontSize: 12.5,
                                }}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          {cCotaReduzida && (
                            <p style={{ fontSize: 11.5, color: COL.oliva, background: `${COL.oliva}10`, border: `1px dashed ${COL.oliva}`, borderRadius: 10, padding: "9px 12px", marginBottom: 16, lineHeight: 1.5 }}>
                              Cota reduzida aplicada — exceção para colportor Credenciado com mais de 25 anos na função.
                            </p>
                          )}
                        </>
                      )}
                    </>
                  ) : campanhas.length === 0 ? (
                    <p style={{ fontSize: 12.5, color: COL.vermelho, background: `${COL.vermelho}10`, border: `1px dashed ${COL.vermelho}`, borderRadius: 10, padding: "10px 12px", marginBottom: 16, lineHeight: 1.5 }}>
                      Nenhuma campanha aberta no momento. Fale com o diretor ou escolha "Permanente".
                    </p>
                  ) : (
                    <>
                      <label style={lbl}>Campanha</label>
                      <select value={cCampanhaId} onChange={(e) => setCCampanhaId(e.target.value)} style={inp}>
                        <option value="">Selecione a campanha</option>
                        {campanhas.filter((c) => c.categoria !== "Permanentes" && campanhaEmVigor(c)).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome} · {c.categoria} ({formatarDataBR(c.inicio)} a {formatarDataBR(c.fim)})
                          </option>
                        ))}
                      </select>

                      <label style={lbl}>Colégio</label>
                      <select value={cColegio} onChange={(e) => setCColegio(e.target.value)} style={inp}>
                        {COLEGIOS.map((c) => <option key={c}>{c}</option>)}
                      </select>

                      {cColegio === COLEGIO_OUTRO ? (
                        <p style={{ fontSize: 11.5, color: "#8A8478", background: COL.areia, border: `1px dashed ${COL.areiaEscura}`, borderRadius: 10, padding: "9px 12px", marginBottom: 16, lineHeight: 1.4 }}>
                          Sem colégio na lista? Sem problema — sua meta vai usar o valor de referência de Teologia (Uniaene).
                        </p>
                      ) : (
                        <>
                          <label style={lbl}>Curso</label>
                          <select value={cCurso} onChange={(e) => setCCurso(e.target.value)} style={inp}>
                            {cursosDoColegio.map((c) => <option key={c.curso} value={c.curso}>{c.curso}</option>)}
                          </select>
                        </>
                      )}
                    </>
                  )}

                  <div style={{
                    background: `${COL.oliva}14`, border: `1.5px solid ${COL.oliva}`, borderRadius: 12,
                    padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontSize: 12.5, color: "#5C6B57", fontWeight: 700 }}>Sua meta (acompanhamento)</span>
                    <span style={{ fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 19, color: COL.oliva }}>{fmt(cMetaCalculada)}</span>
                  </div>

                  <button onClick={enviarCadastro} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota }}>
                    Enviar cadastro <ChevronRight size={16} />
                  </button>
                  <p style={{ fontSize: 11.5, color: "#8A8478", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                    Seu cadastro será analisado pelo diretor antes de liberar o acesso.
                  </p>
                </>
              ) : (
                <>
                  <label style={lbl}>Segmento de atuação</label>
                  <select value={cSegmento} onChange={(e) => setCSegmento(e.target.value)} style={inp}>
                    {SEGMENTOS.map((s) => <option key={s}>{s}</option>)}
                  </select>

                  <label style={lbl}>Você vai colportar como</label>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    {[
                      { id: "campanha", label: "Estudante / Sonhando Alto" },
                      { id: "permanente", label: "Permanente" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setCTipoCadastro(opt.id)}
                        className="lib-btn"
                        style={{
                          flex: 1, padding: "11px 6px", borderRadius: 10, border: `1.5px solid ${cTipoCadastro === opt.id ? COL.terracota : COL.areiaEscura}`,
                          cursor: "pointer", background: cTipoCadastro === opt.id ? `${COL.terracota}14` : COL.branco,
                          color: cTipoCadastro === opt.id ? COL.terracota : COL.grafite, fontWeight: 700, fontSize: 12.5,
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {cTipoCadastro === "permanente" ? (
                    <>
                      <label style={lbl}>Tipo</label>
                      <select value={cTipoPermanente} onChange={(e) => setCTipoPermanente(e.target.value)} style={inp}>
                        {TIPOS_PERMANENTE.map((t) => <option key={t}>{t}</option>)}
                      </select>

                      <label style={lbl}>Categoria de colportor</label>
                      <select value={cNivelPermanente} onChange={(e) => setCNivelPermanente(e.target.value)} style={inp}>
                        {NIVEIS_PERMANENTE.map((n) => <option key={n}>{n}</option>)}
                      </select>

                      {cNivelPermanente === "Credenciado" && (
                        <>
                          <label style={lbl}>Você tem cota reduzida?</label>
                          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                            {[{ id: false, label: "Não" }, { id: true, label: "Sim" }].map((opt) => (
                              <button
                                key={String(opt.id)}
                                onClick={() => setCCotaReduzida(opt.id)}
                                className="lib-btn"
                                style={{
                                  flex: 1, padding: "11px 6px", borderRadius: 10, border: `1.5px solid ${cCotaReduzida === opt.id ? COL.terracota : COL.areiaEscura}`,
                                  cursor: "pointer", background: cCotaReduzida === opt.id ? `${COL.terracota}14` : COL.branco,
                                  color: cCotaReduzida === opt.id ? COL.terracota : COL.grafite, fontWeight: 700, fontSize: 12.5,
                                }}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          {cCotaReduzida && (
                            <p style={{ fontSize: 11.5, color: COL.oliva, background: `${COL.oliva}10`, border: `1px dashed ${COL.oliva}`, borderRadius: 10, padding: "9px 12px", marginBottom: 16, lineHeight: 1.5 }}>
                              Cota reduzida aplicada — exceção para colportor Credenciado com mais de 25 anos na função.
                            </p>
                          )}
                        </>
                      )}
                    </>
                  ) : campanhas.length === 0 ? (
                    <p style={{ fontSize: 12.5, color: COL.vermelho, background: `${COL.vermelho}10`, border: `1px dashed ${COL.vermelho}`, borderRadius: 10, padding: "10px 12px", marginBottom: 16, lineHeight: 1.5 }}>
                      Nenhuma campanha aberta no momento. Fale com o diretor ou escolha "Permanente".
                    </p>
                  ) : (
                    <>
                      <label style={lbl}>Campanha</label>
                      <select value={cCampanhaId} onChange={(e) => setCCampanhaId(e.target.value)} style={inp}>
                        <option value="">Selecione a campanha</option>
                        {campanhas.filter((c) => c.categoria !== "Permanentes" && campanhaEmVigor(c)).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome} · {c.categoria} ({formatarDataBR(c.inicio)} a {formatarDataBR(c.fim)})
                          </option>
                        ))}
                      </select>

                      <label style={lbl}>Colégio</label>
                      <select value={cColegio} onChange={(e) => setCColegio(e.target.value)} style={inp}>
                        {COLEGIOS.map((c) => <option key={c}>{c}</option>)}
                      </select>

                      {cColegio === COLEGIO_OUTRO ? (
                        <p style={{ fontSize: 11.5, color: "#8A8478", background: COL.areia, border: `1px dashed ${COL.areiaEscura}`, borderRadius: 10, padding: "9px 12px", marginBottom: 16, lineHeight: 1.4 }}>
                          Sem colégio na lista? Sem problema — sua meta vai usar o valor de referência de Teologia (Uniaene).
                        </p>
                      ) : (
                        <>
                          <label style={lbl}>Curso</label>
                          <select value={cCurso} onChange={(e) => setCCurso(e.target.value)} style={inp}>
                            {cursosDoColegio.map((c) => <option key={c.curso} value={c.curso}>{c.curso}</option>)}
                          </select>
                        </>
                      )}
                    </>
                  )}

                  <div style={{
                    background: `${COL.oliva}14`, border: `1.5px solid ${COL.oliva}`, borderRadius: 12,
                    padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span style={{ fontSize: 12.5, color: "#5C6B57", fontWeight: 700 }}>Sua meta de vendas</span>
                    <span style={{ fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 19, color: COL.oliva }}>{fmt(cMetaCalculada)}</span>
                  </div>

                  <button onClick={enviarCadastro} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota }}>
                    Enviar cadastro <ChevronRight size={16} />
                  </button>
                  <p style={{ fontSize: 11.5, color: "#8A8478", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                    Seu cadastro será analisado pelo diretor antes de liberar o acesso.
                  </p>
                </>
              )}
            </>
          )}

          {mode === "cadastro" && passo === "enviado" && (
            <div className="lib-fade-in" style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ width: 60, height: 60, borderRadius: "50%", background: `${COL.oliva}14`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Check size={28} color={COL.oliva} />
              </div>
              <h3 style={{ fontFamily: FONT_SERIF, color: COL.petroleo, margin: "0 0 8px", fontSize: 19, fontWeight: 800 }}>
                Cadastro enviado!
              </h3>
              <p style={{ fontSize: 13.5, color: "#8A8478", lineHeight: 1.6, margin: "0 0 20px" }}>
                O diretor vai analisar sua solicitação. Assim que for aprovada, você já poderá entrar com o telefone e a senha que você criou.
              </p>
              <button onClick={() => trocarModo("entrar")} className="lib-btn" style={{ ...btnPrimary, background: COL.petroleo }}>
                Voltar para o login
              </button>
            </div>
          )}
        </div>
      </div>
      <style>{`
        input::placeholder, textarea::placeholder { color: #B0A99A; }
      `}</style>
    </div>
  );
}

const lbl = { display: "block", fontSize: 12.5, fontWeight: 700, color: COL.grafite, marginBottom: 7, fontFamily: FONT_SANS, letterSpacing: 0.3 };
const inp = {
  width: "100%", padding: "13px 14px", borderRadius: 10, border: `1.5px solid ${COL.areiaEscura}`,
  fontSize: 15, fontFamily: FONT_SANS, fontWeight: 600, marginBottom: 16, outline: "none", boxSizing: "border-box",
  background: COL.branco, color: COL.grafite, transition: "border-color 0.15s ease, box-shadow 0.15s ease",
};
const btnPrimary = {
  width: "100%", padding: "14px 0", borderRadius: 10, border: "none", cursor: "pointer",
  background: COL.petroleo, color: COL.areia, fontFamily: FONT_SANS, fontWeight: 800,
  fontSize: 15.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  letterSpacing: 0.2, boxShadow: "0 6px 16px rgba(0,0,0,0.18)",
};

/* ============================================================
   CÁLCULOS COMPARTILHADOS
   ============================================================ */
function useStats(colportores, relatorios) {
  return useMemo(() => {
    const byColportor = {};
    colportores.forEach((c) => {
      byColportor[c.id] = {
        totalVendido: 0, totalLivros: 0, totalOfertas: 0, totalOracoes: 0, totalEntregues: 0,
        porLivro: {}, porDia: {},
      };
    });
    relatorios.forEach((r) => {
      const b = byColportor[r.colportorId];
      if (!b) return;
      b.totalOfertas += r.ofertas || 0;
      b.totalOracoes += r.oracoes || 0;
      b.totalEntregues += r.entregues || 0;
      (r.vendas || []).forEach((v) => {
        const item = CATALOGO.find((c) => c.id === v.itemId);
        const valor = (item?.preco || 0) * v.qtd;
        b.totalVendido += valor;
        b.totalLivros += v.qtd;
        b.porLivro[v.itemId] = (b.porLivro[v.itemId] || 0) + v.qtd;
      });
      b.porDia[r.data] = (b.porDia[r.data] || 0) + (r.vendas || []).reduce((s, v) => {
        const item = CATALOGO.find((c) => c.id === v.itemId);
        return s + (item?.preco || 0) * v.qtd;
      }, 0);
    });
    return byColportor;
  }, [colportores, relatorios]);
}

/* ============================================================
   PERMANENTES — controle de cota mensal e semestral
   Meta mensal fixa (tabela Iniciante/Aspirante/Licenciado/
   Credenciado). Uma "cota" é batida quando o vendido no mês
   atinge 100% da meta mensal. A cada semestre fechado (Jan-Jun
   ou Jul-Dez), são necessárias 5 cotas batidas em 6 meses — o
   rebaixamento de categoria, se for o caso, é decisão manual
   do diretor; o sistema só sinaliza o resultado.
   ============================================================ */
const NOMES_MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const NOMES_MESES_LONGO = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

// Retorna { inicio, fim } (formato AAAA-MM-DD) do mês atual — usado para
// o Mês Máximo de Permanentes, que vale automaticamente para o mês em
// que é lançado, sem o diretor precisar escolher datas.
function mesAtualComoPeriodo() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();
  const inicio = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const fim = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
  return { inicio, fim };
}

// Retorna a chave "AAAA-MM" de um mês, dado ano e mês (0-indexado)
function chaveMes(ano, mesIndex) {
  return `${ano}-${String(mesIndex + 1).padStart(2, "0")}`;
}

/* ============================================================
   SEMANAS/MESES DENTRO DE UM PERÍODO
   Usado no ranking por período: campanhas (Estudantes/Sonhando
   Alto) são divididas em semanas de calendário (domingo a
   sábado); Permanentes são divididos em meses.
   ============================================================ */
function addDias(dataStr, n) {
  const d = new Date(dataStr + "T00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

// Lista as semanas de calendário (domingo a sábado) que tocam o período
// [inicioStr, fimStr]. Cada semana é recortada para não passar do período.
function semanasDoPeriodo(inicioStr, fimStr) {
  const inicio = new Date(inicioStr + "T00:00");
  const fim = new Date(fimStr + "T00:00");
  const semanas = [];
  // Recua até o domingo da semana que contém o início
  const cursor = new Date(inicio);
  cursor.setDate(cursor.getDate() - cursor.getDay());
  let numero = 1;
  while (cursor <= fim) {
    const domingo = cursor.toISOString().slice(0, 10);
    const sabadoDate = new Date(cursor);
    sabadoDate.setDate(sabadoDate.getDate() + 6);
    const sabado = sabadoDate.toISOString().slice(0, 10);
    const inicioRecortado = domingo < inicioStr ? inicioStr : domingo;
    const fimRecortado = sabado > fimStr ? fimStr : sabado;
    semanas.push({ numero, inicio: inicioRecortado, fim: fimRecortado, label: `Semana ${numero}` });
    cursor.setDate(cursor.getDate() + 7);
    numero++;
  }
  return semanas;
}

// Lista os meses (AAAA-MM) que tocam o período [inicioStr, fimStr].
function mesesDoPeriodo(inicioStr, fimStr) {
  const meses = [];
  let ano = parseInt(inicioStr.slice(0, 4), 10);
  let mes = parseInt(inicioStr.slice(5, 7), 10) - 1; // 0-indexed
  const fimAno = parseInt(fimStr.slice(0, 4), 10);
  const fimMes = parseInt(fimStr.slice(5, 7), 10) - 1;
  while (ano < fimAno || (ano === fimAno && mes <= fimMes)) {
    const inicioMes = `${ano}-${String(mes + 1).padStart(2, "0")}-01`;
    const ultimoDia = new Date(ano, mes + 1, 0).getDate();
    const fimMesStr = `${ano}-${String(mes + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
    const inicioRecortado = inicioMes < inicioStr ? inicioStr : inicioMes;
    const fimRecortado = fimMesStr > fimStr ? fimStr : fimMesStr;
    meses.push({ inicio: inicioRecortado, fim: fimRecortado, label: `${NOMES_MESES[mes]} de ${ano}` });
    mes++;
    if (mes > 11) { mes = 0; ano++; }
  }
  return meses;
}

/* ============================================================
   DIAS ÚTEIS e META DIÁRIA
   Meta diária = meta geral do período ÷ dias úteis (seg-sex) do
   período. Usado para campanhas (Estudantes/Sonhando Alto) e
   para o mês corrente (Permanentes).
   ============================================================ */
function diasUteisEntre(inicioStr, fimStr) {
  const inicio = new Date(inicioStr + "T00:00");
  const fim = new Date(fimStr + "T00:00");
  let count = 0;
  const cursor = new Date(inicio);
  while (cursor <= fim) {
    const diaSemana = cursor.getDay(); // 0=domingo, 6=sábado
    if (diaSemana !== 0 && diaSemana !== 6) count++;
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

function diasUteisAteHoje(inicioStr, fimStr, hojeStr) {
  const limite = hojeStr < fimStr ? hojeStr : fimStr;
  if (limite < inicioStr) return 0;
  return diasUteisEntre(inicioStr, limite);
}

// Resumo de meta diária/progresso esperado para um período (campanha ou mês).
function resumoMetaDiaria(metaGeral, vendidoAcumulado, inicioStr, fimStr) {
  const hojeStr = todayStr();
  const diasUteisTotal = diasUteisEntre(inicioStr, fimStr);
  const diasUteisPassados = diasUteisAteHoje(inicioStr, fimStr, hojeStr);
  const metaDiaria = diasUteisTotal > 0 ? metaGeral / diasUteisTotal : 0;
  const metaEsperadaHoje = metaDiaria * diasUteisPassados;
  const pctEsperado = metaGeral > 0 ? Math.min(100, (metaEsperadaHoje / metaGeral) * 100) : 0;
  const pctReal = metaGeral > 0 ? Math.min(100, (vendidoAcumulado / metaGeral) * 100) : 0;
  const diferenca = vendidoAcumulado - metaEsperadaHoje;
  return {
    metaDiaria, diasUteisTotal, diasUteisPassados,
    metaEsperadaHoje, pctEsperado, pctReal, diferenca,
    noRitmo: diferenca >= 0,
  };
}

// Soma o vendido por mês a partir de porDia ({ "AAAA-MM-DD": valor })
function vendidoPorMes(porDia) {
  const porMes = {};
  Object.entries(porDia || {}).forEach(([data, valor]) => {
    const chave = data.slice(0, 7); // "AAAA-MM"
    porMes[chave] = (porMes[chave] || 0) + valor;
  });
  return porMes;
}

// Meses (chave + ano/mesIndex) que compõem o semestre de uma data de referência
function mesesDoSemestre(dataRef = new Date()) {
  const ano = dataRef.getFullYear();
  const mes = dataRef.getMonth(); // 0-11
  const inicioSemestre = mes < 6 ? 0 : 6;
  const meses = [];
  for (let i = 0; i < 6; i++) {
    const mesIndex = inicioSemestre + i;
    meses.push({ ano, mesIndex, chave: chaveMes(ano, mesIndex), nome: NOMES_MESES[mesIndex] });
  }
  return meses;
}

function nomeSemestre(dataRef = new Date()) {
  const mes = dataRef.getMonth();
  return mes < 6 ? `1º Semestre ${dataRef.getFullYear()}` : `2º Semestre ${dataRef.getFullYear()}`;
}

// Resumo mensal/semestral de um colportor Permanente
function resumoPermanente(porDia, metaMensal, dataRef = new Date()) {
  const porMes = vendidoPorMes(porDia);
  const mesAtualChave = chaveMes(dataRef.getFullYear(), dataRef.getMonth());
  const vendidoMesAtual = porMes[mesAtualChave] || 0;
  const pctMesAtual = metaMensal > 0 ? Math.min(100, (vendidoMesAtual / metaMensal) * 100) : 0;

  const meses = mesesDoSemestre(dataRef).map((m) => {
    const vendido = porMes[m.chave] || 0;
    const pct = metaMensal > 0 ? Math.min(100, (vendido / metaMensal) * 100) : 0;
    const cotaBatida = metaMensal > 0 && vendido >= metaMensal;
    const éFuturo = m.chave > mesAtualChave;
    return { ...m, vendido, pct, cotaBatida, éFuturo };
  });

  const cotasBatidas = meses.filter((m) => m.cotaBatida).length;
  const semestreCompleto = meses.every((m) => m.chave <= mesAtualChave) || dataRef.getMonth() === 5 || dataRef.getMonth() === 11;

  return {
    mesAtualChave, vendidoMesAtual, pctMesAtual,
    meses, cotasBatidas, metaCotas: 5, semestreCompleto,
    nomeSemestre: nomeSemestre(dataRef),
  };
}

/* ============================================================
   ============  PAINEL DO COLPORTOR  ========================
   ============================================================ */
function ColportorApp({ me, colportores, relatorios, setRelatorios, avisos, semanas, campanhas, lideres, relatoriosLider, setRelatoriosLider, solicitacoes, setSolicitacoes, retiradas, setRetiradas, candidatos, setCandidatos, mensagens, setMensagens, indicacoes, setIndicacoes, resgates, setResgates, onLogout, showToast, toast }) {
  const [tab, setTab] = useState("hoje");
  const estoque = useMemo(() => calcularEstoque(me.id, retiradas, relatorios), [me.id, retiradas, relatorios]);
  const pontosCtx = { relatorios, candidatos, retiradas, indicacoes, campanhas };
  const pontos = pontosDisponiveis(me, pontosCtx, resgates);
  const stats = useStats(colportores, relatorios);
  const myStats = stats[me.id] || { totalVendido: 0, totalLivros: 0, totalOfertas: 0, totalOracoes: 0, totalEntregues: 0, porLivro: {}, porDia: {} };
  const meta = me.meta || 0;
  const pct = meta > 0 ? Math.min(100, (myStats.totalVendido / meta) * 100) : 0;
  const minhaCampanha = campanhas.find((c) => c.id === me.campanhaId);
  const minhaCampanhaEncerrada = campanhaEncerrada(minhaCampanha);
  const oficial = useMemo(() => acharResultadoOficial(me, campanhas), [me, campanhas]);
  const aniversarioHoje = ehAniversarioHoje(me.nascimento);
  const ganhouBonusAniversario = !!me.nascimento && aniversarioNaCampanha(me.nascimento, minhaCampanha);
  const ehPermanente = me.categoria === "Permanentes";
  const metaMensalPermanente = ehPermanente
    ? (me.tipoPermanente && me.nivelPermanente
        ? (me.cotaReduzida ? COTA_REDUZIDA_VALOR : calcularMetaPermanente(me.tipoPermanente, me.nivelPermanente) / 2)
        : 0)
    : 0;
  const resumoMensal = ehPermanente ? resumoPermanente(myStats.porDia, metaMensalPermanente) : null;

  const today = todayStr();
  const jaEnviouHoje = relatorios.some((r) => r.colportorId === me.id && r.data === today);

  const meusAvisos = avisos.filter((a) => {
    if (a.categoria === "Todos") return true;
    if (a.categoria !== me.categoria) return false;
    if (a.campanhaId) return a.campanhaId === me.campanhaId;
    return true;
  }).slice(-5).reverse();
  const assistenciasPendentes = relatoriosLider.filter((r) => r.colportorId === me.id && !r.confirmado);

  const ranking = useMemo(() => {
    return colportores
      .filter((c) => c.categoria === me.categoria && c.status !== "pendente")
      .map((c) => ({ ...c, vendido: stats[c.id]?.totalVendido || 0 }))
      .sort((a, b) => b.vendido - a.vendido);
  }, [colportores, stats, me.categoria]);
  const myRank = ranking.findIndex((c) => c.id === me.id) + 1;

  return (
    <div style={{ minHeight: "100vh", background: COL.areia, fontFamily: FONT_SANS, paddingBottom: 90 }}>
      <Toast toast={toast} />
      {/* HEADER */}
      <div style={{ background: COL.petroleo, padding: "22px 20px 60px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `${COL.terracota}1A` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }} className="lib-fade-in">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ animation: "floatLogo 5s ease-in-out infinite" }}>
              <LogoMark size={42} />
            </div>
            <div>
              <p style={{ color: COL.terracotaClaro, fontSize: 11.5, letterSpacing: 1.8, textTransform: "uppercase", margin: 0, fontWeight: 800 }}>
                {me.categoria}
              </p>
              <h1 style={{ color: COL.areia, fontFamily: FONT_SERIF, fontSize: 26, fontWeight: 800, margin: "4px 0 0" }}>
                Olá, {me.nome.split(" ")[0]}
              </h1>
            </div>
          </div>
          <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: 9, cursor: "pointer", color: COL.areia }}>
            <LogOut size={17} />
          </button>
        </div>
        {!jaEnviouHoje && !minhaCampanhaEncerrada && !oficial && (
          <div style={{
            marginTop: 16, background: "rgba(194,98,45,0.18)", border: `1px solid ${COL.terracota}`,
            borderRadius: 12, padding: "10px 14px", display: "flex", alignItems: "center", gap: 9,
          }}>
            <Bell size={15} color={COL.terracotaClaro} />
            <span style={{ color: COL.areia, fontSize: 13 }}>Você ainda não enviou o relatório de hoje.</span>
          </div>
        )}
      </div>

      {/* ANIVERSÁRIO — aparece no dia, no topo de tudo */}
      {aniversarioHoje && (
        <div style={{ margin: "-44px 16px 0", position: "relative", zIndex: 2 }}>
          <CardAniversario nome={me.nome} ganhouBonus={ganhouBonusAniversario} />
        </div>
      )}

      {/* PONTOS — primeira seção (bonificação) */}
      <div style={{ margin: aniversarioHoje ? "14px 16px 0" : "-44px 16px 0", position: "relative", zIndex: 2 }}>
        <CardPontos saldo={pontos.saldo} ganhos={pontos.ganhos} onLoja={() => setTab("loja")} />
      </div>

      {/* CARD META */}
      <div style={{ margin: "14px 16px 0", position: "relative", zIndex: 2 }}>
        {oficial ? (
          <CardResultadoOficialTopo oficial={oficial} meta={meta} />
        ) : ehPermanente ? (
          <ResumoPermanenteCard resumo={resumoMensal} metaMensal={metaMensalPermanente} rank={myRank} total={ranking.length} />
        ) : (
          <MetaCard vendido={myStats.totalVendido} meta={meta} pct={pct} rank={myRank} total={ranking.length} campanha={minhaCampanha} />
        )}
      </div>

      <div style={{ padding: "20px 16px 0" }} className="lib-fade-in" key={tab}>
        {tab === "loja" && (
          <TabLoja me={me} pontos={pontos} resgates={resgates} setResgates={setResgates} onVoltar={() => setTab("hoje")} showToast={showToast} />
        )}
        {tab === "hoje" && (
          oficial
            ? <DetalheResultadoOficial oficial={oficial} />
            : <TabHoje me={me} relatorios={relatorios} setRelatorios={setRelatorios} showToast={showToast} jaEnviouHoje={jaEnviouHoje} campanhaEncerrada={minhaCampanhaEncerrada} minhaCampanha={minhaCampanha} estoque={estoque} />
        )}
        {tab === "estoque" && (
          <TabEstoque me={me} estoque={estoque} retiradas={retiradas} setRetiradas={setRetiradas} showToast={showToast} />
        )}
        {tab === "estudos" && (
          <TabEstudosColportor me={me} candidatos={candidatos} setCandidatos={setCandidatos} showToast={showToast} />
        )}
        {tab === "ranking" && (
          <TabRankingColportor ranking={ranking} myId={me.id} semanas={semanas} me={me} relatorios={relatorios} colportores={colportores} campanhas={campanhas} oficialInicial={oficial?.campanha?.id || null} />
        )}
        {tab === "historico" && <TabHistorico me={me} relatorios={relatorios} myStats={myStats} />}
        {tab === "avisos" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <CardMensagemDiretor
              me={me}
              mensagens={mensagens}
              setMensagens={setMensagens}
              showToast={showToast}
            />
            <CardIndicacao
              me={me}
              indicacoes={indicacoes}
              setIndicacoes={setIndicacoes}
              showToast={showToast}
            />
            <CardSolicitarCampanha
              me={me}
              campanhas={campanhas}
              colportores={colportores}
              lideres={lideres}
              solicitacoes={solicitacoes}
              setSolicitacoes={setSolicitacoes}
              showToast={showToast}
            />
            <TabAvisosColportor
              avisos={meusAvisos}
              assistenciasPendentes={assistenciasPendentes}
              lideres={lideres}
              relatoriosLider={relatoriosLider}
              setRelatoriosLider={setRelatoriosLider}
              showToast={showToast}
            />
          </div>
        )}
      </div>

      <BottomNav tab={tab} setTab={setTab} pendentesCount={assistenciasPendentes.length} />
    </div>
  );
}

function CardResultadoOficialTopo({ oficial, meta }) {
  const { campanha, resultado, tipo } = oficial;
  const ehPerm = tipo === "permanente";
  const headlineLabel = ehPerm ? "Venda líquida" : "Compra total";
  const headlineValor = ehPerm ? resultado.liquido : resultado.vendido;
  const pct = !ehPerm && meta > 0 ? Math.min(100, (resultado.vendido / meta) * 100) : 0;
  const batida = pct >= 100;
  return (
    <div className="lib-pop-in" style={{ background: COL.branco, borderRadius: 18, padding: 20, boxShadow: "0 14px 34px rgba(27,58,75,0.18)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, paddingBottom: 12, borderBottom: `1px solid ${COL.areia}` }}>
        <Award size={14} color={COL.terracota} />
        <span style={{ fontSize: 12, fontWeight: 700, color: COL.grafite }}>{campanha.nome}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: ehPerm ? 0 : 14 }}>
        <div>
          <p style={{ fontSize: 11.5, color: "#8A8478", margin: 0, letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 800 }}>{headlineLabel}</p>
          <p style={{ fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 28, color: COL.petroleo, margin: "2px 0 0" }}>{fmt(headlineValor)}</p>
          {ehPerm
            ? <p style={{ fontSize: 12.5, color: "#8A8478", margin: "2px 0 0", fontWeight: 600 }}>{resultado.tipo} · Bonificado {fmt(resultado.bonificado)}</p>
            : <p style={{ fontSize: 12.5, color: "#8A8478", margin: "2px 0 0", fontWeight: 600 }}>Depósito {fmt(resultado.deposito)}</p>}
        </div>
        {!ehPerm && resultado.posicao > 0 && (
          <div style={{ textAlign: "center", background: COL.areia, borderRadius: 12, padding: "8px 14px" }}>
            <Trophy size={18} color={COL.terracota} style={{ marginBottom: 2 }} />
            <p style={{ fontSize: 11, fontWeight: 800, color: COL.grafite, margin: 0 }}>{resultado.posicao}º de {campanha.resultados.length}</p>
          </div>
        )}
      </div>
      {!ehPerm && meta > 0 && (
        <>
          <div style={{ height: 12, background: COL.areia, borderRadius: 8, overflow: "hidden" }}>
            <div className={`lib-progress-fill ${batida ? "shimmer" : ""}`} style={{ height: "100%", width: `${pct}%`, borderRadius: 8, background: batida ? COL.oliva : `linear-gradient(90deg, ${COL.terracota}, ${COL.terracotaClaro})` }} />
          </div>
          <p style={{ fontSize: 12.5, color: batida ? COL.oliva : COL.terracota, fontWeight: 800, margin: "8px 0 0" }}>
            {pct.toFixed(0)}% da meta {batida ? "— Meta batida! 🎉" : "alcançada"}
          </p>
        </>
      )}
    </div>
  );
}

function DetalheResultadoOficial({ oficial }) {
  const { campanha, resultado, tipo } = oficial;
  const ehPerm = tipo === "permanente";
  const linhas = ehPerm
    ? [
        ["Tipo de colportor", resultado.tipo],
        ["Valor de venda", fmt(resultado.vendido)],
        ["Devoluções", fmt(resultado.devolvido)],
        ["Venda líquida", fmt(resultado.liquido)],
        ["Bonificado", fmt(resultado.bonificado)],
      ]
    : [
        ["Posição", `${resultado.posicao}º de ${campanha.resultados.length}`],
        ["Compra total", fmt(resultado.vendido)],
        ["Depósito", fmt(resultado.deposito)],
      ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ ...card, background: `${COL.petroleo}08`, border: `1.5px solid ${COL.petroleo}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Award size={16} color={COL.petroleo} />
          <h3 style={{ ...cardTitle, margin: 0, fontSize: 16 }}>Resultado oficial</h3>
        </div>
        <p style={{ margin: 0, fontSize: 12.5, color: "#8A8478", lineHeight: 1.5 }}>
          Esta é uma campanha de acompanhamento ({campanha.nome}). Os números vêm do razão oficial — os lançamentos diários não se aplicam aqui.
        </p>
      </div>
      <div style={card}>
        <h3 style={cardTitle}>Seus números</h3>
        <div>
          {linhas.map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "11px 0", borderBottom: i < linhas.length - 1 ? `1px solid ${COL.areia}` : "none" }}>
              <span style={{ fontSize: 13, color: "#8A8478" }}>{k}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: COL.petroleo }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LinhaTotal({ valor, label = "Total" }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      marginTop: 10, paddingTop: 12, borderTop: `2px solid ${COL.areiaEscura}`,
    }}>
      <span style={{ fontSize: 12.5, fontWeight: 800, color: COL.grafite, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      <span style={{ fontSize: 16, fontWeight: 800, color: COL.petroleo, fontFamily: FONT_SERIF }}>{fmt(valor)}</span>
    </div>
  );
}

function RankingOficial({ campanha, meNome }) {
  const ehPerm = campanha.tipoResultado === "permanente";
  const lista = ehPerm
    ? [...campanha.resultados].sort((a, b) => b.liquido - a.liquido).map((r, i) => ({ ...r, pos: i + 1, valor: r.liquido }))
    : [...campanha.resultados].sort((a, b) => (a.posicao || 999) - (b.posicao || 999)).map((r) => ({ ...r, pos: r.posicao, valor: r.vendido }));
  const total = lista.reduce((s, r) => s + (r.valor || 0), 0);
  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Trophy size={17} color={COL.terracota} />
        <h3 style={{ ...cardTitle, margin: 0 }}>Ranking oficial</h3>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 12, color: "#8A8478" }}>{campanha.nome}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {lista.map((r) => {
          const eu = normNome(r.nome) === normNome(meNome);
          const podio = r.pos <= 3;
          return (
            <div key={r.nome + r.pos} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 12,
              background: eu ? `${COL.terracota}14` : COL.areia,
              border: eu ? `1.5px solid ${COL.terracota}` : "1.5px solid transparent",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: podio ? COL.terracota : COL.branco, color: podio ? COL.branco : COL.grafite,
                fontWeight: 800, fontSize: 12.5, flexShrink: 0,
              }}>{r.pos}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13.5, fontWeight: eu ? 800 : 600, color: COL.grafite, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {r.nome}{eu ? " (você)" : ""}
                </p>
                {ehPerm && <p style={{ margin: 0, fontSize: 11, color: "#B0A99A" }}>{r.tipo}</p>}
              </div>
              <span style={{ fontSize: 13.5, fontWeight: 800, color: COL.petroleo, whiteSpace: "nowrap" }}>{fmt(r.valor)}</span>
            </div>
          );
        })}
      </div>
      <LinhaTotal valor={total} />
    </div>
  );
}

function CardAniversario({ nome, ganhouBonus }) {
  const primeiro = (nome || "").split(" ")[0] || nome;
  return (
    <div className="lib-pop-in" style={{
      background: `linear-gradient(135deg, ${COL.petroleo}, ${COL.terracota})`,
      borderRadius: 18, padding: 20, boxShadow: "0 14px 34px rgba(27,58,75,0.28)", color: COL.branco,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 26 }}>🎉</span>
        <h3 style={{ margin: 0, fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 21 }}>Feliz aniversário, {primeiro}!</h3>
      </div>
      <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, opacity: 0.96 }}>
        Que Deus te abençoe muito neste novo ano de vida. Obrigado por fazer parte da equipe Libertadores — conte sempre conosco! 💛
        {ganhouBonus && (
          <> {" "}🎁 Como presente, você recebeu <strong>300 pontos</strong> para usar na loja do app.</>
        )}
      </p>
    </div>
  );
}

function CardPontos({ saldo, ganhos, onLoja }) {
  return (
    <div className="lib-pop-in" style={{
      background: `linear-gradient(135deg, ${COL.terracota}, ${COL.terracotaClaro})`,
      borderRadius: 18, padding: 18, boxShadow: "0 14px 34px rgba(194,98,45,0.3)", color: COL.branco,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: 11.5, letterSpacing: 0.8, textTransform: "uppercase", fontWeight: 800, opacity: 0.9 }}>Sua bonificação</p>
          <p style={{ margin: "2px 0 0", fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 30 }}>
            {saldo.toLocaleString("pt-BR")} <span style={{ fontSize: 15, fontWeight: 700 }}>pts</span>
          </p>
          {ganhos !== saldo && <p style={{ margin: "2px 0 0", fontSize: 11.5, opacity: 0.9 }}>{ganhos.toLocaleString("pt-BR")} ganhos no total</p>}
        </div>
        <Award size={40} style={{ opacity: 0.85 }} />
      </div>
      <button onClick={onLoja} className="lib-btn" style={{
        marginTop: 14, width: "100%", padding: "11px 0", borderRadius: 12, border: "none", cursor: "pointer",
        background: "rgba(255,255,255,0.22)", color: COL.branco, fontWeight: 800, fontSize: 13.5,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        <Sparkles size={16} /> Trocar pontos por livros
      </button>
    </div>
  );
}

function TabLoja({ me, pontos, resgates, setResgates, onVoltar, showToast }) {
  const meusResgates = (resgates || []).filter((r) => r.colportorId === me.id).slice().reverse();

  async function trocar(item) {
    const custo = Math.round(item.preco * PONTOS_POR_REAL);
    if (pontos.saldo < custo) {
      showToast("Pontos insuficientes para esse livro.", "error");
      return;
    }
    if (!confirm(`Trocar ${custo.toLocaleString("pt-BR")} pontos por "${item.nome}"?`)) return;
    const novo = {
      id: uid("resg"), colportorId: me.id, colportorNome: me.nome,
      itemId: item.id, itemNome: item.nome, preco: item.preco, pontos: custo,
      status: "pendente", criadoEm: new Date().toISOString(),
    };
    await setResgates([...(resgates || []), novo]);
    showToast(`Troca registrada! Combine a retirada de "${item.nome}" com o diretor.`);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <button onClick={onVoltar} className="lib-btn" style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: COL.petroleo, fontWeight: 700, cursor: "pointer", fontSize: 13.5 }}>
        <ArrowLeft size={16} /> Voltar
      </button>

      <div style={{ ...card, background: `${COL.terracota}0E`, border: `1.5px solid ${COL.terracota}` }}>
        <p style={{ margin: 0, fontSize: 11.5, color: "#8A8478", fontWeight: 800, textTransform: "uppercase", letterSpacing: 0.5 }}>Saldo disponível</p>
        <p style={{ margin: "2px 0 0", fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 27, color: COL.terracota }}>{pontos.saldo.toLocaleString("pt-BR")} pts</p>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: "#8A8478" }}>Cada R$ 1,00 do preço do livro = {PONTOS_POR_REAL} pontos.</p>
      </div>

      <div style={card}>
        <h3 style={cardTitle}>Livros de colportagem</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CATALOGO.map((item) => {
            const custo = Math.round(item.preco * PONTOS_POR_REAL);
            const podeTrocar = pontos.saldo >= custo;
            return (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${COL.areia}`, paddingBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: COL.grafite }}>{item.nome}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#8A8478" }}>{fmt(item.preco)} · <strong style={{ color: COL.terracota }}>{custo.toLocaleString("pt-BR")} pts</strong></p>
                </div>
                <button onClick={() => trocar(item)} disabled={!podeTrocar} className="lib-btn" style={{
                  padding: "8px 14px", borderRadius: 10, border: "none", flexShrink: 0,
                  cursor: podeTrocar ? "pointer" : "not-allowed", fontSize: 12.5, fontWeight: 700,
                  background: podeTrocar ? COL.terracota : "#CFC6B5", color: COL.branco,
                }}>Trocar</button>
              </div>
            );
          })}
        </div>
      </div>

      {meusResgates.length > 0 && (
        <div style={card}>
          <h3 style={cardTitle}>Minhas trocas</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {meusResgates.map((r) => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COL.areia, borderRadius: 10, padding: "10px 12px" }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COL.grafite }}>{r.itemNome}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#8A8478" }}>{new Date(r.criadoEm).toLocaleDateString("pt-BR")} · {r.status === "entregue" ? "Entregue ✓" : "Aguardando entrega"}</p>
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 800, color: COL.terracota, whiteSpace: "nowrap" }}>-{r.pontos.toLocaleString("pt-BR")}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetaCard({ vendido, meta, pct, rank, total, campanha }) {
  const batida = pct >= 100;
  return (
    <div className="lib-pop-in" style={{
      background: COL.branco, borderRadius: 18, padding: 20, boxShadow: "0 14px 34px rgba(27,58,75,0.18)",
    }}>
      {campanha && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, marginBottom: 12, paddingBottom: 12,
          borderBottom: `1px solid ${COL.areia}`,
        }}>
          <Calendar size={13} color={COL.terracota} />
          <span style={{ fontSize: 12, fontWeight: 700, color: COL.grafite }}>{campanha.nome}</span>
          <span style={{ fontSize: 11.5, color: "#B0A99A" }}>· {formatarDataBR(campanha.inicio)} a {formatarDataBR(campanha.fim)}</span>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 11.5, color: "#8A8478", margin: 0, letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 800 }}>Sua meta</p>
          <p style={{ fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 28, color: COL.petroleo, margin: "2px 0 0" }}>{fmt(vendido)}</p>
          <p style={{ fontSize: 12.5, color: "#8A8478", margin: "2px 0 0", fontWeight: 600 }}>de {fmt(meta)}</p>
        </div>
        {rank > 0 && (
          <div style={{
            textAlign: "center", background: COL.areia, borderRadius: 12, padding: "8px 14px",
            animation: batida ? "pulseGlow 1.8s ease-in-out infinite" : "none",
          }}>
            <Trophy size={18} color={COL.terracota} style={{ marginBottom: 2 }} />
            <p style={{ fontSize: 11, fontWeight: 800, color: COL.grafite, margin: 0 }}>{rank}º de {total}</p>
          </div>
        )}
      </div>
      <div style={{ height: 12, background: COL.areia, borderRadius: 8, overflow: "hidden" }}>
        <div className={`lib-progress-fill ${batida ? "shimmer" : ""}`} style={{
          height: "100%", width: `${pct}%`, borderRadius: 8,
          background: batida ? COL.oliva : `linear-gradient(90deg, ${COL.terracota}, ${COL.terracotaClaro})`,
        }} />
      </div>
      <p style={{ fontSize: 12.5, color: batida ? COL.oliva : COL.terracota, fontWeight: 800, margin: "8px 0 0" }}>
        {pct.toFixed(0)}% da meta {batida ? "— Meta batida! 🎉" : "alcançada"}
      </p>
    </div>
  );
}

function ResumoPermanenteCard({ resumo, metaMensal, rank, total }) {
  if (!resumo) return null;
  const batidaMes = resumo.pctMesAtual >= 100;
  const noCaminho = resumo.cotasBatidas >= resumo.metaCotas;

  return (
    <div className="lib-pop-in" style={{
      background: COL.branco, borderRadius: 18, padding: 20, boxShadow: "0 14px 34px rgba(27,58,75,0.18)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div>
          <p style={{ fontSize: 11.5, color: "#8A8478", margin: 0, letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 800 }}>Cota do mês</p>
          <p style={{ fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 28, color: COL.petroleo, margin: "2px 0 0" }}>{fmt(resumo.vendidoMesAtual)}</p>
          <p style={{ fontSize: 12.5, color: "#8A8478", margin: "2px 0 0", fontWeight: 600 }}>de {fmt(metaMensal)}</p>
        </div>
        {rank > 0 && (
          <div style={{
            textAlign: "center", background: COL.areia, borderRadius: 12, padding: "8px 14px",
            animation: batidaMes ? "pulseGlow 1.8s ease-in-out infinite" : "none",
          }}>
            <Trophy size={18} color={COL.terracota} style={{ marginBottom: 2 }} />
            <p style={{ fontSize: 11, fontWeight: 800, color: COL.grafite, margin: 0 }}>{rank}º de {total}</p>
          </div>
        )}
      </div>
      <div style={{ height: 12, background: COL.areia, borderRadius: 8, overflow: "hidden" }}>
        <div className={`lib-progress-fill ${batidaMes ? "shimmer" : ""}`} style={{
          height: "100%", width: `${resumo.pctMesAtual}%`, borderRadius: 8,
          background: batidaMes ? COL.oliva : `linear-gradient(90deg, ${COL.terracota}, ${COL.terracotaClaro})`,
        }} />
      </div>
      <p style={{ fontSize: 12.5, color: batidaMes ? COL.oliva : COL.terracota, fontWeight: 800, margin: "8px 0 0" }}>
        {resumo.pctMesAtual.toFixed(0)}% da cota mensal {batidaMes ? "— Cota batida! 🎉" : "alcançada"}
      </p>

      <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COL.areia}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 11.5, color: "#8A8478", fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>{resumo.nomeSemestre}</span>
          <span style={{ fontSize: 12.5, fontWeight: 800, color: noCaminho ? COL.oliva : COL.terracota }}>
            {resumo.cotasBatidas}/{resumo.metaCotas} cotas
          </span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {resumo.meses.map((m) => (
            <div key={m.chave} style={{ flex: 1, textAlign: "center" }}>
              <div style={{
                height: 26, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center",
                background: m.éFuturo ? COL.areia : m.cotaBatida ? COL.oliva : `${COL.vermelho}1A`,
                border: m.éFuturo ? `1px dashed ${COL.areiaEscura}` : "none",
              }}>
                {!m.éFuturo && (m.cotaBatida
                  ? <Check size={13} color={COL.branco} />
                  : <X size={12} color={COL.vermelho} />)}
              </div>
              <span style={{ fontSize: 9.5, color: "#B0A99A", fontWeight: 700, marginTop: 3, display: "block" }}>{m.nome}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11.5, color: "#8A8478", margin: "10px 0 0", lineHeight: 1.5 }}>
          {noCaminho
            ? "Cotas do semestre em dia. Continue assim!"
            : "Atenção: é preciso bater 5 cotas no semestre para manter a categoria."}
        </p>
      </div>
    </div>
  );
}

function TabHoje({ me, relatorios, setRelatorios, showToast, jaEnviouHoje, campanhaEncerrada, minhaCampanha, estoque = {} }) {
  const hoje = todayStr();
  const [dataRel, setDataRel] = useState(hoje);
  const [ofertas, setOfertas] = useState(0);
  const [oracoes, setOracoes] = useState(0);
  const [entregues, setEntregues] = useState(0);
  const [vendas, setVendas] = useState([]); // {itemId, qtd}
  const [itemSel, setItemSel] = useState(CATALOGO[0].id);
  const [qtdSel, setQtdSel] = useState(1);

  // Limites do seletor de data: do início da campanha (ou início do ano, p/
  // permanentes) até hoje. Não dá pra lançar um dia futuro.
  const minData = (minhaCampanha && minhaCampanha.inicio) ? minhaCampanha.inicio : `${hoje.slice(0, 4)}-01-01`;
  const maxData = hoje;
  const jaEnviouNaData = relatorios.some((r) => r.colportorId === me.id && r.data === dataRel);

  // Quanto ainda está disponível de um título, já descontando o que está no
  // carrinho de hoje (vendas ainda não enviadas).
  function disponivelDe(itemId) {
    const base = estoque[itemId]?.disponivel || 0;
    const noCarrinho = vendas.find((x) => x.itemId === itemId)?.qtd || 0;
    return base - noCarrinho;
  }

  const dispItemSel = disponivelDe(itemSel);

  function addVenda() {
    const q = Number(qtdSel) || 0;
    if (q < 1) return;
    const disp = disponivelDe(itemSel);
    if (disp <= 0) {
      const item = CATALOGO.find((c) => c.id === itemSel);
      showToast(`Você não tem "${item?.nome}" em estoque. Registre a retirada na aba Estoque.`, "error");
      return;
    }
    if (q > disp) {
      showToast(`Você só tem ${disp} em estoque desse título.`, "error");
      return;
    }
    setVendas((v) => {
      const existing = v.find((x) => x.itemId === itemSel);
      if (existing) {
        return v.map((x) => x.itemId === itemSel ? { ...x, qtd: x.qtd + q } : x);
      }
      return [...v, { itemId: itemSel, qtd: q }];
    });
    setQtdSel(1);
  }
  function removeVenda(itemId) {
    setVendas((v) => v.filter((x) => x.itemId !== itemId));
  }

  const totalDia = vendas.reduce((s, v) => {
    const item = CATALOGO.find((c) => c.id === v.itemId);
    return s + (item?.preco || 0) * v.qtd;
  }, 0);

  async function enviar() {
    if (!dataRel) {
      showToast("Escolha a data do relatório.", "error");
      return;
    }
    if (dataRel > maxData || dataRel < minData) {
      showToast("Escolha uma data dentro da campanha (até hoje).", "error");
      return;
    }
    if (jaEnviouNaData) {
      showToast(`Você já enviou o relatório de ${formatarDataBR(dataRel)}. Escolha outra data.`, "error");
      return;
    }
    // Trava de segurança: nenhuma venda pode passar do estoque disponível.
    const excede = vendas.find((v) => (v.qtd || 0) > (estoque[v.itemId]?.disponivel || 0));
    if (excede) {
      const item = CATALOGO.find((c) => c.id === excede.itemId);
      showToast(`Estoque insuficiente de "${item?.nome}". Ajuste antes de enviar.`, "error");
      return;
    }
    const novo = {
      id: uid("rel"), colportorId: me.id, data: dataRel,
      ofertas: Number(ofertas) || 0, oracoes: Number(oracoes) || 0,
      entregues: Number(entregues) || 0, vendas, confirmado: false, criadoEm: new Date().toISOString(),
    };
    await setRelatorios([...relatorios, novo]);
    showToast(`Relatório de ${formatarDataBR(dataRel)} enviado! Que bênção. 🙏`);
    setOfertas(0); setOracoes(0); setEntregues(0); setVendas([]);
  }

  if (campanhaEncerrada) {
    return (
      <div style={card}>
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: `${COL.areiaEscura}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <Calendar size={24} color="#8A8478" />
          </div>
          <h3 style={{ fontFamily: FONT_SERIF, color: COL.petroleo, margin: "0 0 4px" }}>Campanha encerrada</h3>
          <p style={{ color: "#8A8478", fontSize: 13.5, margin: 0, lineHeight: 1.5 }}>
            {minhaCampanha ? `"${minhaCampanha.nome}" já foi encerrada.` : "Esta campanha já foi encerrada."} Você não envia mais relatórios por ela, mas seu histórico continua salvo. Se quiser seguir no campo, peça entrada em outra campanha na aba Avisos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={card}>
        <h3 style={cardTitle}>Data do relatório</h3>
        <input type="date" value={dataRel} min={minData} max={maxData} onChange={(e) => setDataRel(e.target.value)} style={{ ...inp, marginBottom: 8 }} />
        <p style={{ margin: 0, fontSize: 12.5, color: dataRel === hoje ? "#8A8478" : COL.terracota, fontWeight: dataRel === hoje ? 500 : 700 }}>
          {dataRel === hoje
            ? "Lançando o relatório de hoje. Esqueceu algum dia? É só trocar a data acima."
            : `Lançando um dia anterior: ${formatarDataBR(dataRel)}.`}
        </p>
        {jaEnviouNaData && (
          <p style={{ margin: "8px 0 0", fontSize: 12.5, color: COL.vermelho, fontWeight: 700 }}>
            Você já enviou o relatório dessa data. Escolha outra para não duplicar.
          </p>
        )}
      </div>

      <div style={card}>
        <h3 style={cardTitle}>Relatório do dia</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 4 }}>
          <NumberField label="Ofertas dadas" icon={<HandHeart size={15} />} value={ofertas} onChange={setOfertas} />
          <NumberField label="Orações" icon={<HeartHandshake size={15} />} value={oracoes} onChange={setOracoes} />
          <NumberField label="Entregues" icon={<BookOpen size={15} />} value={entregues} onChange={setEntregues} />
        </div>
      </div>

      <div style={card}>
        <h3 style={cardTitle}>Vendas do dia</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <select value={itemSel} onChange={(e) => setItemSel(e.target.value)} style={{ ...inp, marginBottom: 0, flex: 1, fontSize: 13.5 }}>
            {CATALOGO.map((c) => {
              const d = disponivelDe(c.id);
              return <option key={c.id} value={c.id}>{c.nome} — {fmt(c.preco)} ({d} em estoque)</option>;
            })}
          </select>
          <input type="number" min={1} value={qtdSel} onChange={(e) => setQtdSel(Number(e.target.value))} style={{ ...inp, marginBottom: 0, width: 56, textAlign: "center" }} />
          <button onClick={addVenda} disabled={dispItemSel <= 0} style={{
            background: dispItemSel <= 0 ? "#CFC6B5" : COL.petroleo, color: COL.areia, border: "none",
            borderRadius: 10, width: 44, cursor: dispItemSel <= 0 ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Plus size={18} />
          </button>
        </div>
        <p style={{
          margin: "0 0 12px", fontSize: 12, fontWeight: 700,
          color: dispItemSel <= 0 ? COL.vermelho : COL.oliva,
        }}>
          {dispItemSel <= 0
            ? "Sem estoque deste título — registre a retirada na aba Estoque."
            : `Disponível para vender agora: ${dispItemSel}`}
        </p>

        {vendas.length === 0 ? (
          <p style={{ color: "#B0A99A", fontSize: 13, textAlign: "center", padding: "10px 0" }}>Nenhuma venda adicionada ainda.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {vendas.map((v) => {
              const item = CATALOGO.find((c) => c.id === v.itemId);
              return (
                <div key={v.itemId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COL.areia, borderRadius: 9, padding: "9px 12px" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: COL.grafite }}>{item.nome}</p>
                    <p style={{ fontSize: 12, color: "#8A8478", margin: 0 }}>{v.qtd}x — {fmt(item.preco * v.qtd)}</p>
                  </div>
                  <button onClick={() => removeVenda(v.itemId)} style={{ background: "none", border: "none", color: COL.vermelho, cursor: "pointer" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
            <div style={{ textAlign: "right", fontWeight: 700, color: COL.petroleo, fontFamily: FONT_SERIF, fontSize: 17, marginTop: 4 }}>
              Total: {fmt(totalDia)}
            </div>
          </div>
        )}
      </div>

      <button onClick={enviar} disabled={jaEnviouNaData} className="lib-btn" style={{
        ...btnPrimary, background: jaEnviouNaData ? "#CFC6B5" : COL.terracota, padding: "15px 0",
        cursor: jaEnviouNaData ? "not-allowed" : "pointer",
      }}>
        {dataRel === hoje ? "Enviar relatório de hoje" : `Enviar relatório de ${formatarDataBR(dataRel)}`} <ChevronRight size={16} />
      </button>
    </div>
  );
}

function TabEstoque({ me, estoque, retiradas, setRetiradas, showToast }) {
  const [itemSel, setItemSel] = useState(CATALOGO[0].id);
  const [qtdSel, setQtdSel] = useState(1);
  const [tipoMov, setTipoMov] = useState("retirada"); // retirada | devolucao

  const minhasMovimentacoes = (retiradas || [])
    .filter((r) => r.colportorId === me.id)
    .sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""));

  const itensComMov = CATALOGO
    .map((it) => ({ ...it, ...(estoque[it.id] || { retirado: 0, devolvido: 0, vendido: 0, disponivel: 0 }) }))
    .filter((it) => it.retirado > 0 || it.vendido > 0 || it.devolvido > 0);

  const totalRetirado = itensComMov.reduce((s, it) => s + it.retirado, 0);
  const totalVendido = itensComMov.reduce((s, it) => s + it.vendido, 0);
  const totalDevolvido = itensComMov.reduce((s, it) => s + it.devolvido, 0);
  const totalDisponivel = totalRetirado - totalVendido - totalDevolvido;

  const dispSel = estoque[itemSel]?.disponivel || 0;
  const ehDevolucao = tipoMov === "devolucao";
  const bloqueado = ehDevolucao && dispSel <= 0;

  async function registrar() {
    const q = Number(qtdSel) || 0;
    if (q < 1) {
      showToast("Informe uma quantidade válida.", "error");
      return;
    }
    const item = CATALOGO.find((c) => c.id === itemSel);
    if (ehDevolucao) {
      if (q > dispSel) {
        showToast(`Você só tem ${dispSel} disponível desse título para devolver.`, "error");
        return;
      }
    }
    const nova = {
      id: uid("ret"), colportorId: me.id, itemId: itemSel, qtd: q,
      tipo: ehDevolucao ? "devolucao" : "retirada",
      criadoEm: new Date().toISOString(),
    };
    await setRetiradas([...(retiradas || []), nova]);
    setQtdSel(1);
    showToast(ehDevolucao ? `Devolução registrada: ${q}x ${item?.nome}.` : `Retirada registrada: ${q}x ${item?.nome}.`);
  }

  async function excluirMov(r) {
    // Apagar uma retirada reduz o disponível — só permitido se não ficar negativo.
    // Apagar uma devolução devolve ao disponível, então é sempre seguro.
    if (r.tipo !== "devolucao") {
      const disp = estoque[r.itemId]?.disponivel || 0;
      if (disp < r.qtd) {
        showToast("Não dá para apagar: parte desses livros já foi vendida ou devolvida.", "error");
        return;
      }
    }
    if (!confirm("Apagar este movimento do seu estoque?")) return;
    await setRetiradas((retiradas || []).filter((x) => x.id !== r.id));
    showToast("Movimento removido.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Resumo */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Package size={17} color={COL.terracota} />
          <h3 style={{ ...cardTitle, margin: 0, fontSize: 17 }}>Resumo</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <MiniStat icon={<Package size={16} />} label="Retirados" value={totalRetirado} />
          <MiniStat icon={<TrendingUp size={16} />} label="Vendidos" value={totalVendido} />
          <MiniStat icon={<ArrowLeft size={16} />} label="Devolvidos" value={totalDevolvido} />
          <MiniStat icon={<BookOpen size={16} />} label="Disponível" value={totalDisponivel} />
        </div>
      </div>

      {/* Registrar movimento */}
      <div style={card}>
        <h3 style={cardTitle}>Movimentar estoque</h3>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {[{ id: "retirada", label: "Retirei" }, { id: "devolucao", label: "Devolvi" }].map((opt) => (
            <button key={opt.id} onClick={() => setTipoMov(opt.id)} className="lib-btn" style={{
              flex: 1, padding: "10px 6px", borderRadius: 10,
              border: `1.5px solid ${tipoMov === opt.id ? COL.terracota : COL.areiaEscura}`, cursor: "pointer",
              background: tipoMov === opt.id ? `${COL.terracota}14` : COL.branco,
              color: tipoMov === opt.id ? COL.terracota : COL.grafite, fontWeight: 700, fontSize: 13,
            }}>
              {opt.label}
            </button>
          ))}
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#8A8478", lineHeight: 1.5 }}>
          {ehDevolucao
            ? "Registre os livros que você devolveu ao depósito. Eles saem do seu estoque disponível."
            : "Adicione os livros que você retirou do depósito. Eles entram no seu estoque e vão sendo abatidos conforme você envia os relatórios."}
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <select value={itemSel} onChange={(e) => setItemSel(e.target.value)} style={{ ...inp, marginBottom: 0, flex: 1, fontSize: 13.5 }}>
            {CATALOGO.map((c) => {
              const d = estoque[c.id]?.disponivel || 0;
              return <option key={c.id} value={c.id}>{c.nome}{ehDevolucao ? ` (${d} disp.)` : ""}</option>;
            })}
          </select>
          <input type="number" min={1} value={qtdSel} onChange={(e) => setQtdSel(Number(e.target.value))} style={{ ...inp, marginBottom: 0, width: 56, textAlign: "center" }} />
          <button onClick={registrar} disabled={bloqueado} className="lib-btn" style={{
            background: bloqueado ? "#CFC6B5" : COL.terracota, color: COL.branco, border: "none",
            borderRadius: 10, width: 44, cursor: bloqueado ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Plus size={18} />
          </button>
        </div>
        {ehDevolucao && (
          <p style={{ margin: "8px 0 0", fontSize: 12, fontWeight: 700, color: dispSel <= 0 ? COL.vermelho : COL.oliva }}>
            {dispSel <= 0 ? "Sem saldo disponível deste título para devolver." : `Disponível para devolver: ${dispSel}`}
          </p>
        )}
      </div>

      {/* Estoque por título */}
      <div style={card}>
        <h3 style={cardTitle}>Meu estoque</h3>
        {itensComMov.length === 0 ? (
          <p style={{ color: "#B0A99A", fontSize: 13, textAlign: "center", padding: "14px 0" }}>
            Você ainda não registrou nenhum movimento.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {itensComMov.map((it) => {
              const negativo = it.disponivel < 0;
              return (
                <div key={it.id} style={{ borderBottom: `1px solid ${COL.areia}`, paddingBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: COL.grafite }}>{it.nome}</p>
                    <span style={{
                      fontSize: 13, fontWeight: 800, whiteSpace: "nowrap",
                      padding: "3px 10px", borderRadius: 20,
                      background: negativo ? `${COL.vermelho}14` : `${COL.oliva}14`,
                      color: negativo ? COL.vermelho : COL.oliva,
                    }}>
                      {it.disponivel} disp.
                    </span>
                  </div>
                  <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "#B0A99A" }}>
                    Retirados {it.retirado} · Vendidos {it.vendido}{it.devolvido > 0 ? ` · Devolvidos ${it.devolvido}` : ""}
                    {negativo && " · vendeu mais do que retirou"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Histórico de movimentos */}
      {minhasMovimentacoes.length > 0 && (
        <div style={card}>
          <h3 style={cardTitle}>Movimentos registrados</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {minhasMovimentacoes.map((r) => {
              const item = CATALOGO.find((c) => c.id === r.itemId);
              const dev = r.tipo === "devolucao";
              return (
                <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COL.areia, borderRadius: 9, padding: "9px 12px" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: COL.grafite }}>
                      <span style={{ color: dev ? COL.vermelho : COL.oliva, fontWeight: 800 }}>{dev ? "Devolução" : "Retirada"}</span> · {r.qtd}x {item?.nome || "Item"}
                    </p>
                    <p style={{ fontSize: 11, color: "#8A8478", margin: 0 }}>{r.criadoEm ? new Date(r.criadoEm).toLocaleDateString("pt-BR") : ""}</p>
                  </div>
                  <button onClick={() => excluirMov(r)} style={{ background: "none", border: "none", color: COL.vermelho, cursor: "pointer" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const DIAS_VISITA = ["Qualquer dia", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

function TabEstudosColportor({ me, candidatos, setCandidatos, showToast }) {
  const [nome, setNome] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [ponto, setPonto] = useState("");
  const [melhorDia, setMelhorDia] = useState(DIAS_VISITA[0]);
  const [religiao, setReligiao] = useState("");

  const meusEnviados = (candidatos || [])
    .filter((c) => c.colportorId === me.id)
    .slice().reverse();

  async function enviar() {
    if (!nome.trim()) {
      showToast("Informe ao menos o nome do candidato.", "error");
      return;
    }
    const novo = {
      id: uid("cand"), colportorId: me.id, colportorNome: me.nome,
      categoria: me.categoria, campanhaId: me.campanhaId || null,
      nome: nome.trim(), rua: rua.trim(), numero: numero.trim(), bairro: bairro.trim(),
      cidade: cidade.trim(), ponto: ponto.trim(), melhorDia, religiao: religiao.trim(),
      confirmado: false, criadoEm: new Date().toISOString(),
    };
    await setCandidatos([...(candidatos || []), novo]);
    showToast("Candidato enviado ao diretor! 🙏");
    setNome(""); setRua(""); setNumero(""); setBairro(""); setCidade(""); setPonto(""); setMelhorDia(DIAS_VISITA[0]); setReligiao("");
  }

  async function excluir(id) {
    if (!confirm("Apagar este candidato enviado?")) return;
    await setCandidatos((candidatos || []).filter((c) => c.id !== id));
    showToast("Candidato removido.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <MapPin size={17} color={COL.terracota} />
          <h3 style={{ ...cardTitle, margin: 0 }}>Candidato a estudo bíblico</h3>
        </div>
        <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "#8A8478", lineHeight: 1.5 }}>
          Encontrou alguém interessado em estudar a Bíblia? Cadastre aqui — pode enviar quantos quiser, todo dia. O diretor recebe na hora.
        </p>

        <label style={lbl}>Nome do cliente</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} style={inp} placeholder="Nome completo" />

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 2 }}>
            <label style={lbl}>Rua</label>
            <input value={rua} onChange={(e) => setRua(e.target.value)} style={inp} placeholder="Nome da rua" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Número</label>
            <input value={numero} onChange={(e) => setNumero(e.target.value)} style={inp} placeholder="Nº" />
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Bairro</label>
            <input value={bairro} onChange={(e) => setBairro(e.target.value)} style={inp} placeholder="Bairro" />
          </div>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Cidade</label>
            <input value={cidade} onChange={(e) => setCidade(e.target.value)} style={inp} placeholder="Cidade" />
          </div>
        </div>

        <label style={lbl}>Ponto de referência</label>
        <input value={ponto} onChange={(e) => setPonto(e.target.value)} style={inp} placeholder="Ex.: perto da praça, casa azul..." />

        <label style={lbl}>Melhor dia para visita</label>
        <select value={melhorDia} onChange={(e) => setMelhorDia(e.target.value)} style={inp}>
          {DIAS_VISITA.map((d) => <option key={d}>{d}</option>)}
        </select>

        <label style={lbl}>Religião atual</label>
        <input value={religiao} onChange={(e) => setReligiao(e.target.value)} style={inp} placeholder="Ex.: Católica, Evangélica, Nenhuma..." />

        <button onClick={enviar} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota, marginTop: 6 }}>
          <Plus size={16} /> Enviar candidato
        </button>
      </div>

      {meusEnviados.length > 0 && (
        <div style={card}>
          <h3 style={cardTitle}>Enviados por você ({meusEnviados.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {meusEnviados.map((c) => (
              <div key={c.id} style={{ background: COL.areia, borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: COL.grafite }}>{c.nome}</p>
                  <button onClick={() => excluir(c.id)} style={{ background: "none", border: "none", color: COL.vermelho, cursor: "pointer", flexShrink: 0 }}>
                    <Trash2 size={15} />
                  </button>
                </div>
                <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#8A8478" }}>
                  {[c.rua && `${c.rua}${c.numero ? ", " + c.numero : ""}`, c.bairro, c.cidade].filter(Boolean).join(" · ") || "Endereço não informado"}
                </p>
                {c.ponto && <p style={{ margin: "2px 0 0", fontSize: 12, color: "#B0A99A" }}>Ref.: {c.ponto}</p>}
                <p style={{ margin: "4px 0 0", fontSize: 11.5, color: "#B0A99A" }}>
                  Visita: {c.melhorDia}{c.religiao ? ` · ${c.religiao}` : ""} · {new Date(c.criadoEm).toLocaleDateString("pt-BR")}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NumberField({ label, icon, value, onChange }) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 6, color: "#8A8478", fontSize: 11.5, fontWeight: 600 }}>
        {icon} {label}
      </div>
      <input type="number" min={0} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ ...inp, marginBottom: 0, textAlign: "center", fontSize: 18, fontWeight: 700, color: COL.petroleo, padding: "10px 4px" }} />
    </div>
  );
}

/* Campo de meta em reais: prefixo "R$" fixo + máscara de centavos em tempo
   real (digita 500000 -> mostra 5.000,00). `value` e `onChange` trabalham
   sempre em número de reais (ex.: 5000), não em string. */
function CurrencyInput({ value, onChange, placeholder }) {
  const centavos = Math.round((Number(value) || 0) * 100);
  const texto = centavos > 0 ? centavosParaTexto(centavos) : "";

  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <span style={{
        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
        color: "#8A8478", fontWeight: 700, fontSize: 15, pointerEvents: "none",
      }}>R$</span>
      <input
        type="text" inputMode="numeric" value={texto}
        onChange={(e) => onChange(textoParaCentavos(e.target.value) / 100)}
        placeholder={placeholder || "0,00"}
        style={{ ...inp, marginBottom: 0, paddingLeft: 40 }}
      />
    </div>
  );
}
function MiniStat({ icon, label, value }) {
  return (
    <div style={{ background: COL.areia, borderRadius: 10, padding: "10px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, color: COL.terracota, marginBottom: 4 }}>
        {icon}<span style={{ fontSize: 11, fontWeight: 700, color: "#8A8478" }}>{label}</span>
      </div>
      <p style={{ margin: 0, fontWeight: 700, color: COL.petroleo, fontSize: 16, fontFamily: FONT_SERIF }}>{value}</p>
    </div>
  );
}

const card = { background: COL.branco, borderRadius: 16, padding: 18, boxShadow: "0 4px 14px rgba(27,58,75,0.07)" };
const cardTitle = { fontFamily: FONT_SERIF, fontSize: 18.5, fontWeight: 800, color: COL.petroleo, margin: "0 0 14px", letterSpacing: 0.1 };

function TabRankingColportor({ ranking, myId, semanas, me, relatorios, colportores, campanhas = [], oficialInicial = null }) {
  const [periodoSelecionado, setPeriodoSelecionado] = useState(null); // { inicio, fim, label } | null
  const [fonte, setFonte] = useState(oficialInicial || "atual"); // "atual" | id de campanha oficial

  // Quanto o colportor vendeu (em R$) dentro de um período, usando os
  // relatórios diários que ele já envia normalmente.
  function vendidoNoPeriodo(inicio, fim) {
    return relatorios
      .filter((r) => r.colportorId === me.id && r.data >= inicio && r.data <= fim)
      .reduce((s, r) => s + (r.vendas || []).reduce((sv, v) => {
        const item = CATALOGO.find((c) => c.id === v.itemId);
        return sv + (item?.preco || 0) * v.qtd;
      }, 0), 0);
  }

  // Ranking entre colegas da mesma categoria, vendido apenas dentro de um período
  function vendidoDeColportorNoPeriodo(colportorId, inicio, fim) {
    return relatorios
      .filter((r) => r.colportorId === colportorId && r.data >= inicio && r.data <= fim)
      .reduce((s, r) => s + (r.vendas || []).reduce((sv, v) => {
        const item = CATALOGO.find((c) => c.id === v.itemId);
        return sv + (item?.preco || 0) * v.qtd;
      }, 0), 0);
  }

  const minhasCampanhas = semanas.filter((s) => (s.categoriaAplicavel || "Estudantes") === me.categoria);

  // Opções de período para o seletor: semanas (Estudantes/Sonhando Alto) ou
  // meses (Permanentes), a partir da campanha em andamento/mais recente, ou
  // do ano corrente no caso de Permanentes (que não tem campanha).
  let opcoesPeriodo = [];
  if (me.categoria === "Permanentes") {
    const hojeDate = new Date();
    const inicioAno = `${hojeDate.getFullYear()}-01-01`;
    const fimAno = `${hojeDate.getFullYear()}-12-31`;
    opcoesPeriodo = mesesDoPeriodo(inicioAno, fimAno).filter((m) => m.inicio <= todayStr());
  } else if (minhasCampanhas.length > 0) {
    const hoje = todayStr();
    const campanhaRef = minhasCampanhas.find((c) => hoje >= c.inicio && hoje <= c.fim) || minhasCampanhas[minhasCampanhas.length - 1];
    opcoesPeriodo = semanasDoPeriodo(campanhaRef.inicio, campanhaRef.fim).filter((s) => s.inicio <= todayStr());
  }

  const rankingDoPeriodo = periodoSelecionado
    ? colportores
        .filter((c) => c.categoria === me.categoria && c.status !== "pendente")
        .map((c) => ({ ...c, vendido: vendidoDeColportorNoPeriodo(c.id, periodoSelecionado.inicio, periodoSelecionado.fim) }))
        .sort((a, b) => b.vendido - a.vendido)
    : [];

  // Campanhas oficiais visíveis para esta pessoa: as da categoria dela e também
  // QUALQUER campanha passada cujo ranking tenha o nome dela (mesmo de outra
  // categoria). Assim, quem aparece no razão de campanhas anteriores ganha
  // acesso ao resultado e ranking delas só pelo nome.
  const oficiaisDaCategoria = (() => {
    const map = new Map();
    (campanhas || []).forEach((c) => {
      if (!c.resultados || c.resultados.length === 0) return;
      const noNome = c.resultados.some((r) => normNome(r.nome) === normNome(me.nome));
      if (noNome || c.categoria === me.categoria) map.set(c.id, c);
    });
    return [...map.values()];
  })();
  const campOficialSel = fonte !== "atual" ? oficiaisDaCategoria.find((c) => c.id === fonte) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {oficiaisDaCategoria.length > 0 && (
        <div style={card}>
          <h3 style={cardTitle}>Qual ranking ver</h3>
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            <button onClick={() => setFonte("atual")} className="lib-btn" style={{
              padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${fonte === "atual" ? COL.terracota : COL.areiaEscura}`,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              background: fonte === "atual" ? COL.terracota : COL.branco, color: fonte === "atual" ? COL.branco : COL.grafite,
              fontWeight: 700, fontSize: 12.5,
            }}>
              Atual
            </button>
            {oficiaisDaCategoria.map((c) => {
              const ativo = fonte === c.id;
              return (
                <button key={c.id} onClick={() => setFonte(c.id)} className="lib-btn" style={{
                  padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${ativo ? COL.terracota : COL.areiaEscura}`,
                  cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  background: ativo ? COL.terracota : COL.branco, color: ativo ? COL.branco : COL.grafite,
                  fontWeight: 700, fontSize: 12.5,
                }}>
                  {c.nome}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {campOficialSel ? (
        <RankingOficial campanha={campOficialSel} meNome={me.nome} />
      ) : (
      <>
      <div style={card}>
        <h3 style={cardTitle}>Ranking da sua categoria</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ranking.map((c, i) => (
            <div key={c.id} className="lib-fade-in lib-rank-row" style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10,
              background: c.id === myId ? `${COL.terracota}14` : COL.areia,
              border: c.id === myId ? `1.5px solid ${COL.terracota}` : "1.5px solid transparent",
              animationDelay: `${i * 0.04}s`,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: i === 0 ? "#D4A017" : i === 1 ? "#9CA3AF" : i === 2 ? "#B87333" : COL.areiaEscura,
                color: i < 3 ? COL.branco : COL.grafite, fontWeight: 800, fontSize: 13, flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: COL.grafite, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {c.nome}{c.id === myId ? " (você)" : ""}
                </p>
              </div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 13.5, color: COL.petroleo, fontFamily: FONT_SERIF, flexShrink: 0 }}>{fmt(c.vendido)}</p>
            </div>
          ))}
        </div>
        <LinhaTotal valor={ranking.reduce((s, c) => s + (c.vendido || 0), 0)} />
      </div>

      {opcoesPeriodo.length > 0 && (
        <div style={card} className="lib-fade-in">
          <h3 style={cardTitle}>Ranking por {me.categoria === "Permanentes" ? "mês" : "semana"}</h3>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14 }}>
            {opcoesPeriodo.map((p) => {
              const ativo = periodoSelecionado?.inicio === p.inicio && periodoSelecionado?.fim === p.fim;
              return (
                <button
                  key={p.inicio}
                  onClick={() => setPeriodoSelecionado(ativo ? null : p)}
                  className="lib-btn"
                  style={{
                    padding: "7px 12px", borderRadius: 20, border: `1.5px solid ${ativo ? COL.terracota : COL.areiaEscura}`,
                    cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                    background: ativo ? COL.terracota : COL.branco, color: ativo ? COL.branco : COL.grafite,
                    fontWeight: 700, fontSize: 12,
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {!periodoSelecionado ? (
            <p style={{ fontSize: 12.5, color: "#B0A99A", textAlign: "center", padding: "6px 0" }}>
              Escolha {me.categoria === "Permanentes" ? "um mês" : "uma semana"} para ver o ranking daquele período.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 11.5, color: "#8A8478", margin: "0 0 10px" }}>
                {formatarDataBR(periodoSelecionado.inicio)} a {formatarDataBR(periodoSelecionado.fim)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {rankingDoPeriodo.map((c, i) => (
                  <div key={c.id} className="lib-fade-in lib-rank-row" style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10,
                    background: c.id === myId ? `${COL.terracota}14` : COL.areia,
                    border: c.id === myId ? `1.5px solid ${COL.terracota}` : "1.5px solid transparent",
                    animationDelay: `${i * 0.04}s`,
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: i === 0 ? "#D4A017" : i === 1 ? "#9CA3AF" : i === 2 ? "#B87333" : COL.areiaEscura,
                      color: i < 3 ? COL.branco : COL.grafite, fontWeight: 800, fontSize: 13, flexShrink: 0,
                    }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: COL.grafite, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {c.nome}{c.id === myId ? " (você)" : ""}
                      </p>
                    </div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 13.5, color: COL.petroleo, fontFamily: FONT_SERIF, flexShrink: 0 }}>{fmt(c.vendido)}</p>
                  </div>
                ))}
              </div>
              <LinhaTotal valor={rankingDoPeriodo.reduce((s, c) => s + (c.vendido || 0), 0)} />
            </>
          )}
        </div>
      )}

      {minhasCampanhas.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {minhasCampanhas.slice().reverse().map((s) => {
            const tipo = s.categoriaAplicavel === "Permanentes" ? "mes_maximo" : (s.tipoCampanha || "periodo");
            const vendido = vendidoNoPeriodo(s.inicio, s.fim);
            const hoje = todayStr();
            const status = hoje < s.inicio ? "Em breve" : hoje > s.fim ? "Encerrada" : "Em andamento";
            const statusCor = hoje < s.inicio ? COL.petroleo : hoje > s.fim ? "#B0A99A" : COL.oliva;

            // Premiações a mostrar dependem do tipo
            let premiacoesParaMostrar = [];
            const niveisOrdenados = tipo === "mes_maximo" ? (s.niveisMeta || []).slice().sort((a, b) => b.meta - a.meta) : [];
            const nivelAlcancado = tipo === "mes_maximo" ? niveisOrdenados.find((n) => vendido >= n.meta) : null;
            const proximoNivel = tipo === "mes_maximo"
              ? niveisOrdenados.slice().reverse().find((n) => vendido < n.meta)
              : null;
            if (tipo === "mes_maximo" && nivelAlcancado?.descricao) premiacoesParaMostrar = [nivelAlcancado];
            else if (tipo === "periodo") premiacoesParaMostrar = s.premiacoes || [];
            else if (tipo === "segmento" && s.premiacoesPorSegmento?.[me.segmento]?.descricao) premiacoesParaMostrar = [s.premiacoesPorSegmento[me.segmento]];

            const meuGrupo = tipo === "grupo" ? (s.grupos || []).find((g) => g.colportorIds.includes(me.id)) : null;
            if (meuGrupo?.premiacaoDescricao) premiacoesParaMostrar = [{ foto: meuGrupo.premiacaoFoto, descricao: meuGrupo.premiacaoDescricao }];

            return (
              <div key={s.id} className="lib-pop-in" style={card}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Flame size={16} color={COL.terracota} />
                  <h3 style={{ ...cardTitle, margin: 0 }}>{s.titulo}</h3>
                </div>
                <p style={{ fontSize: 12, color: "#8A8478", margin: "2px 0 12px" }}>
                  {formatarDataBR(s.inicio)} a {formatarDataBR(s.fim)} ·{" "}
                  <span style={{ color: statusCor, fontWeight: 700 }}>{status}</span>
                </p>

                {tipo === "mes_maximo" && (
                  <>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
                      <span style={{ fontSize: 11.5, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                        Você vendeu
                      </span>
                      <span style={{ fontSize: 14, fontWeight: 800, color: COL.petroleo, fontFamily: FONT_SERIF }}>{fmt(vendido)}</span>
                    </div>

                    {nivelAlcancado ? (
                      <div style={{
                        background: `${COL.oliva}14`, border: `1.5px solid ${COL.oliva}`, borderRadius: 10,
                        padding: "10px 12px", marginBottom: 10,
                      }}>
                        <p style={{ margin: 0, fontSize: 12.5, fontWeight: 800, color: COL.oliva }}>
                          🎉 Nível batido — {fmt(nivelAlcancado.meta)}
                        </p>
                        {nivelAlcancado.descricao && (
                          <p style={{ margin: "3px 0 0", fontSize: 12, color: COL.grafite }}>{nivelAlcancado.descricao}</p>
                        )}
                      </div>
                    ) : (
                      <p style={{ fontSize: 12, color: "#8A8478", margin: "0 0 10px" }}>
                        Ainda não bateu nenhum nível de meta desta campanha.
                      </p>
                    )}

                    {proximoNivel && (
                      <div style={{ paddingTop: 10, borderTop: `1px solid ${COL.areia}` }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                          <span style={{ fontSize: 11.5, color: "#8A8478", fontWeight: 700 }}>Próximo nível</span>
                          <span style={{ fontSize: 12, color: "#8A8478" }}>{fmt(vendido)} de {fmt(proximoNivel.meta)}</span>
                        </div>
                        {(() => {
                          const pct = proximoNivel.meta > 0 ? Math.min(100, (vendido / proximoNivel.meta) * 100) : 0;
                          return (
                            <div style={{ height: 10, background: COL.areia, borderRadius: 8, overflow: "hidden" }}>
                              <div style={{
                                height: "100%", width: `${pct}%`, borderRadius: 8,
                                background: `linear-gradient(90deg, ${COL.terracota}, ${COL.terracotaClaro})`,
                              }} />
                            </div>
                          );
                        })()}
                        {proximoNivel.descricao && (
                          <p style={{ fontSize: 11.5, color: "#8A8478", margin: "6px 0 0" }}>Premiação: {proximoNivel.descricao}</p>
                        )}
                      </div>
                    )}
                  </>
                )}

                {tipo === "segmento" && (() => {
                  const metaSegmento = s.metasPorSegmento?.[me.segmento] || 0;
                  const unidade = unidadeDoSegmento(me.segmento);
                  const pct = metaSegmento > 0 && unidade === "reais" ? Math.min(100, (vendido / metaSegmento) * 100) : 0;
                  return metaSegmento > 0 ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                        <span style={{ fontSize: 11.5, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                          Sua meta · {me.segmento}
                        </span>
                        <span style={{ fontSize: 12.5, color: "#8A8478" }}>
                          {unidade === "quantidade" ? `meta: ${formatarValorSegmento(metaSegmento, me.segmento)}` : `${fmt(vendido)} de ${fmt(metaSegmento)}`}
                        </span>
                      </div>
                      {unidade === "reais" ? (
                        <>
                          <div style={{ height: 12, background: COL.areia, borderRadius: 8, overflow: "hidden" }}>
                            <div className={`lib-progress-fill ${pct >= 100 ? "shimmer" : ""}`} style={{
                              height: "100%", width: `${pct}%`, borderRadius: 8,
                              background: pct >= 100 ? COL.oliva : `linear-gradient(90deg, ${COL.terracota}, ${COL.terracotaClaro})`,
                            }} />
                          </div>
                          <p style={{ fontSize: 12, fontWeight: 800, margin: "8px 0 0", color: pct >= 100 ? COL.oliva : COL.terracota }}>
                            Só o maior vendedor do segmento ganha, batendo a meta mínima.
                          </p>
                        </>
                      ) : (
                        <p style={{ fontSize: 12, color: "#8A8478", margin: 0, lineHeight: 1.5 }}>
                          Registre suas palestras agendadas com o líder ou diretor. Só o maior número no segmento ganha.
                        </p>
                      )}
                    </>
                  ) : (
                    <p style={{ fontSize: 12.5, color: "#B0A99A", margin: 0 }}>
                      Nenhuma meta cadastrada para o segmento {me.segmento} nesta campanha.
                    </p>
                  );
                })()}

                {tipo === "grupo" && (
                  meuGrupo ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                        <span style={{ fontSize: 11.5, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                          {meuGrupo.nome} · meta coletiva
                        </span>
                      </div>
                      <p style={{ fontSize: 12.5, color: "#8A8478", margin: "0 0 8px" }}>
                        Some as vendas de todo o grupo ({meuGrupo.colportorIds.length} colportores) até {fmt(meuGrupo.meta)}.
                      </p>
                      <p style={{ fontSize: 12, color: COL.terracota, margin: 0, fontWeight: 700 }}>
                        Confira com seu líder o total já vendido pelo grupo.
                      </p>
                    </>
                  ) : (
                    <p style={{ fontSize: 12.5, color: "#B0A99A", margin: 0 }}>
                      Você não está em nenhum grupo desta campanha.
                    </p>
                  )
                )}

                {tipo === "periodo" && (() => {
                  const metaSegmento = s.metasPorSegmento?.[me.segmento] || 0;
                  const unidade = unidadeDoSegmento(me.segmento);
                  const pct = metaSegmento > 0 && unidade === "reais" ? Math.min(100, (vendido / metaSegmento) * 100) : 0;
                  return metaSegmento > 0 ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                        <span style={{ fontSize: 11.5, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                          Sua meta · {me.segmento}
                        </span>
                        <span style={{ fontSize: 12.5, color: "#8A8478" }}>
                          {unidade === "quantidade" ? `meta: ${formatarValorSegmento(metaSegmento, me.segmento)}` : `${fmt(vendido)} de ${fmt(metaSegmento)}`}
                        </span>
                      </div>
                      {unidade === "reais" && (
                        <>
                          <div style={{ height: 12, background: COL.areia, borderRadius: 8, overflow: "hidden" }}>
                            <div className={`lib-progress-fill ${pct >= 100 ? "shimmer" : ""}`} style={{
                              height: "100%", width: `${pct}%`, borderRadius: 8,
                              background: pct >= 100 ? COL.oliva : `linear-gradient(90deg, ${COL.terracota}, ${COL.terracotaClaro})`,
                            }} />
                          </div>
                          <p style={{ fontSize: 12, fontWeight: 800, margin: "8px 0 0", color: pct >= 100 ? COL.oliva : COL.terracota }}>
                            {pct.toFixed(0)}% da meta {pct >= 100 ? "— Meta batida! 🎉" : "alcançada"}
                          </p>
                        </>
                      )}
                    </>
                  ) : (
                    <p style={{ fontSize: 12.5, color: "#B0A99A", margin: 0 }}>
                      Nenhuma meta cadastrada para o segmento {me.segmento} nesta campanha.
                    </p>
                  );
                })()}

                {premiacoesParaMostrar.length > 0 && (
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${COL.areia}` }}>
                    <p style={{ margin: "0 0 8px", fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>Premiações</p>
                    <div style={{ display: "flex", gap: 10, overflowX: "auto" }}>
                      {premiacoesParaMostrar.map((p, idx) => (
                        <div key={p.id || idx} style={{ flexShrink: 0, width: 78, textAlign: "center" }}>
                          {p.foto ? (
                            <img src={p.foto} alt="" style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", margin: "0 auto" }} />
                          ) : (
                            <div style={{ width: 60, height: 60, borderRadius: 10, background: COL.areia, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Award size={20} color={COL.terracota} />
                            </div>
                          )}
                          <p style={{ fontSize: 10, color: "#8A8478", margin: "4px 0 0", lineHeight: 1.3 }}>{p.descricao}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      </>
      )}
    </div>
  );
}

function TabHistorico({ me, relatorios, myStats }) {
  const meus = relatorios.filter((r) => r.colportorId === me.id).sort((a, b) => b.data.localeCompare(a.data));
  const chartData = meus.slice(0, 14).reverse().map((r) => {
    const total = (r.vendas || []).reduce((s, v) => {
      const item = CATALOGO.find((c) => c.id === v.itemId);
      return s + (item?.preco || 0) * v.qtd;
    }, 0);
    return { dia: r.data.slice(5), valor: total };
  });

  const topLivros = Object.entries(myStats.porLivro).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={card}>
        <h3 style={cardTitle}>Vendas por dia</h3>
        {chartData.length === 0 ? (
          <p style={{ color: "#B0A99A", fontSize: 13, textAlign: "center" }}>Sem dados ainda.</p>
        ) : (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEE6D8" vertical={false} />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: "#8A8478" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#8A8478" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(v) => fmt(v)} contentStyle={{ fontSize: 12, borderRadius: 8 }} />
              <Bar dataKey="valor" fill={COL.terracota} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div style={card}>
        <h3 style={cardTitle}>Seus livros mais vendidos</h3>
        {topLivros.length === 0 ? (
          <p style={{ color: "#B0A99A", fontSize: 13, textAlign: "center" }}>Sem vendas registradas.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {topLivros.map(([itemId, qtd]) => {
              const item = CATALOGO.find((c) => c.id === itemId);
              return (
                <div key={itemId} style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, padding: "6px 0" }}>
                  <span style={{ color: COL.grafite }}>{item?.nome}</span>
                  <span style={{ fontWeight: 700, color: COL.petroleo }}>{qtd}x</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ ...card, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <MiniStat icon={<HandHeart size={16} />} label="Ofertas (total)" value={myStats.totalOfertas} />
        <MiniStat icon={<HeartHandshake size={16} />} label="Orações (total)" value={myStats.totalOracoes} />
        <MiniStat icon={<BookOpen size={16} />} label="Livros entregues" value={myStats.totalEntregues} />
        <MiniStat icon={<TrendingUp size={16} />} label="Total vendido" value={fmt(myStats.totalVendido)} />
      </div>
    </div>
  );
}

const TIPOS_MENSAGEM = [
  { id: "sugestao", label: "Sugestão", cor: COL.petroleo },
  { id: "oracao", label: "Pedido de oração", cor: COL.oliva },
  { id: "reclamacao", label: "Reclamação", cor: COL.terracota },
];
const tipoMsgMeta = (id) => TIPOS_MENSAGEM.find((t) => t.id === id) || TIPOS_MENSAGEM[0];

function CardMensagemDiretor({ me, mensagens, setMensagens, showToast }) {
  const [tipo, setTipo] = useState("sugestao");
  const [texto, setTexto] = useState("");

  const meusEnviados = (mensagens || [])
    .filter((m) => m.colportorId === me.id)
    .sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""));

  async function enviar() {
    if (!texto.trim()) {
      showToast("Escreva sua mensagem antes de enviar.", "error");
      return;
    }
    const nova = {
      id: uid("msg"), colportorId: me.id, colportorNome: me.nome,
      categoria: me.categoria, campanhaId: me.campanhaId || null,
      tipo, texto: texto.trim(), criadoEm: new Date().toISOString(),
    };
    await setMensagens([...(mensagens || []), nova]);
    showToast("Mensagem enviada ao diretor! 🙏");
    setTexto("");
  }

  async function excluir(id) {
    if (!confirm("Apagar esta mensagem?")) return;
    await setMensagens((mensagens || []).filter((m) => m.id !== id));
    showToast("Mensagem removida.");
  }

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <MessageSquare size={16} color={COL.terracota} />
        <h3 style={{ ...cardTitle, margin: 0, fontSize: 16 }}>Fale com o diretor</h3>
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#8A8478", lineHeight: 1.5 }}>
        Mande uma sugestão, um pedido de oração ou uma reclamação. Chega direto pro diretor.
      </p>

      <label style={lbl}>Tipo</label>
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {TIPOS_MENSAGEM.map((t) => {
          const ativo = tipo === t.id;
          return (
            <button key={t.id} onClick={() => setTipo(t.id)} className="lib-btn" style={{
              flex: 1, padding: "9px 4px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 700,
              border: `1.5px solid ${ativo ? t.cor : COL.areiaEscura}`,
              background: ativo ? `${t.cor}14` : COL.branco, color: ativo ? t.cor : COL.grafite,
            }}>
              {t.label}
            </button>
          );
        })}
      </div>

      <label style={lbl}>Mensagem</label>
      <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={4}
        placeholder="Escreva aqui..."
        style={{ ...inp, resize: "vertical", minHeight: 90, fontFamily: FONT_SANS }} />

      <button onClick={enviar} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota, marginTop: 4 }}>
        <ChevronRight size={16} /> Enviar mensagem
      </button>

      {meusEnviados.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COL.areia}` }}>
          <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
            Enviadas por você
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {meusEnviados.map((m) => {
              const meta = tipoMsgMeta(m.tipo);
              return (
                <div key={m.id} style={{ background: COL.areia, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10.5, fontWeight: 800, color: meta.cor, background: `${meta.cor}1A`, padding: "2px 8px", borderRadius: 20 }}>{meta.label}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 11, color: "#B0A99A" }}>{new Date(m.criadoEm).toLocaleDateString("pt-BR")}</span>
                      <button onClick={() => excluir(m.id)} style={{ background: "none", border: "none", color: COL.vermelho, cursor: "pointer", padding: 0 }}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, color: COL.grafite, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{m.texto}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function CardIndicacao({ me, indicacoes, setIndicacoes, showToast }) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [igreja, setIgreja] = useState("");

  const minhas = (indicacoes || []).filter((i) => i.colportorId === me.id).slice().reverse();

  async function enviar() {
    if (!nome.trim() || !telefone.trim()) {
      showToast("Informe ao menos nome e telefone.", "error");
      return;
    }
    const nova = {
      id: uid("ind"), colportorId: me.id, colportorNome: me.nome,
      categoria: me.categoria, campanhaId: me.campanhaId || null,
      nome: nome.trim(), telefone: telefone.trim(), igreja: igreja.trim(),
      criadoEm: new Date().toISOString(),
    };
    await setIndicacoes([...(indicacoes || []), nova]);
    showToast(`Indicação enviada! +${PONTOS.indicacao} pontos. 🎉`);
    setNome(""); setTelefone(""); setIgreja("");
  }

  async function excluir(id) {
    if (!confirm("Apagar esta indicação? Você perde os pontos dela.")) return;
    await setIndicacoes((indicacoes || []).filter((i) => i.id !== id));
    showToast("Indicação removida.");
  }

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <UserPlus size={16} color={COL.terracota} />
        <h3 style={{ ...cardTitle, margin: 0, fontSize: 16 }}>Indicar novo colportor</h3>
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#8A8478", lineHeight: 1.5 }}>
        Conhece alguém que poderia ser colportor? Indique e ganhe {PONTOS.indicacao} pontos por indicação.
      </p>

      <label style={lbl}>Nome</label>
      <input value={nome} onChange={(e) => setNome(e.target.value)} style={inp} placeholder="Nome completo" />
      <label style={lbl}>Telefone</label>
      <input value={telefone} onChange={(e) => setTelefone(e.target.value)} style={inp} placeholder="(00) 00000-0000" />
      <label style={lbl}>Igreja local</label>
      <input value={igreja} onChange={(e) => setIgreja(e.target.value)} style={inp} placeholder="Igreja que frequenta" />

      <button onClick={enviar} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota, marginTop: 4 }}>
        <ChevronRight size={16} /> Enviar indicação
      </button>

      {minhas.length > 0 && (
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${COL.areia}` }}>
          <p style={{ margin: "0 0 10px", fontSize: 11.5, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>Suas indicações</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {minhas.map((i) => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COL.areia, borderRadius: 10, padding: "9px 12px" }}>
                <div style={{ minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: COL.grafite }}>{i.nome}</p>
                  <p style={{ margin: 0, fontSize: 11.5, color: "#8A8478" }}>{i.telefone}{i.igreja ? ` · ${i.igreja}` : ""}</p>
                </div>
                <button onClick={() => excluir(i.id)} style={{ background: "none", border: "none", color: COL.vermelho, cursor: "pointer", flexShrink: 0 }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CardSolicitarCampanha({ me, campanhas, colportores, lideres, solicitacoes, setSolicitacoes, showToast }) {
  const [aberto, setAberto] = useState(false);
  const [papel, setPapel] = useState("colportor"); // colportor | lider
  const [campanhaId, setCampanhaId] = useState("");
  const [colegio, setColegio] = useState(me.colegio || COLEGIOS[0]);
  const [curso, setCurso] = useState(me.curso || SEMESTRALIDADES.find((s) => s.colegio === (me.colegio || COLEGIOS[0]))?.curso || "");

  const tel = (me.telefone || "").replace(/\D/g, "");
  const minhasSolicitacoes = (solicitacoes || []).filter((s) => s.colportorRefId === me.id || s.pessoaTelefone?.replace(/\D/g, "") === tel);
  const pendentesMinhas = minhasSolicitacoes.filter((s) => s.status === "pendente");

  // Campanhas em que a pessoa já participa, separadas por papel.
  const jaColportor = colportores.filter((c) => (c.telefone || "").replace(/\D/g, "") === tel).map((c) => c.campanhaId);
  const jaLider = lideres.filter((l) => (l.telefone || "").replace(/\D/g, "") === tel).map((l) => l.campanhaId);
  const pendentesPorCampanha = pendentesMinhas.map((s) => `${s.campanhaId}:${s.papel}`);

  const disponiveis = campanhas.filter((c) => {
    if (campanhaEncerrada(c)) return false;
    if (pendentesPorCampanha.includes(`${c.id}:${papel}`)) return false;
    if (papel === "colportor") return !jaColportor.includes(c.id);
    return !jaLider.includes(c.id);
  });

  const cursosDoColegio = SEMESTRALIDADES.filter((s) => s.colegio === colegio);
  const meta = calcularMetaEstudante(colegio, curso);

  useEffect(() => {
    if (cursosDoColegio.length > 0 && !cursosDoColegio.some((c) => c.curso === curso)) {
      setCurso(cursosDoColegio[0].curso);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colegio]);

  useEffect(() => {
    if (disponiveis.length > 0 && !disponiveis.some((c) => c.id === campanhaId)) {
      setCampanhaId(disponiveis[0].id);
    }
    if (disponiveis.length === 0) setCampanhaId("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [papel, campanhas.length, colportores.length, lideres.length, solicitacoes.length]);

  // Só faz sentido para colportores de campanha (Estudantes/Sonhando Alto).
  if (me.categoria === "Permanentes") return null;

  async function enviar() {
    const camp = campanhas.find((c) => c.id === campanhaId);
    if (!camp) {
      showToast("Escolha uma campanha disponível.", "error");
      return;
    }
    if (!meta) {
      showToast("Não consegui calcular a meta. Confira colégio e curso.", "error");
      return;
    }
    const nova = {
      id: uid("sol"),
      colportorRefId: me.id,
      pessoaNome: me.nome,
      pessoaTelefone: me.telefone,
      campanhaId: camp.id,
      campanhaNome: camp.nome,
      categoria: camp.categoria,
      papel,
      colegio,
      curso: colegio === COLEGIO_OUTRO ? "" : curso,
      meta,
      status: "pendente",
      criadoEm: new Date().toISOString(),
    };
    await setSolicitacoes([...(solicitacoes || []), nova]);
    setAberto(false);
    showToast("Pedido enviado! O diretor vai avaliar e liberar.");
  }

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Sparkles size={16} color={COL.terracota} />
        <h3 style={{ ...cardTitle, margin: 0, fontSize: 16 }}>Participar de outra campanha</h3>
      </div>
      <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#8A8478", lineHeight: 1.5 }}>
        Sem novo cadastro: peça entrada em outra campanha como colportor ou como líder. O diretor precisa liberar.
      </p>

      {pendentesMinhas.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
          {pendentesMinhas.map((s) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: COL.areia, borderRadius: 10, padding: "9px 12px" }}>
              <span style={{ fontSize: 12.5, color: COL.grafite }}>
                {s.campanhaNome} · {s.papel === "lider" ? "líder" : "colportor"}
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: COL.terracota, textTransform: "uppercase", letterSpacing: 0.5 }}>Em análise</span>
            </div>
          ))}
        </div>
      )}

      {!aberto ? (
        <button onClick={() => setAberto(true)} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota }}>
          <Plus size={16} /> Pedir entrada em campanha
        </button>
      ) : (
        <div className="lib-fade-in">
          <label style={lbl}>Entrar como</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {[{ id: "colportor", label: "Colportor" }, { id: "lider", label: "Líder" }].map((opt) => (
              <button key={opt.id} onClick={() => setPapel(opt.id)} className="lib-btn" style={{
                flex: 1, padding: "11px 6px", borderRadius: 10,
                border: `1.5px solid ${papel === opt.id ? COL.terracota : COL.areiaEscura}`, cursor: "pointer",
                background: papel === opt.id ? `${COL.terracota}14` : COL.branco,
                color: papel === opt.id ? COL.terracota : COL.grafite, fontWeight: 700, fontSize: 13,
              }}>
                {opt.label}
              </button>
            ))}
          </div>

          {disponiveis.length === 0 ? (
            <p style={{ fontSize: 12.5, color: "#8A8478", background: COL.areia, borderRadius: 10, padding: "10px 12px", marginBottom: 14 }}>
              Não há campanhas disponíveis para esse papel no momento (você já participa de todas as ativas ou já tem pedido em análise).
            </p>
          ) : (
            <>
              <label style={lbl}>Campanha</label>
              <select value={campanhaId} onChange={(e) => setCampanhaId(e.target.value)} style={inp}>
                {disponiveis.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome} ({c.categoria})</option>
                ))}
              </select>

              <label style={lbl}>Colégio</label>
              <select value={colegio} onChange={(e) => setColegio(e.target.value)} style={inp}>
                {COLEGIOS.map((c) => <option key={c}>{c}</option>)}
              </select>

              {colegio !== COLEGIO_OUTRO && (
                <>
                  <label style={lbl}>Curso</label>
                  <select value={curso} onChange={(e) => setCurso(e.target.value)} style={inp}>
                    {cursosDoColegio.map((c) => <option key={c.curso} value={c.curso}>{c.curso}</option>)}
                  </select>
                </>
              )}

              <div style={{
                background: `${COL.oliva}14`, border: `1.5px solid ${COL.oliva}`, borderRadius: 12,
                padding: "12px 16px", margin: "4px 0 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 12.5, color: "#5C6B57", fontWeight: 700 }}>Meta nessa campanha</span>
                <span style={{ fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 18, color: COL.oliva }}>{fmt(meta)}</span>
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={enviar} disabled={disponiveis.length === 0} className="lib-btn" style={{
              flex: 1, padding: "11px 0", borderRadius: 10, border: "none",
              cursor: disponiveis.length === 0 ? "not-allowed" : "pointer",
              background: disponiveis.length === 0 ? "#CFC6B5" : COL.petroleo, color: COL.branco, fontWeight: 700, fontSize: 13.5,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>
              <Check size={15} /> Enviar pedido
            </button>
            <button onClick={() => setAberto(false)} className="lib-btn" style={{
              padding: "11px 16px", borderRadius: 10, border: `1.5px solid ${COL.areiaEscura}`,
              cursor: "pointer", background: COL.branco, color: COL.grafite, fontWeight: 700, fontSize: 13.5,
            }}>
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabAvisosColportor({ avisos, assistenciasPendentes, lideres, relatoriosLider, setRelatoriosLider, showToast }) {
  async function confirmar(r) {
    await setRelatoriosLider(relatoriosLider.map((x) => x.id === r.id ? { ...x, confirmado: true, confirmadoEm: new Date().toISOString() } : x));
    showToast("Assistência confirmada. Obrigado!");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {assistenciasPendentes.length > 0 && (
        <div style={{ ...card, border: `1.5px solid ${COL.terracota}`, background: `${COL.terracota}0A` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Bell size={16} color={COL.terracota} />
            <h3 style={{ ...cardTitle, margin: 0, fontSize: 16 }}>
              Confirme a assistência do seu líder
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {assistenciasPendentes.map((r) => {
              const lider = lideres.find((l) => l.id === r.liderId);
              return (
                <div key={r.id} style={{ background: COL.branco, borderRadius: 12, padding: 14 }}>
                  <p style={{ margin: 0, fontSize: 13.5, color: COL.grafite, lineHeight: 1.5 }}>
                    <strong>{lider?.nome || "Seu líder"}</strong> registrou que esteve com você em {new Date(r.data + "T00:00").toLocaleDateString("pt-BR")}:
                  </p>
                  <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#8A8478" }}>
                    {r.livros} livro{r.livros === 1 ? "" : "s"} · {r.ofertas} oferta{r.ofertas === 1 ? "" : "s"} · {r.oracoes} oração{r.oracoes === 1 ? "" : "ões"}
                  </p>
                  <button onClick={() => confirmar(r)} className="lib-btn" style={{
                    width: "100%", marginTop: 10, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer",
                    background: COL.oliva, color: COL.branco, fontWeight: 700, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <Check size={15} /> Confirmar
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={card}>
        <h3 style={cardTitle}>Avisos do líder</h3>
        {avisos.length === 0 ? (
          <p style={{ color: "#B0A99A", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Nenhum aviso por aqui ainda.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {avisos.map((a) => (
              <div key={a.id} style={{ borderLeft: `3px solid ${COL.terracota}`, paddingLeft: 12 }}>
                <p style={{ margin: 0, fontSize: 13.5, color: COL.grafite, lineHeight: 1.5 }}>{a.texto}</p>
                <p style={{ margin: "4px 0 0", fontSize: 11, color: "#B0A99A" }}>{new Date(a.criadoEm).toLocaleDateString("pt-BR")}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab, pendentesCount = 0 }) {
  const items = [
    { id: "hoje", icon: ClipboardList, label: "Hoje" },
    { id: "estoque", icon: Package, label: "Estoque" },
    { id: "estudos", icon: MapPin, label: "Estudos" },
    { id: "ranking", icon: Trophy, label: "Ranking" },
    { id: "historico", icon: BarChart3, label: "Histórico" },
    { id: "avisos", icon: Bell, label: "Avisos" },
  ];
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, background: COL.branco,
      display: "flex", borderTop: "1px solid #EEE6D8", padding: "8px 6px",
      boxShadow: "0 -4px 16px rgba(0,0,0,0.04)", zIndex: 50,
    }}>
      {items.map((it) => {
        const active = tab === it.id;
        const Icon = it.icon;
        const showBadge = it.id === "avisos" && pendentesCount > 0;
        return (
          <button key={it.id} onClick={() => setTab(it.id)} style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            background: "none", border: "none", cursor: "pointer", padding: "6px 0", position: "relative",
            color: active ? COL.terracota : "#B0A99A",
          }}>
            <div style={{ position: "relative" }}>
              <Icon size={19} strokeWidth={active ? 2.4 : 2} />
              {showBadge && (
                <span style={{
                  position: "absolute", top: -4, right: -8, background: COL.vermelho, color: COL.branco,
                  borderRadius: "50%", width: 15, height: 15, fontSize: 9.5, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${COL.branco}`,
                }}>
                  {pendentesCount}
                </span>
              )}
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================================
   ============   PAINEL DA LIDERANÇA   ========================
   ============================================================ */
function TabAssistenciaLider({ meuLider, colportoresEquipe, relatoriosLider, setRelatoriosLider, totalLivrosLider, metaLider, pctLider, showToast }) {
  const hoje = todayStr();
  const [dataRel, setDataRel] = useState(hoje);
  const [colportorId, setColportorId] = useState(colportoresEquipe[0]?.id || "");
  const [livros, setLivros] = useState(0);
  const [ofertas, setOfertas] = useState(0);
  const [oracoes, setOracoes] = useState(0);
  const batida = pctLider >= 100;

  const minData = `${hoje.slice(0, 4)}-01-01`;
  const maxData = hoje;

  const relatoriosDaData = relatoriosLider
    .filter((r) => r.liderId === meuLider.id && r.data === dataRel)
    .slice().reverse();

  async function enviar() {
    if (!colportorId) {
      showToast("Selecione o colportor que você assistiu.", "error");
      return;
    }
    if (!livros && !ofertas && !oracoes) {
      showToast("Registre ao menos um valor (livros, ofertas ou orações).", "error");
      return;
    }
    if (!dataRel || dataRel > maxData || dataRel < minData) {
      showToast("Escolha uma data válida (até hoje).", "error");
      return;
    }
    const novo = {
      id: uid("rl"), liderId: meuLider.id, colportorId,
      livros: Number(livros) || 0, ofertas: Number(ofertas) || 0, oracoes: Number(oracoes) || 0,
      data: dataRel, confirmado: false, criadoEm: new Date().toISOString(),
    };
    await setRelatoriosLider([...relatoriosLider, novo]);
    showToast(`Registro de ${formatarDataBR(dataRel)} enviado! O colportor vai confirmar.`);
    setLivros(0); setOfertas(0); setOracoes(0);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="lib-pop-in" style={{ background: COL.branco, borderRadius: 18, padding: 20, boxShadow: "0 14px 34px rgba(27,58,75,0.18)" }}>
        <p style={{ fontSize: 11.5, color: "#8A8478", margin: 0, letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 800 }}>Sua meta (acompanhamento)</p>
        <p style={{ fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 26, color: COL.petroleo, margin: "2px 0 0" }}>{totalLivrosLider} livro{totalLivrosLider === 1 ? "" : "s"}</p>
        <p style={{ fontSize: 12.5, color: "#8A8478", margin: "2px 0 10px", fontWeight: 600 }}>meta: {fmt(metaLider)} (em livros vendidos)</p>
        <div style={{ height: 10, background: COL.areia, borderRadius: 8, overflow: "hidden" }}>
          <div className={`lib-progress-fill ${batida ? "shimmer" : ""}`} style={{
            height: "100%", width: `${pctLider}%`, borderRadius: 8,
            background: batida ? COL.oliva : `linear-gradient(90deg, ${COL.terracota}, ${COL.terracotaClaro})`,
          }} />
        </div>
        <p style={{ fontSize: 12, color: "#8A8478", margin: "10px 0 0", lineHeight: 1.5 }}>
          Essa meta é só sua, de acompanhamento — não altera nem soma a meta dos colportores que você assiste.
        </p>
      </div>

      <div style={card}>
        <h3 style={cardTitle}>Registrar assistência</h3>
        {colportoresEquipe.length === 0 ? (
          <p style={{ color: "#B0A99A", fontSize: 13, textAlign: "center", padding: "10px 0" }}>
            Nenhum colportor aprovado na sua equipe ainda.
          </p>
        ) : (
          <>
            <label style={lbl}>Data</label>
            <input type="date" value={dataRel} min={minData} max={maxData} onChange={(e) => setDataRel(e.target.value)} style={inp} />
            {dataRel !== hoje && (
              <p style={{ margin: "-8px 0 12px", fontSize: 12, color: COL.terracota, fontWeight: 700 }}>
                Lançando um dia anterior: {formatarDataBR(dataRel)}.
              </p>
            )}

            <label style={lbl}>Colportor assistido</label>
            <select value={colportorId} onChange={(e) => setColportorId(e.target.value)} style={inp}>
              {colportoresEquipe.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 4 }}>
              <NumberField label="Livros vendidos" icon={<BookOpen size={15} />} value={livros} onChange={setLivros} />
              <NumberField label="Ofertas dadas" icon={<HandHeart size={15} />} value={ofertas} onChange={setOfertas} />
              <NumberField label="Orações" icon={<HeartHandshake size={15} />} value={oracoes} onChange={setOracoes} />
            </div>

            <button onClick={enviar} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota, marginTop: 14 }}>
              Enviar registro <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {relatoriosDaData.length > 0 && (
        <div style={card}>
          <h3 style={cardTitle}>Enviados em {formatarDataBR(dataRel)}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {relatoriosDaData.map((r) => {
              const colp = colportoresEquipe.find((c) => c.id === r.colportorId);
              return (
                <div key={r.id} style={{ background: COL.areia, borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: COL.grafite }}>{colp?.nome || "Colportor"}</p>
                    <span style={{
                      fontSize: 10.5, fontWeight: 800, padding: "3px 9px", borderRadius: 20,
                      background: r.confirmado ? `${COL.oliva}1A` : `${COL.terracota}1A`,
                      color: r.confirmado ? COL.oliva : COL.terracota,
                    }}>
                      {r.confirmado ? "Confirmado" : "Aguardando confirmação"}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#8A8478" }}>
                    {r.livros} livro{r.livros === 1 ? "" : "s"} · {r.ofertas} oferta{r.ofertas === 1 ? "" : "s"} · {r.oracoes} oração{r.oracoes === 1 ? "" : "ões"}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


function PainelConfirmacao({ relatorios, setRelatorios, candidatos, setCandidatos, colportores, idsEscopo, quemConfirma, showToast }) {
  const noEscopo = (cid) => !idsEscopo || idsEscopo.includes(cid);
  const relPend = relatorios.filter((r) => r.confirmado === false && noEscopo(r.colportorId)).sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""));
  const candPend = candidatos.filter((c) => c.confirmado === false && noEscopo(c.colportorId)).sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""));
  const nomeColp = (id) => colportores.find((c) => c.id === id)?.nome || "Colportor";
  const totalDia = (r) => (r.vendas || []).reduce((s, v) => { const it = CATALOGO.find((c) => c.id === v.itemId); return s + (it?.preco || 0) * v.qtd; }, 0);

  async function confirmarRel(r) {
    await setRelatorios(relatorios.map((x) => x.id === r.id ? { ...x, confirmado: true, confirmadoPor: quemConfirma } : x));
    showToast("Relatório confirmado — pontos liberados. 🎉");
  }
  async function confirmarTodosRel() {
    const ids = new Set(relPend.map((r) => r.id));
    await setRelatorios(relatorios.map((x) => ids.has(x.id) ? { ...x, confirmado: true, confirmadoPor: quemConfirma } : x));
    showToast(`${relPend.length} relatório(s) confirmado(s).`);
  }
  async function confirmarCand(c) {
    await setCandidatos(candidatos.map((x) => x.id === c.id ? { ...x, confirmado: true, confirmadoPor: quemConfirma } : x));
    showToast("Candidato confirmado — pontos liberados. 🎉");
  }

  const BotaoConfirmar = ({ onClick }) => (
    <button onClick={onClick} className="lib-btn" style={{
      padding: "8px 12px", borderRadius: 9, border: "none", background: COL.oliva, color: COL.branco,
      fontWeight: 700, fontSize: 12.5, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0,
    }}><Check size={14} /> Confirmar</button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <h3 style={{ ...cardTitle, margin: 0 }}>Relatórios a confirmar{relPend.length ? ` (${relPend.length})` : ""}</h3>
          {relPend.length > 1 && <button onClick={confirmarTodosRel} className="lib-btn" style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: COL.petroleo, color: COL.branco, fontWeight: 700, fontSize: 11.5, cursor: "pointer", flexShrink: 0 }}>Confirmar todos</button>}
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#8A8478", lineHeight: 1.5 }}>Os pontos do colportor só são liberados depois que você confirma o relatório.</p>
        {relPend.length === 0 ? (
          <p style={{ textAlign: "center", color: "#B0A99A", padding: 12 }}>Nenhum relatório pendente.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {relPend.map((r) => (
              <div key={r.id} style={{ background: COL.areia, borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: COL.grafite }}>{nomeColp(r.colportorId)}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8A8478" }}>Relatório de {formatarDataBR(r.data)}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8A8478" }}>{fmt(totalDia(r))} · {r.ofertas} ofertas · {r.oracoes} orações</p>
                  </div>
                  <BotaoConfirmar onClick={() => confirmarRel(r)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={card}>
        <h3 style={cardTitle}>Candidatos a confirmar{candPend.length ? ` (${candPend.length})` : ""}</h3>
        {candPend.length === 0 ? (
          <p style={{ textAlign: "center", color: "#B0A99A", padding: 12 }}>Nenhum candidato pendente.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {candPend.map((c) => (
              <div key={c.id} style={{ background: COL.areia, borderRadius: 12, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: COL.grafite }}>{c.nome}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8A8478" }}>Por {nomeColp(c.colportorId)}{[c.bairro, c.cidade].filter(Boolean).length ? ` · ${[c.bairro, c.cidade].filter(Boolean).join(", ")}` : ""}</p>
                  </div>
                  <BotaoConfirmar onClick={() => confirmarCand(c)} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LiderApp({ meuLider, colportores, setColportores, relatorios, setRelatorios, candidatos, setCandidatos, relatoriosLider, setRelatoriosLider, campanhas, onLogout, showToast, toast }) {
  const [tab, setTab] = useState("hoje");
  const stats = useStats(colportores, relatorios);

  const minhaEquipeTodos = colportores.filter((c) =>
    meuLider.campanhaId
      ? c.campanhaId === meuLider.campanhaId
      : c.categoria === meuLider.categoria
  );
  const pendentes = minhaEquipeTodos.filter((c) => c.status === "pendente");
  const aprovados = minhaEquipeTodos.filter((c) => c.status !== "pendente");
  const idsEquipe = aprovados.map((c) => c.id);
  const confirmarCount =
    relatorios.filter((r) => r.confirmado === false && idsEquipe.includes(r.colportorId)).length +
    candidatos.filter((c) => c.confirmado === false && idsEquipe.includes(c.colportorId)).length;

  const meusRelatorios = relatoriosLider.filter((r) => r.liderId === meuLider.id);
  const totalLivrosLider = meusRelatorios.reduce((s, r) => s + (r.livros || 0), 0);
  const metaLider = meuLider.meta || 0;
  const pctLider = metaLider > 0 ? Math.min(100, (totalLivrosLider / metaLider) * 100) : 0;

  async function aprovar(c) {
    await setColportores(colportores.map((col) => col.id === c.id ? { ...col, status: "aprovado" } : col));
    showToast(`${c.nome} foi aprovado e já pode entrar no sistema.`);
  }
  async function rejeitar(c) {
    if (!confirm(`Rejeitar a solicitação de ${c.nome}? O telefone ficará livre para um novo cadastro.`)) return;
    await setColportores(colportores.filter((col) => col.id !== c.id));
    showToast("Solicitação rejeitada e removida.");
  }
  async function excluir(id) {
    if (!confirm("Remover este colportor? Os relatórios enviados serão mantidos no histórico.")) return;
    await setColportores(colportores.filter((c) => c.id !== id));
    showToast("Colportor removido.");
  }

  const ranking = aprovados
    .map((c) => ({ ...c, vendido: stats[c.id]?.totalVendido || 0 }))
    .sort((a, b) => b.vendido - a.vendido);

  return (
    <div style={{ minHeight: "100vh", background: COL.areia, fontFamily: FONT_SANS }}>
      <Toast toast={toast} />
      <div style={{ background: COL.petroleo, padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }} className="lib-fade-in">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ animation: "floatLogo 5s ease-in-out infinite" }}>
            <LogoMark size={44} />
          </div>
          <div>
            <p style={{ color: COL.terracotaClaro, fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase", margin: 0, fontWeight: 800 }}>Líder · {meuLider.categoria}</p>
            <h1 style={{ color: COL.areia, fontFamily: FONT_SERIF, fontSize: 24, fontWeight: 800, margin: "3px 0 0" }}>{meuLider.nome.split(" ")[0]}</h1>
          </div>
        </div>
        <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: 9, cursor: "pointer", color: COL.areia }}>
          <LogOut size={17} />
        </button>
      </div>

      <div style={{ display: "flex", gap: 4, padding: "12px 14px 0", overflowX: "auto" }}>
        {[
          { id: "hoje", label: "Assistência", icon: HandHeart },
          { id: "equipe", label: "Minha Equipe", icon: Users },
          { id: "confirmar", label: "Confirmar", icon: Check },
          { id: "ranking", label: "Ranking", icon: Trophy },
        ].map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          const pendentesCount = t.id === "equipe" ? pendentes.length : t.id === "confirmar" ? confirmarCount : 0;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10,
              border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, position: "relative",
              background: active ? COL.terracota : COL.branco,
              color: active ? COL.branco : COL.grafite, fontWeight: 600, fontSize: 13,
            }}>
              <Icon size={15} /> {t.label}
              {pendentesCount > 0 && (
                <span style={{
                  position: "absolute", top: -5, right: -5, background: COL.vermelho, color: COL.branco,
                  borderRadius: "50%", width: 18, height: 18, fontSize: 10.5, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${COL.areia}`,
                }}>
                  {pendentesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 16, paddingBottom: 40 }} className="lib-fade-in" key={tab}>
        {tab === "hoje" && (
          <TabAssistenciaLider
            meuLider={meuLider}
            colportoresEquipe={aprovados}
            relatoriosLider={relatoriosLider}
            setRelatoriosLider={setRelatoriosLider}
            totalLivrosLider={totalLivrosLider}
            metaLider={metaLider}
            pctLider={pctLider}
            showToast={showToast}
          />
        )}

        {tab === "confirmar" && (
          <PainelConfirmacao
            relatorios={relatorios} setRelatorios={setRelatorios}
            candidatos={candidatos} setCandidatos={setCandidatos}
            colportores={colportores}
            idsEscopo={idsEquipe}
            quemConfirma={`Líder ${meuLider.nome}`}
            showToast={showToast}
          />
        )}

        {tab === "equipe" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {pendentes.length > 0 && (
              <div style={{ ...card, border: `1.5px solid ${COL.terracota}`, background: `${COL.terracota}0A` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <Bell size={16} color={COL.terracota} />
                  <h3 style={{ ...cardTitle, margin: 0, fontSize: 16 }}>
                    {pendentes.length} solicitação{pendentes.length === 1 ? "" : "ões"} pendente{pendentes.length === 1 ? "" : "s"}
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {pendentes.map((c) => {
                    const campanhaDoColportor = campanhas.find((camp) => camp.id === c.campanhaId);
                    return (
                      <div key={c.id} style={{ background: COL.branco, borderRadius: 12, padding: 14 }}>
                        <p style={{ margin: 0, fontWeight: 700, color: COL.grafite, fontSize: 14.5 }}>{c.nome}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#8A8478" }}>{c.telefone} · {c.segmento}</p>
                        <p style={{ margin: "1px 0 0", fontSize: 11.5, color: "#B0A99A" }}>
                          {c.categoria === "Permanentes"
                            ? `${c.tipoPermanente || "—"} · ${c.nivelPermanente || "—"}`
                            : `${campanhaDoColportor?.nome || "Sem campanha"} · ${c.colegio || "—"} · ${c.curso || "—"}`}
                        </p>
                        <p style={{ margin: "4px 0 0", fontSize: 12, color: COL.oliva, fontWeight: 700 }}>Meta: {fmt(c.meta)}</p>
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                          <button onClick={() => aprovar(c)} className="lib-btn" style={{
                            flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer",
                            background: COL.oliva, color: COL.branco, fontWeight: 700, fontSize: 13,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          }}>
                            <Check size={15} /> Aprovar
                          </button>
                          <button onClick={() => rejeitar(c)} className="lib-btn" style={{
                            flex: 1, padding: "9px 0", borderRadius: 9, border: `1.5px solid ${COL.vermelho}`, cursor: "pointer",
                            background: COL.branco, color: COL.vermelho, fontWeight: 700, fontSize: 13,
                            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          }}>
                            <X size={15} /> Rejeitar
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={card}>
              <h3 style={cardTitle}>Equipe de {meuLider.categoria}</h3>
              {aprovados.length === 0 ? (
                <p style={{ textAlign: "center", color: "#B0A99A", padding: 20 }}>Nenhum colportor aprovado ainda nessa categoria.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {aprovados.map((c) => {
                    const s = stats[c.id] || { totalVendido: 0 };
                    const pct = c.meta > 0 ? Math.min(100, (s.totalVendido / c.meta) * 100) : 0;
                    return (
                      <div key={c.id} style={{ borderBottom: "1px solid #F0E9DC", paddingBottom: 10 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <p style={{ margin: 0, fontWeight: 700, color: COL.grafite, fontSize: 14.5 }}>{c.nome}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8A8478" }}>{c.telefone} · {c.segmento}</p>
                          </div>
                          <button onClick={() => excluir(c.id)} style={{ ...iconBtn, color: COL.vermelho }}><Trash2 size={15} /></button>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <div style={{ height: 7, background: COL.areia, borderRadius: 6, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? COL.oliva : COL.terracota, borderRadius: 6 }} />
                          </div>
                          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                            <span style={{ fontSize: 11.5, color: "#8A8478" }}>{fmt(s.totalVendido)} de {fmt(c.meta)}</span>
                            <span style={{ fontSize: 11.5, fontWeight: 700, color: pct >= 100 ? COL.oliva : COL.terracota }}>{pct.toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "ranking" && (
          <div style={card}>
            <h3 style={cardTitle}>Ranking de {meuLider.categoria}</h3>
            {ranking.length === 0 ? (
              <p style={{ textAlign: "center", color: "#B0A99A", padding: 20 }}>Nenhum colportor para exibir ainda.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {ranking.map((c, i) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderBottom: i < ranking.length - 1 ? "1px solid #F0E9DC" : "none" }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: i === 0 ? "#D4A017" : i === 1 ? "#9CA3AF" : i === 2 ? "#B87333" : COL.areia,
                      color: i < 3 ? COL.branco : COL.grafite, fontWeight: 800, fontSize: 13, flexShrink: 0,
                    }}>{i + 1}</div>
                    <p style={{ flex: 1, margin: 0, fontWeight: 600, fontSize: 13.5, color: COL.grafite }}>{c.nome}</p>
                    <p style={{ margin: 0, fontWeight: 800, color: COL.petroleo, fontFamily: FONT_SERIF, fontSize: 14 }}>{fmt(c.vendido)}</p>
                  </div>
                ))}
                <LinhaTotal valor={ranking.reduce((s, c) => s + (c.vendido || 0), 0)} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   ============   PAINEL DO DIRETOR   ==========================
   ============================================================ */
function AdminApp({ colportores, setColportores, relatorios, setRelatorios, avisos, setAvisos, semanas, setSemanas, campanhas, setCampanhas, lideres, setLideres, relatoriosLider, solicitacoes, setSolicitacoes, retiradas, candidatos, setCandidatos, mensagens, setMensagens, indicacoes, setIndicacoes, resgates, setResgates, onLogout, showToast, toast, view, setView }) {
  const [tab, setTab] = useState("visao");
  const stats = useStats(colportores, relatorios);

  return (
    <div style={{ minHeight: "100vh", background: COL.areia, fontFamily: FONT_SANS }}>
      <Toast toast={toast} />
      <div style={{ background: COL.petroleo, padding: "20px 20px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }} className="lib-fade-in">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ animation: "floatLogo 5s ease-in-out infinite" }}>
            <LogoMark size={44} />
          </div>
          <div>
            <p style={{ color: COL.terracotaClaro, fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase", margin: 0, fontWeight: 800 }}>Diretor · {DIRETOR_NOME.split(" ")[0]} {DIRETOR_NOME.split(" ")[1]}</p>
            <h1 style={{ color: COL.areia, fontFamily: FONT_SERIF, fontSize: 24, fontWeight: 800, margin: "3px 0 0" }}>Libertadores</h1>
          </div>
        </div>
        <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.1)", border: "none", borderRadius: 10, padding: 9, cursor: "pointer", color: COL.areia }}>
          <LogOut size={17} />
        </button>
      </div>

      <div style={{ display: "flex", gap: 4, padding: "12px 14px 0", overflowX: "auto" }}>
        {[
          { id: "visao", label: "Visão Geral", icon: BarChart3 },
          { id: "equipe", label: "Equipe", icon: Users },
          { id: "estoque", label: "Estoque", icon: Package },
          { id: "estudos", label: "Estudos", icon: MapPin },
          { id: "mensagens", label: "Mensagens", icon: MessageSquare },
          { id: "bonificacao", label: "Bonificação", icon: Sparkles },
          { id: "lideranca", label: "Liderança", icon: Award },
          { id: "campanhas", label: "Campanhas", icon: Calendar },
          { id: "ranking", label: "Ranking", icon: Trophy },
          { id: "semanas", label: "Semanas", icon: Flame },
          { id: "avisos", label: "Avisos", icon: Megaphone },
        ].map((t) => {
          const Icon = t.id === "visao" ? BarChart3 : t.icon;
          const active = tab === t.id;
          const pendentesCount = t.id === "equipe"
            ? colportores.filter((c) => c.status === "pendente").length + solicitacoes.filter((s) => s.status === "pendente").length
            : t.id === "lideranca"
            ? lideres.filter((l) => l.status === "pendente").length
            : 0;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "9px 14px", borderRadius: 10,
              border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, position: "relative",
              background: active ? COL.terracota : COL.branco,
              color: active ? COL.branco : COL.grafite, fontWeight: 600, fontSize: 13,
            }}>
              <Icon size={15} /> {t.label}
              {pendentesCount > 0 && (
                <span style={{
                  position: "absolute", top: -5, right: -5, background: COL.vermelho, color: COL.branco,
                  borderRadius: "50%", width: 18, height: 18, fontSize: 10.5, fontWeight: 800,
                  display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${COL.areia}`,
                }}>
                  {pendentesCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ padding: 16, paddingBottom: 40 }} className="lib-fade-in" key={tab}>
        {tab === "visao" && <AdminVisaoGeral colportores={colportores} relatorios={relatorios} stats={stats} campanhas={campanhas} />}
        {tab === "equipe" && <AdminEquipe colportores={colportores} setColportores={setColportores} stats={stats} relatorios={relatorios} campanhas={campanhas} lideres={lideres} setLideres={setLideres} relatoriosLider={relatoriosLider} solicitacoes={solicitacoes} setSolicitacoes={setSolicitacoes} retiradas={retiradas} showToast={showToast} />}
        {tab === "estoque" && <AdminEstoque colportores={colportores} retiradas={retiradas} relatorios={relatorios} campanhas={campanhas} />}
        {tab === "estudos" && <AdminEstudos candidatos={candidatos} setCandidatos={setCandidatos} colportores={colportores} campanhas={campanhas} showToast={showToast} />}
        {tab === "mensagens" && <AdminMensagens mensagens={mensagens} setMensagens={setMensagens} showToast={showToast} />}
        {tab === "bonificacao" && <AdminBonificacao colportores={colportores} relatorios={relatorios} setRelatorios={setRelatorios} candidatos={candidatos} setCandidatos={setCandidatos} retiradas={retiradas} indicacoes={indicacoes} setIndicacoes={setIndicacoes} resgates={resgates} setResgates={setResgates} campanhas={campanhas} showToast={showToast} />}
        {tab === "lideranca" && <AdminLideranca lideres={lideres} setLideres={setLideres} colportores={colportores} relatoriosLider={relatoriosLider} showToast={showToast} />}
        {tab === "campanhas" && <AdminCampanhas campanhas={campanhas} setCampanhas={setCampanhas} colportores={colportores} showToast={showToast} />}
        {tab === "ranking" && <AdminRanking colportores={colportores} stats={stats} relatorios={relatorios} campanhasSemanas={semanas} campanhas={campanhas} />}
        {tab === "semanas" && <AdminSemanas semanas={semanas} setSemanas={setSemanas} colportores={colportores} relatorios={relatorios} showToast={showToast} />}
        {tab === "avisos" && <AdminAvisos avisos={avisos} setAvisos={setAvisos} colportores={colportores} campanhas={campanhas} showToast={showToast} />}
      </div>
    </div>
  );
}

function AdminEstoque({ colportores, retiradas, relatorios, campanhas }) {
  const [filtroCampanha, setFiltroCampanha] = useState("Todas");
  const [filtroColportor, setFiltroColportor] = useState("todos");

  const aprovados = colportores.filter((c) => c.status !== "pendente");
  const colportoresFiltrados = aprovados.filter((c) => filtroCampanha === "Todas" || c.campanhaId === filtroCampanha);

  const colportorSel = filtroColportor !== "todos" ? aprovados.find((c) => c.id === filtroColportor) : null;
  const idsBase = (colportorSel ? [colportorSel] : colportoresFiltrados).map((c) => c.id);

  const est = calcularEstoqueAgregado(idsBase, retiradas, relatorios);
  const itensComMov = CATALOGO
    .map((it) => ({ ...it, ...(est[it.id] || { retirado: 0, vendido: 0, devolvido: 0, disponivel: 0 }) }))
    .filter((it) => it.retirado > 0 || it.vendido > 0 || it.devolvido > 0)
    .sort((a, b) => b.disponivel - a.disponivel);

  const totRet = itensComMov.reduce((s, it) => s + it.retirado, 0);
  const totVen = itensComMov.reduce((s, it) => s + it.vendido, 0);
  const totDev = itensComMov.reduce((s, it) => s + it.devolvido, 0);
  const totDisp = totRet - totVen - totDev;

  // Resumo por colportor (somente na visão geral), ordenado por quem tem mais em mãos.
  const porColportor = colportorSel ? [] : colportoresFiltrados
    .map((c) => {
      const e = calcularEstoqueAgregado([c.id], retiradas, relatorios);
      const vals = Object.values(e);
      return {
        ...c,
        disp: vals.reduce((s, x) => s + x.disponivel, 0),
        ret: vals.reduce((s, x) => s + x.retirado, 0),
      };
    })
    .filter((c) => c.ret > 0 || c.disp !== 0)
    .sort((a, b) => b.disp - a.disp);

  const campanhaNome = (id) => campanhas.find((c) => c.id === id)?.nome;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Filtros */}
      <div style={card}>
        <h3 style={cardTitle}>Estoque da equipe</h3>
        <label style={lbl}>Campanha</label>
        <select value={filtroCampanha} onChange={(e) => { setFiltroCampanha(e.target.value); setFiltroColportor("todos"); }} style={inp}>
          <option value="Todas">Todas as campanhas</option>
          {campanhas.filter((c) => c.categoria !== "Permanentes").map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
        <label style={lbl}>Colportor</label>
        <select value={filtroColportor} onChange={(e) => setFiltroColportor(e.target.value)} style={{ ...inp, marginBottom: 0 }}>
          <option value="todos">Todos os colportores</option>
          {colportoresFiltrados.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>

      {/* Resumo */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <Package size={17} color={COL.terracota} />
          <h3 style={{ ...cardTitle, margin: 0, fontSize: 16 }}>
            {colportorSel ? colportorSel.nome : "Estoque geral na mão da equipe"}
          </h3>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 12, color: "#8A8478" }}>
          {colportorSel
            ? `${colportorSel.categoria}${colportorSel.campanhaId ? " · " + (campanhaNome(colportorSel.campanhaId) || "") : ""}`
            : `${idsBase.length} colportor${idsBase.length === 1 ? "" : "es"}${filtroCampanha !== "Todas" ? " · " + (campanhaNome(filtroCampanha) || "") : ""}`}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <MiniStat icon={<Package size={16} />} label="Retirados" value={totRet} />
          <MiniStat icon={<TrendingUp size={16} />} label="Vendidos" value={totVen} />
          <MiniStat icon={<ArrowLeft size={16} />} label="Devolvidos" value={totDev} />
          <MiniStat icon={<BookOpen size={16} />} label="Em mãos" value={totDisp} />
        </div>
      </div>

      {/* Por colportor (visão geral) */}
      {!colportorSel && (
        <div style={card}>
          <h3 style={cardTitle}>Por colportor</h3>
          {porColportor.length === 0 ? (
            <p style={{ color: "#B0A99A", fontSize: 13, textAlign: "center", padding: "14px 0" }}>
              Nenhum colportor com estoque registrado{filtroCampanha !== "Todas" ? " nesta campanha" : ""}.
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {porColportor.map((c) => {
                const neg = c.disp < 0;
                return (
                  <button key={c.id} onClick={() => setFiltroColportor(c.id)} className="lib-btn" style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
                    padding: "11px 12px", borderRadius: 10, border: "1.5px solid transparent",
                    background: COL.areia, cursor: "pointer", textAlign: "left", width: "100%",
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: COL.grafite, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.nome}</p>
                      <p style={{ margin: 0, fontSize: 11.5, color: "#8A8478" }}>{c.ret} retirados</p>
                    </div>
                    <span style={{
                      fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", padding: "4px 11px", borderRadius: 20,
                      background: neg ? `${COL.vermelho}14` : `${COL.oliva}14`, color: neg ? COL.vermelho : COL.oliva,
                    }}>
                      {c.disp} em mãos
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Por título */}
      <div style={card}>
        <h3 style={cardTitle}>Por título</h3>
        {itensComMov.length === 0 ? (
          <p style={{ color: "#B0A99A", fontSize: 13, textAlign: "center", padding: "14px 0" }}>
            Nenhum movimento de estoque registrado.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {itensComMov.map((it) => {
              const neg = it.disponivel < 0;
              return (
                <div key={it.id} style={{ borderBottom: `1px solid ${COL.areia}`, paddingBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <p style={{ margin: 0, fontSize: 13.5, fontWeight: 600, color: COL.grafite }}>{it.nome}</p>
                    <span style={{
                      fontSize: 13, fontWeight: 800, whiteSpace: "nowrap", padding: "3px 10px", borderRadius: 20,
                      background: neg ? `${COL.vermelho}14` : `${COL.oliva}14`, color: neg ? COL.vermelho : COL.oliva,
                    }}>
                      {it.disponivel} em mãos
                    </span>
                  </div>
                  <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "#B0A99A" }}>
                    Retirados {it.retirado} · Vendidos {it.vendido}{it.devolvido > 0 ? ` · Devolvidos ${it.devolvido}` : ""}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminEstudos({ candidatos, setCandidatos, colportores, campanhas, showToast }) {
  const [busca, setBusca] = useState("");
  const [filtroColportor, setFiltroColportor] = useState("todos");

  // Colportores que já enviaram candidatos (para o filtro).
  const colpComCandidatos = [...new Map((candidatos || []).map((c) => [c.colportorId, c.colportorNome])).entries()];

  const lista = (candidatos || [])
    .slice()
    .sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""))
    .filter((c) => filtroColportor === "todos" || c.colportorId === filtroColportor)
    .filter((c) => {
      if (!busca.trim()) return true;
      const alvo = `${c.nome} ${c.colportorNome} ${c.bairro} ${c.cidade} ${c.rua}`.toLowerCase();
      return alvo.includes(busca.toLowerCase());
    });

  async function excluir(id) {
    if (!confirm("Apagar este candidato?")) return;
    await setCandidatos((candidatos || []).filter((c) => c.id !== id));
    showToast("Candidato removido.");
  }

  const Campo = ({ label, valor }) => valor ? (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "5px 0", borderBottom: `1px solid ${COL.areia}` }}>
      <span style={{ fontSize: 12, color: "#8A8478", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12.5, color: COL.grafite, fontWeight: 600, textAlign: "right" }}>{valor}</span>
    </div>
  ) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <MapPin size={17} color={COL.terracota} />
          <h3 style={{ ...cardTitle, margin: 0 }}>Candidatos a estudo bíblico</h3>
        </div>
        <p style={{ margin: "0 0 12px", fontSize: 12.5, color: "#8A8478" }}>
          {(candidatos || []).length} candidato{(candidatos || []).length === 1 ? "" : "s"} recebido{(candidatos || []).length === 1 ? "" : "s"} da equipe.
        </p>
        <div style={{ position: "relative", marginBottom: 8 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: 13, color: "#B0A99A" }} />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, bairro, cidade..." style={{ ...inp, marginBottom: 0, paddingLeft: 36 }} />
        </div>
        <select value={filtroColportor} onChange={(e) => setFiltroColportor(e.target.value)} style={{ ...inp, marginBottom: 0 }}>
          <option value="todos">Todos os colportores</option>
          {colpComCandidatos.map(([id, nome]) => <option key={id} value={id}>{nome}</option>)}
        </select>
      </div>

      {lista.length === 0 ? (
        <div style={card}>
          <p style={{ textAlign: "center", color: "#B0A99A", padding: 16 }}>Nenhum candidato {(candidatos || []).length > 0 ? "para esse filtro" : "recebido ainda"}.</p>
        </div>
      ) : (
        lista.map((c) => {
          const camp = campanhas.find((x) => x.id === c.campanhaId);
          return (
            <div key={c.id} style={card} className="lib-fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: COL.petroleo, fontFamily: FONT_SERIF }}>{c.nome}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#8A8478" }}>
                    Enviado por {c.colportorNome}{camp ? ` · ${camp.nome}` : ""} · {new Date(c.criadoEm).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <button onClick={() => excluir(c.id)} style={{ ...iconBtn, color: COL.vermelho, flexShrink: 0 }}><Trash2 size={15} /></button>
              </div>
              <Campo label="Rua" valor={[c.rua, c.numero].filter(Boolean).join(", ")} />
              <Campo label="Bairro" valor={c.bairro} />
              <Campo label="Cidade" valor={c.cidade} />
              <Campo label="Ponto de referência" valor={c.ponto} />
              <Campo label="Melhor dia" valor={c.melhorDia} />
              <Campo label="Religião atual" valor={c.religiao} />
            </div>
          );
        })
      )}
    </div>
  );
}

function AdminMensagens({ mensagens, setMensagens, showToast }) {
  const [filtroTipo, setFiltroTipo] = useState("todas");

  const lista = (mensagens || [])
    .slice()
    .sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""))
    .filter((m) => filtroTipo === "todas" || m.tipo === filtroTipo);

  async function excluir(id) {
    if (!confirm("Apagar esta mensagem?")) return;
    await setMensagens((mensagens || []).filter((m) => m.id !== id));
    showToast("Mensagem removida.");
  }

  const contagem = (tipoId) => (mensagens || []).filter((m) => m.tipo === tipoId).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <MessageSquare size={17} color={COL.terracota} />
          <h3 style={{ ...cardTitle, margin: 0 }}>Mensagens da equipe</h3>
        </div>
        <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
          <button onClick={() => setFiltroTipo("todas")} className="lib-btn" style={{
            padding: "8px 14px", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontWeight: 700, fontSize: 12.5,
            border: `1.5px solid ${filtroTipo === "todas" ? COL.terracota : COL.areiaEscura}`,
            background: filtroTipo === "todas" ? COL.terracota : COL.branco, color: filtroTipo === "todas" ? COL.branco : COL.grafite,
          }}>
            Todas ({(mensagens || []).length})
          </button>
          {TIPOS_MENSAGEM.map((t) => {
            const ativo = filtroTipo === t.id;
            return (
              <button key={t.id} onClick={() => setFiltroTipo(t.id)} className="lib-btn" style={{
                padding: "8px 14px", borderRadius: 20, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, fontWeight: 700, fontSize: 12.5,
                border: `1.5px solid ${ativo ? t.cor : COL.areiaEscura}`,
                background: ativo ? t.cor : COL.branco, color: ativo ? COL.branco : COL.grafite,
              }}>
                {t.label} ({contagem(t.id)})
              </button>
            );
          })}
        </div>
      </div>

      {lista.length === 0 ? (
        <div style={card}>
          <p style={{ textAlign: "center", color: "#B0A99A", padding: 16 }}>Nenhuma mensagem {(mensagens || []).length > 0 ? "desse tipo" : "recebida ainda"}.</p>
        </div>
      ) : (
        lista.map((m) => {
          const meta = tipoMsgMeta(m.tipo);
          return (
            <div key={m.id} style={{ ...card, borderLeft: `4px solid ${meta.cor}` }} className="lib-fade-in">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: meta.cor, background: `${meta.cor}1A`, padding: "3px 10px", borderRadius: 20 }}>{meta.label}</span>
                  <p style={{ margin: "6px 0 0", fontSize: 12.5, color: "#8A8478", fontWeight: 600 }}>
                    {m.colportorNome}{m.categoria ? ` · ${m.categoria}` : ""}
                  </p>
                  <p style={{ margin: "1px 0 0", fontSize: 11.5, color: "#B0A99A" }}>{new Date(m.criadoEm).toLocaleString("pt-BR")}</p>
                </div>
                <button onClick={() => excluir(m.id)} style={{ ...iconBtn, color: COL.vermelho, flexShrink: 0 }}><Trash2 size={15} /></button>
              </div>
              <p style={{ margin: 0, fontSize: 13.5, color: COL.grafite, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{m.texto}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

function AdminBonificacao({ colportores, relatorios, setRelatorios, candidatos, setCandidatos, retiradas, indicacoes, setIndicacoes, resgates, setResgates, campanhas, showToast }) {
  const [sec, setSec] = useState("ranking");

  const ctx = { relatorios, candidatos, retiradas, indicacoes, campanhas };
  const aprovados = colportores.filter((c) => c.status !== "pendente");
  const rankingPontos = aprovados
    .map((c) => ({ ...c, ...pontosDisponiveis(c, ctx, resgates) }))
    .filter((c) => c.ganhos > 0)
    .sort((a, b) => b.ganhos - a.ganhos);

  const trocas = (resgates || []).slice().sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""));
  const trocasPendentes = trocas.filter((r) => r.status !== "entregue");
  const inds = (indicacoes || []).slice().sort((a, b) => (b.criadoEm || "").localeCompare(a.criadoEm || ""));

  async function entregar(r) {
    await setResgates(resgates.map((x) => x.id === r.id ? { ...x, status: "entregue", entregueEm: new Date().toISOString() } : x));
    showToast("Troca marcada como entregue.");
  }
  async function cancelarTroca(r) {
    if (!confirm("Cancelar esta troca? Os pontos voltam para o colportor.")) return;
    await setResgates(resgates.filter((x) => x.id !== r.id));
    showToast("Troca cancelada, pontos devolvidos.");
  }
  async function excluirInd(id) {
    if (!confirm("Apagar esta indicação?")) return;
    await setIndicacoes(indicacoes.filter((i) => i.id !== id));
    showToast("Indicação removida.");
  }

  const confirmarCount =
    (relatorios || []).filter((r) => r.confirmado === false).length +
    (candidatos || []).filter((c) => c.confirmado === false).length;

  const secoes = [
    { id: "ranking", label: "Pontos" },
    { id: "confirmar", label: `A confirmar${confirmarCount ? ` (${confirmarCount})` : ""}` },
    { id: "trocas", label: `Trocas${trocasPendentes.length ? ` (${trocasPendentes.length})` : ""}` },
    { id: "indicacoes", label: `Indicações${inds.length ? ` (${inds.length})` : ""}` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
        {secoes.map((s) => (
          <button key={s.id} onClick={() => setSec(s.id)} className="lib-btn" style={{
            padding: "8px 14px", borderRadius: 9, border: "none", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
            background: sec === s.id ? COL.terracota : COL.branco, color: sec === s.id ? COL.branco : COL.grafite, fontWeight: 700, fontSize: 13,
          }}>{s.label}</button>
        ))}
      </div>

      {sec === "ranking" && (
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <Sparkles size={17} color={COL.terracota} />
            <h3 style={{ ...cardTitle, margin: 0 }}>Bonificação da equipe</h3>
          </div>
          {rankingPontos.length === 0 ? (
            <p style={{ textAlign: "center", color: "#B0A99A", padding: 14 }}>Ninguém pontuou ainda.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {rankingPontos.map((c, i) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderBottom: i < rankingPontos.length - 1 ? "1px solid #F0E9DC" : "none" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: i === 0 ? "#D4A017" : i === 1 ? "#9CA3AF" : i === 2 ? "#B87333" : COL.areia,
                    color: i < 3 ? COL.branco : COL.grafite, fontWeight: 800, fontSize: 13, flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: 13.5, color: COL.grafite, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.nome}</p>
                    <p style={{ margin: 0, fontSize: 11, color: "#8A8478" }}>{c.saldo.toLocaleString("pt-BR")} disponíveis</p>
                  </div>
                  <p style={{ margin: 0, fontWeight: 800, color: COL.terracota, fontFamily: FONT_SERIF, fontSize: 15, whiteSpace: "nowrap" }}>{c.ganhos.toLocaleString("pt-BR")} pts</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {sec === "confirmar" && (
        <PainelConfirmacao
          relatorios={relatorios} setRelatorios={setRelatorios}
          candidatos={candidatos} setCandidatos={setCandidatos}
          colportores={colportores}
          idsEscopo={null}
          quemConfirma="Diretor"
          showToast={showToast}
        />
      )}

      {sec === "trocas" && (
        trocas.length === 0 ? (
          <div style={card}><p style={{ textAlign: "center", color: "#B0A99A", padding: 16 }}>Nenhuma troca de pontos ainda.</p></div>
        ) : (
          trocas.map((r) => (
            <div key={r.id} style={{ ...card, opacity: r.status === "entregue" ? 0.7 : 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14.5, color: COL.petroleo }}>{r.itemNome}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12, color: "#8A8478" }}>{r.colportorNome} · {new Date(r.criadoEm).toLocaleDateString("pt-BR")}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12.5, color: COL.terracota, fontWeight: 700 }}>{r.pontos.toLocaleString("pt-BR")} pts · {fmt(r.preco)}</p>
                </div>
                <span style={{ fontSize: 10.5, fontWeight: 800, padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap",
                  background: r.status === "entregue" ? `${COL.oliva}1A` : `${COL.terracota}1A`, color: r.status === "entregue" ? COL.oliva : COL.terracota }}>
                  {r.status === "entregue" ? "Entregue" : "Pendente"}
                </span>
              </div>
              {r.status !== "entregue" && (
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  <button onClick={() => entregar(r)} className="lib-btn" style={{ flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer", background: COL.oliva, color: COL.branco, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <Check size={15} /> Marcar entregue
                  </button>
                  <button onClick={() => cancelarTroca(r)} className="lib-btn" style={{ padding: "9px 14px", borderRadius: 9, border: `1.5px solid ${COL.vermelho}`, cursor: "pointer", background: COL.branco, color: COL.vermelho, fontWeight: 700, fontSize: 13 }}>
                    Cancelar
                  </button>
                </div>
              )}
            </div>
          ))
        )
      )}

      {sec === "indicacoes" && (
        inds.length === 0 ? (
          <div style={card}><p style={{ textAlign: "center", color: "#B0A99A", padding: 16 }}>Nenhuma indicação recebida ainda.</p></div>
        ) : (
          inds.map((i) => (
            <div key={i.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: COL.petroleo }}>{i.nome}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: COL.grafite, fontWeight: 600 }}>{i.telefone}</p>
                  {i.igreja && <p style={{ margin: "1px 0 0", fontSize: 12.5, color: "#8A8478" }}>Igreja: {i.igreja}</p>}
                  <p style={{ margin: "3px 0 0", fontSize: 11.5, color: "#8A8478" }}>Indicado por {i.colportorNome} · {new Date(i.criadoEm).toLocaleDateString("pt-BR")}</p>
                </div>
                <button onClick={() => excluirInd(i.id)} style={{ ...iconBtn, color: COL.vermelho, flexShrink: 0 }}><Trash2 size={15} /></button>
              </div>
            </div>
          ))
        )
      )}
    </div>
  );
}

function AdminVisaoGeral({ colportores, relatorios, stats, campanhas }) {
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");

  const ativos = colportores.filter((c) => c.status !== "pendente");
  const aniversariantesHoje = ativos.filter((c) => ehAniversarioHoje(c.nascimento));
  const ativosFiltrados = filtroCategoria === "Todas" ? ativos : ativos.filter((c) => c.categoria === filtroCategoria);

  const totalVendido = ativosFiltrados.reduce((s, c) => s + (stats[c.id]?.totalVendido || 0), 0);
  const totalLivros = ativosFiltrados.reduce((s, c) => s + (stats[c.id]?.totalLivros || 0), 0);
  const totalOfertas = ativosFiltrados.reduce((s, c) => s + (stats[c.id]?.totalOfertas || 0), 0);
  const totalOracoes = ativosFiltrados.reduce((s, c) => s + (stats[c.id]?.totalOracoes || 0), 0);
  const metaTotal = ativosFiltrados.reduce((s, c) => s + (c.meta || 0), 0);
  const pctGeral = metaTotal > 0 ? Math.min(100, (totalVendido / metaTotal) * 100) : 0;

  const hoje = todayStr();
  const idsFiltrados = new Set(ativosFiltrados.map((c) => c.id));
  const relatoriosFiltrados = relatorios.filter((r) => idsFiltrados.has(r.colportorId));
  const enviaramHoje = new Set(relatoriosFiltrados.filter((r) => r.data === hoje).map((r) => r.colportorId)).size;

  // Período de referência para meta diária: campanha (Estudantes/Sonhando Alto) ou mês atual (Permanentes)
  let periodoMeta = null;
  if (filtroCategoria === "Permanentes") {
    const hojeDate = new Date();
    const inicioMes = `${hojeDate.getFullYear()}-${String(hojeDate.getMonth() + 1).padStart(2, "0")}-01`;
    const ultimoDia = new Date(hojeDate.getFullYear(), hojeDate.getMonth() + 1, 0).getDate();
    const fimMes = `${hojeDate.getFullYear()}-${String(hojeDate.getMonth() + 1).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
    periodoMeta = { inicio: inicioMes, fim: fimMes, label: "Mês atual" };
  } else if (filtroCategoria === "Estudantes" || filtroCategoria === "Sonhando Alto") {
    const campanhasDaCategoria = campanhas.filter((c) => c.categoria === filtroCategoria);
    if (campanhasDaCategoria.length > 0) {
      const emAndamento = campanhasDaCategoria.find((c) => hoje >= c.inicio && hoje <= c.fim);
      const escolhida = emAndamento || campanhasDaCategoria[campanhasDaCategoria.length - 1];
      periodoMeta = { inicio: escolhida.inicio, fim: escolhida.fim, label: escolhida.nome };
    }
  }
  const resumoDiario = periodoMeta ? resumoMetaDiaria(metaTotal, totalVendido, periodoMeta.inicio, periodoMeta.fim) : null;

  // vendas de hoje (respeitando o filtro)
  const vendidoHoje = relatoriosFiltrados
    .filter((r) => r.data === hoje)
    .reduce((s, r) => s + (r.vendas || []).reduce((sv, v) => {
      const item = CATALOGO.find((c) => c.id === v.itemId);
      return sv + (item?.preco || 0) * v.qtd;
    }, 0), 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {aniversariantesHoje.length > 0 && (
        <div style={{ borderRadius: 16, padding: 16, background: `linear-gradient(135deg, ${COL.terracota}, ${COL.terracotaClaro})`, color: COL.branco, boxShadow: "0 10px 26px rgba(194,98,45,0.28)" }} className="lib-pop-in">
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <Sparkles size={18} />
            <h3 style={{ margin: 0, fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 17 }}>
              🎉 Aniversariante{aniversariantesHoje.length === 1 ? "" : "s"} de hoje
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {aniversariantesHoje.map((c) => {
              const i = idade(c.nascimento);
              return (
                <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>{c.nome}</span>
                  <span style={{ fontSize: 12.5, opacity: 0.9 }}>{c.categoria}{i != null ? ` · ${i} anos` : ""}</span>
                </div>
              );
            })}
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 12, opacity: 0.92 }}>Que tal mandar uma mensagem de parabéns? 🥳</p>
        </div>
      )}
      <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
        {["Todas", ...CATEGORIAS_COLPORTOR].map((cat) => (
          <button key={cat} onClick={() => setFiltroCategoria(cat)} className="lib-btn lib-tab-btn" style={{
            padding: "8px 14px", borderRadius: 9, border: "none", cursor: "pointer", whiteSpace: "nowrap",
            background: filtroCategoria === cat ? COL.petroleo : COL.branco, color: filtroCategoria === cat ? COL.areia : COL.grafite, fontWeight: 700, fontSize: 13,
          }}>{cat}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }} key={filtroCategoria}>
        <KpiCard label="Total vendido" value={fmt(totalVendido)} icon={<TrendingUp size={18} />} accent={COL.terracota} delay={0} />
        <KpiCard label="Meta geral" value={`${pctGeral.toFixed(0)}%`} icon={<Target size={18} />} accent={COL.oliva} delay={0.04} />
        <KpiCard label="Livros entregues" value={totalLivros} icon={<BookOpen size={18} />} accent={COL.petroleo} delay={0.08} />
        <KpiCard label="Reportaram hoje" value={`${enviaramHoje}/${ativosFiltrados.length}`} icon={<ClipboardList size={18} />} accent={COL.terracota} delay={0.12} />
        <KpiCard label="Ofertas dadas" value={totalOfertas} icon={<HandHeart size={18} />} accent={COL.oliva} delay={0.16} />
        <KpiCard label="Orações feitas" value={totalOracoes} icon={<HeartHandshake size={18} />} accent={COL.petroleo} delay={0.2} />
      </div>

      {resumoDiario && (
        <div className="lib-fade-in" style={card}>
          <h3 style={cardTitle}>Meta do dia — {periodoMeta.label}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            <div style={{ background: COL.areia, borderRadius: 10, padding: "10px 12px" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>Meta diária</p>
              <p style={{ margin: "3px 0 0", fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 17, color: COL.petroleo }}>{fmt(resumoDiario.metaDiaria)}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#B0A99A" }}>{resumoDiario.diasUteisTotal} dias úteis no período</p>
            </div>
            <div style={{ background: COL.areia, borderRadius: 10, padding: "10px 12px" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>Esperado até hoje</p>
              <p style={{ margin: "3px 0 0", fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 17, color: COL.petroleo }}>{fmt(resumoDiario.metaEsperadaHoje)}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: "#B0A99A" }}>{resumoDiario.diasUteisPassados} dias úteis passados</p>
            </div>
          </div>

          <div style={{ position: "relative", height: 14, background: COL.areia, borderRadius: 8, overflow: "hidden" }}>
            <div style={{
              position: "absolute", left: 0, top: 0, height: "100%", width: `${resumoDiario.pctReal}%`, borderRadius: 8,
              background: resumoDiario.noRitmo ? COL.oliva : `linear-gradient(90deg, ${COL.terracota}, ${COL.terracotaClaro})`,
              transition: "width 0.7s cubic-bezier(.22,1,.36,1)",
            }} />
            <div style={{
              position: "absolute", top: -3, bottom: -3, width: 2, background: COL.petroleo,
              left: `${resumoDiario.pctEsperado}%`, transition: "left 0.7s cubic-bezier(.22,1,.36,1)",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 11.5, color: "#8A8478" }}>{resumoDiario.pctReal.toFixed(0)}% vendido</span>
            <span style={{ fontSize: 11.5, color: "#8A8478" }}>linha = {resumoDiario.pctEsperado.toFixed(0)}% esperado</span>
          </div>
          <p style={{
            fontSize: 12.5, fontWeight: 800, margin: "10px 0 0",
            color: resumoDiario.noRitmo ? COL.oliva : COL.vermelho,
          }}>
            {resumoDiario.noRitmo
              ? `No ritmo — ${fmt(Math.abs(resumoDiario.diferenca))} acima do esperado`
              : `Abaixo do ritmo — faltam ${fmt(Math.abs(resumoDiario.diferenca))} para alcançar o esperado de hoje`}
          </p>
        </div>
      )}

      <div style={card}>
        <h3 style={cardTitle}>Vendas hoje</h3>
        {vendidoHoje === 0 ? (
          <p style={{ color: "#B0A99A", fontSize: 13, textAlign: "center", padding: "10px 0" }}>Nenhuma venda registrada hoje ainda.</p>
        ) : (
          <div style={{ textAlign: "center", padding: "8px 0" }}>
            <p style={{ margin: 0, fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 32, color: COL.terracota }}>{fmt(vendidoHoje)}</p>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#8A8478" }}>
              {enviaramHoje} colportor{enviaramHoje === 1 ? "" : "es"} já reportou{enviaramHoje === 1 ? "" : "ram"} hoje
            </p>
          </div>
        )}
      </div>

      <div className="lib-fade-in" style={card} key={`progresso-${filtroCategoria}`}>
        <h3 style={cardTitle}>Progresso da meta{filtroCategoria !== "Todas" ? ` — ${filtroCategoria}` : ""}</h3>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
          <span style={{ fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 24, color: COL.petroleo }}>{fmt(totalVendido)}</span>
          <span style={{ fontSize: 13, color: "#8A8478", fontWeight: 600 }}>de {fmt(metaTotal)}</span>
        </div>
        <div style={{ height: 14, background: COL.areia, borderRadius: 8, overflow: "hidden" }}>
          <div className={`lib-progress-fill ${pctGeral >= 100 ? "shimmer" : ""}`} style={{
            height: "100%", width: `${pctGeral}%`, borderRadius: 8,
            background: pctGeral >= 100 ? COL.oliva : `linear-gradient(90deg, ${COL.terracota}, ${COL.terracotaClaro})`,
          }} />
        </div>
        <p style={{
          fontSize: 13, fontWeight: 800, margin: "10px 0 0",
          color: pctGeral >= 100 ? COL.oliva : COL.terracota,
        }}>
          {pctGeral.toFixed(0)}% da meta {pctGeral >= 100 ? "— Meta batida! 🎉" : "alcançada"}
        </p>
      </div>
    </div>
  );
}
function KpiCard({ label, value, icon, accent, delay = 0 }) {
  return (
    <div className="lib-fade-in lib-card-hover" style={{ ...card, padding: 14, animationDelay: `${delay}s` }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ color: "#8A8478", fontSize: 11.5, fontWeight: 800, letterSpacing: 0.3 }}>{label}</span>
        <div style={{ color: accent }}>{icon}</div>
      </div>
      <p style={{ margin: 0, fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 22, color: COL.petroleo }}>{value}</p>
    </div>
  );
}

function AdminEquipe({ colportores, setColportores, stats, relatorios, campanhas, lideres, setLideres, relatoriosLider, solicitacoes, setSolicitacoes, retiradas, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [filtroCategoria, setFiltroCategoria] = useState("Todas");
  const [filtroCampanha, setFiltroCampanha] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [editando, setEditando] = useState(null);

  const pendentes = colportores.filter((c) => c.status === "pendente");
  const aprovados = colportores.filter((c) => c.status !== "pendente");
  const solicitacoesPendentes = (solicitacoes || []).filter((s) => s.status === "pendente");

  // Campanhas que aparecem no filtro: se uma categoria estiver selecionada,
  // mostramos só as campanhas dela; senão, todas as campanhas com categoria.
  const campanhasFiltro = campanhas.filter((c) => filtroCategoria === "Todas" || c.categoria === filtroCategoria);

  const filtrados = aprovados.filter((c) =>
    (filtroCategoria === "Todas" || c.categoria === filtroCategoria) &&
    (filtroCampanha === "Todas" || c.campanhaId === filtroCampanha) &&
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  async function excluir(id) {
    if (!confirm("Remover este colportor? Os relatórios enviados serão mantidos no histórico.")) return;
    await setColportores(colportores.filter((c) => c.id !== id));
    showToast("Colportor removido.");
  }

  async function aprovar(c) {
    await setColportores(colportores.map((col) => col.id === c.id ? { ...col, status: "aprovado" } : col));
    showToast(`${c.nome} foi aprovado e já pode entrar no sistema.`);
  }

  async function rejeitar(c) {
    if (!confirm(`Rejeitar a solicitação de ${c.nome}? O telefone ficará livre para um novo cadastro.`)) return;
    await setColportores(colportores.filter((col) => col.id !== c.id));
    showToast("Solicitação rejeitada e removida.");
  }

  // ---- Solicitações de entrada em outra campanha (colportor existente) ----
  async function aprovarSolicitacao(s) {
    const base = colportores.find((c) => c.id === s.colportorRefId);
    if (!base) {
      showToast("Não encontrei o cadastro de origem dessa pessoa.", "error");
      return;
    }
    // Credenciais reaproveitadas da conta existente (sem novo cadastro).
    const credenciais = {
      nome: base.nome, telefone: base.telefone, senha: base.senha,
      segmento: base.segmento, pergunta: base.pergunta, resposta: base.resposta,
    };
    if (s.papel === "lider") {
      // Vira líder só naquela campanha. Se já houver um vínculo de colportor
      // dele NAQUELA campanha, ele é substituído pelo papel de líder.
      const novoLider = {
        id: uid("lid"), ...credenciais,
        categoria: s.categoria, campanhaId: s.campanhaId,
        colegio: s.colegio, curso: s.curso, meta: s.meta,
        status: "aprovado", origemSolicitacao: s.id, criadoEm: new Date().toISOString(),
      };
      await setLideres([...lideres, novoLider]);
      const semColportorNaCampanha = colportores.filter((c) => !(c.telefone.replace(/\D/g, "") === base.telefone.replace(/\D/g, "") && c.campanhaId === s.campanhaId));
      if (semColportorNaCampanha.length !== colportores.length) {
        await setColportores(semColportorNaCampanha);
      }
      showToast(`${base.nome} agora é líder nessa campanha.`);
    } else {
      // Acumula: novo vínculo de colportor numa campanha adicional.
      const jaExiste = colportores.some((c) => c.telefone.replace(/\D/g, "") === base.telefone.replace(/\D/g, "") && c.campanhaId === s.campanhaId);
      if (jaExiste) {
        showToast("Essa pessoa já participa dessa campanha como colportor.", "error");
      } else {
        const novo = {
          id: uid("col"), ...credenciais,
          categoria: s.categoria, campanhaId: s.campanhaId,
          colegio: s.colegio, curso: s.curso, meta: s.meta,
          status: "aprovado", origemSolicitacao: s.id,
        };
        await setColportores([...colportores, novo]);
        showToast(`${base.nome} entrou na nova campanha como colportor.`);
      }
    }
    await setSolicitacoes(solicitacoes.map((x) => x.id === s.id ? { ...x, status: "aprovado", resolvidoEm: new Date().toISOString() } : x));
  }

  async function rejeitarSolicitacao(s) {
    if (!confirm(`Rejeitar o pedido de ${s.pessoaNome} para entrar em ${s.campanhaNome}?`)) return;
    await setSolicitacoes(solicitacoes.map((x) => x.id === s.id ? { ...x, status: "rejeitado", resolvidoEm: new Date().toISOString() } : x));
    showToast("Pedido rejeitado.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {solicitacoesPendentes.length > 0 && (
        <div style={{ ...card, border: `1.5px solid ${COL.petroleo}`, background: `${COL.petroleo}08` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <ChevronRight size={16} color={COL.petroleo} />
            <h3 style={{ ...cardTitle, margin: 0, fontSize: 16 }}>
              {solicitacoesPendentes.length} pedido{solicitacoesPendentes.length === 1 ? "" : "s"} de entrada em campanha
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {solicitacoesPendentes.map((s) => (
              <div key={s.id} style={{ background: COL.branco, borderRadius: 12, padding: 14 }}>
                <p style={{ margin: 0, fontWeight: 700, color: COL.grafite, fontSize: 14.5 }}>{s.pessoaNome}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#8A8478" }}>
                  Quer entrar em <strong>{s.campanhaNome}</strong> como {s.papel === "lider" ? "líder" : "colportor"}
                </p>
                <p style={{ margin: "1px 0 0", fontSize: 11.5, color: "#B0A99A" }}>
                  {s.colegio || "—"} · {s.curso || "—"} · Meta: {fmt(s.meta)}
                </p>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => aprovarSolicitacao(s)} className="lib-btn" style={{
                    flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer",
                    background: COL.oliva, color: COL.branco, fontWeight: 700, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <Check size={15} /> Liberar
                  </button>
                  <button onClick={() => rejeitarSolicitacao(s)} className="lib-btn" style={{
                    flex: 1, padding: "9px 0", borderRadius: 9, border: `1.5px solid ${COL.vermelho}`, cursor: "pointer",
                    background: COL.branco, color: COL.vermelho, fontWeight: 700, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <X size={15} /> Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {pendentes.length > 0 && (
        <div style={{ ...card, border: `1.5px solid ${COL.terracota}`, background: `${COL.terracota}0A` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Bell size={16} color={COL.terracota} />
            <h3 style={{ ...cardTitle, margin: 0, fontSize: 16 }}>
              {pendentes.length} solicitação{pendentes.length === 1 ? "" : "ões"} pendente{pendentes.length === 1 ? "" : "s"}
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendentes.map((c) => {
              const campanhaDoColportor = campanhas.find((camp) => camp.id === c.campanhaId);
              return (
                <div key={c.id} style={{ background: COL.branco, borderRadius: 12, padding: 14 }}>
                  <p style={{ margin: 0, fontWeight: 700, color: COL.grafite, fontSize: 14.5 }}>{c.nome}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#8A8478" }}>{c.telefone} · {c.categoria} · {c.segmento}</p>
                  <p style={{ margin: "1px 0 0", fontSize: 11.5, color: "#B0A99A" }}>
                    {c.categoria === "Permanentes"
                      ? `${c.tipoPermanente || "—"} · ${c.nivelPermanente || "—"}`
                      : `${campanhaDoColportor?.nome || "Sem campanha"} · ${c.colegio || "—"} · ${c.curso || "—"}`}
                  </p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: COL.oliva, fontWeight: 700 }}>Meta: {fmt(c.meta)}</p>
                  <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                    <button onClick={() => aprovar(c)} className="lib-btn" style={{
                      flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer",
                      background: COL.oliva, color: COL.branco, fontWeight: 700, fontSize: 13,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}>
                      <Check size={15} /> Aprovar
                    </button>
                    <button onClick={() => rejeitar(c)} className="lib-btn" style={{
                      flex: 1, padding: "9px 0", borderRadius: 9, border: `1.5px solid ${COL.vermelho}`, cursor: "pointer",
                      background: COL.branco, color: COL.vermelho, fontWeight: 700, fontSize: 13,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}>
                      <X size={15} /> Rejeitar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <button onClick={() => { setEditando(null); setShowForm(true); }} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota }}>
        <UserPlus size={17} /> Cadastrar colportor
      </button>

      <div style={{ display: "flex", gap: 8 }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: 13, color: "#B0A99A" }} />
          <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome..." style={{ ...inp, marginBottom: 0, paddingLeft: 36 }} />
        </div>
        <select value={filtroCategoria} onChange={(e) => { setFiltroCategoria(e.target.value); setFiltroCampanha("Todas"); }} style={{ ...inp, marginBottom: 0, width: 130 }}>
          <option>Todas</option>
          {CATEGORIAS_COLPORTOR.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {filtroCategoria !== "Permanentes" && campanhasFiltro.length > 0 && (
        <select value={filtroCampanha} onChange={(e) => setFiltroCampanha(e.target.value)} style={{ ...inp, marginBottom: 0 }}>
          <option value="Todas">Todas as campanhas</option>
          {campanhasFiltro.map((c) => (
            <option key={c.id} value={c.id}>{c.nome}{campanhaEncerrada(c) ? " (encerrada)" : ""}</option>
          ))}
        </select>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtrados.length === 0 && (
          <p style={{ textAlign: "center", color: "#B0A99A", padding: 20 }}>Nenhum colportor cadastrado ainda.</p>
        )}
        {filtrados.map((c) => {
          const s = stats[c.id] || { totalVendido: 0 };
          const pct = c.meta > 0 ? Math.min(100, (s.totalVendido / c.meta) * 100) : 0;
          const campanhaDoColportor = campanhas.find((camp) => camp.id === c.campanhaId);
          const assistencias = relatoriosLider.filter((r) => r.colportorId === c.id);
          const ehPermanente = c.categoria === "Permanentes";
          const metaMensal = ehPermanente && c.tipoPermanente && c.nivelPermanente
            ? (c.cotaReduzida ? COTA_REDUZIDA_VALOR : calcularMetaPermanente(c.tipoPermanente, c.nivelPermanente) / 2)
            : 0;
          const resumo = ehPermanente ? resumoPermanente(s.porDia, metaMensal) : null;
          const emRisco = resumo && resumo.cotasBatidas < resumo.metaCotas;
          const estC = calcularEstoque(c.id, retiradas, relatorios);
          const estDisp = Object.values(estC).reduce((acc, x) => acc + x.disponivel, 0);
          const estRet = Object.values(estC).reduce((acc, x) => acc + x.retirado, 0);
          return (
            <div key={c.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: COL.grafite, fontSize: 15 }}>{c.nome}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#8A8478" }}>{c.telefone} · {c.categoria} · {c.segmento}</p>
                  <p style={{ margin: "1px 0 0", fontSize: 11.5, color: "#B0A99A" }}>
                    {c.categoria === "Permanentes"
                      ? `${c.tipoPermanente || "—"} · ${c.nivelPermanente || "—"}`
                      : `${campanhaDoColportor?.nome || "Sem campanha"} · ${c.colegio || "—"} · ${c.curso || "—"}`}
                    {c.cotaReduzida && (
                      <span style={{ marginLeft: 6, fontWeight: 800, color: COL.oliva }}>· Cota reduzida</span>
                    )}
                  </p>
                  {assistencias.length > 0 && (
                    <p style={{ margin: "3px 0 0", fontSize: 11.5, color: COL.terracota, fontWeight: 600 }}>
                      {assistencias.length} assistência{assistencias.length === 1 ? "" : "s"} de líder ({assistencias.filter((a) => a.confirmado).length} confirmada{assistencias.filter((a) => a.confirmado).length === 1 ? "" : "s"})
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => { setEditando(c); setShowForm(true); }} style={iconBtn}><Settings size={15} /></button>
                  <button onClick={() => excluir(c.id)} style={{ ...iconBtn, color: COL.vermelho }}><Trash2 size={15} /></button>
                </div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ height: 8, background: COL.areia, borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? COL.oliva : COL.terracota, borderRadius: 6 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
                  <span style={{ fontSize: 12, color: "#8A8478" }}>{fmt(s.totalVendido)} de {fmt(c.meta)}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 100 ? COL.oliva : COL.terracota }}>{pct.toFixed(0)}%</span>
                </div>
              </div>
              {estRet > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11.5, fontWeight: 600, color: estDisp < 0 ? COL.vermelho : "#8A8478" }}>
                  <Package size={13} /> Estoque: {estDisp} disponível de {estRet} retirados
                </div>
              )}
              {resumo && (
                <div style={{
                  marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COL.areia}`,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <span style={{ fontSize: 11.5, color: "#8A8478", fontWeight: 700 }}>{resumo.nomeSemestre}</span>
                  <span style={{
                    fontSize: 11.5, fontWeight: 800, padding: "3px 9px", borderRadius: 20,
                    background: emRisco ? `${COL.vermelho}14` : `${COL.oliva}14`,
                    color: emRisco ? COL.vermelho : COL.oliva,
                  }}>
                    {resumo.cotasBatidas}/{resumo.metaCotas} cotas {emRisco && resumo.semestreCompleto ? "— risco de rebaixamento" : ""}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showForm && (
        <ColportorFormModal
          colportor={editando}
          campanhas={campanhas}
          onClose={() => setShowForm(false)}
          onSave={async (data) => {
            if (editando) {
              await setColportores(colportores.map((c) => c.id === editando.id ? { ...c, ...data } : c));
              showToast("Colportor atualizado.");
            } else {
              if (colportores.some((c) => c.telefone.replace(/\D/g, "") === data.telefone.replace(/\D/g, ""))) {
                showToast("Já existe um colportor com esse telefone.", "error");
                return;
              }
              await setColportores([...colportores, { id: uid("col"), ...data }]);
              showToast("Colportor cadastrado! Ele já pode fazer login pelo telefone.");
            }
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
}

const iconBtn = { background: COL.areia, border: "none", borderRadius: 8, padding: 8, cursor: "pointer", color: COL.grafite, display: "flex" };

function ColportorFormModal({ colportor, campanhas, onClose, onSave }) {
  const [nome, setNome] = useState(colportor?.nome || "");
  const [telefone, setTelefone] = useState(colportor?.telefone || "");
  const [senha, setSenha] = useState(colportor?.senha || "");
  const [segmento, setSegmento] = useState(colportor?.segmento || SEGMENTOS[0]);
  const [nascimento, setNascimento] = useState(colportor?.nascimento || "");
  const [categoria, setCategoria] = useState(colportor?.categoria || CATEGORIAS_COLPORTOR[0]);
  const [campanhaId, setCampanhaId] = useState(colportor?.campanhaId || "");
  const [colegio, setColegio] = useState(colportor?.colegio || COLEGIOS[0]);
  const [curso, setCurso] = useState(colportor?.curso || SEMESTRALIDADES.find((s) => s.colegio === (colportor?.colegio || COLEGIOS[0]))?.curso || "");
  const [tipoPermanente, setTipoPermanente] = useState(colportor?.tipoPermanente || TIPOS_PERMANENTE[0]);
  const [nivelPermanente, setNivelPermanente] = useState(colportor?.nivelPermanente || NIVEIS_PERMANENTE[0]);
  const [cotaReduzida, setCotaReduzida] = useState(colportor?.cotaReduzida || false);

  const cursosDoColegio = SEMESTRALIDADES.filter((s) => s.colegio === colegio);
  const campanhasDaCategoria = campanhas.filter((c) => c.categoria === categoria);
  const metaCalculada = categoria === "Permanentes"
    ? calcularMetaPermanente(tipoPermanente, nivelPermanente, nivelPermanente === "Credenciado" && cotaReduzida)
    : calcularMetaEstudante(colegio, curso);

  useEffect(() => {
    if (cursosDoColegio.length > 0 && !cursosDoColegio.some((c) => c.curso === curso)) {
      setCurso(cursosDoColegio[0].curso);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colegio]);

  // Mantém uma campanha sempre selecionada para categorias de campanha.
  useEffect(() => {
    if (categoria !== "Permanentes" && campanhasDaCategoria.length > 0 && !campanhasDaCategoria.some((c) => c.id === campanhaId)) {
      setCampanhaId(campanhasDaCategoria[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoria, campanhas.length]);

  function submit() {
    if (!nome.trim() || !telefone.trim() || !senha || senha.length < 4) {
      alert("Preencha nome, telefone e uma senha com pelo menos 4 caracteres.");
      return;
    }
    if (categoria !== "Permanentes" && !campanhaId) {
      alert("Selecione a campanha do colportor. O cadastro precisa estar vinculado a uma campanha.");
      return;
    }
    if (!metaCalculada) {
      alert("Não foi possível calcular a meta. Confira as opções selecionadas.");
      return;
    }
    onSave({
      nome: nome.trim(), telefone: telefone.trim(), senha, segmento, categoria, meta: metaCalculada,
      nascimento: nascimento || null,
      status: colportor?.status || "aprovado",
      ...(categoria === "Permanentes"
        ? { tipoPermanente, nivelPermanente, cotaReduzida: nivelPermanente === "Credenciado" ? cotaReduzida : false }
        : { campanhaId, colegio, curso }),
    });
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(27,58,75,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 16 }}>
      <div style={{ background: COL.branco, borderRadius: 18, padding: 24, width: "100%", maxWidth: 420, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ fontFamily: FONT_SERIF, color: COL.petroleo, margin: 0, fontSize: 19 }}>
            {colportor ? "Editar colportor" : "Novo colportor"}
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#8A8478" }}><X size={20} /></button>
        </div>

        <label style={lbl}>Nome completo</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} style={inp} placeholder="Ex.: João da Silva Santos" />

        <label style={lbl}>Telefone (será o login)</label>
        <input value={telefone} onChange={(e) => setTelefone(e.target.value)} style={inp} placeholder="(00) 00000-0000" />

        <label style={lbl}>Senha de acesso</label>
        <input value={senha} onChange={(e) => setSenha(e.target.value)} style={inp} placeholder="Mínimo 4 caracteres" />

        <label style={lbl}>Data de nascimento</label>
        <input type="date" value={nascimento} max={todayStr()} onChange={(e) => setNascimento(e.target.value)} style={inp} />

        <label style={lbl}>Categoria</label>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={inp}>
          {CATEGORIAS_COLPORTOR.map((c) => <option key={c}>{c}</option>)}
        </select>

        <label style={lbl}>Segmento de atuação</label>
        <select value={segmento} onChange={(e) => setSegmento(e.target.value)} style={inp}>
          {SEGMENTOS.map((s) => <option key={s}>{s}</option>)}
        </select>

        {categoria === "Permanentes" ? (
          <>
            <label style={lbl}>Tipo</label>
            <select value={tipoPermanente} onChange={(e) => setTipoPermanente(e.target.value)} style={inp}>
              {TIPOS_PERMANENTE.map((t) => <option key={t}>{t}</option>)}
            </select>

            <label style={lbl}>Categoria de colportor</label>
            <select value={nivelPermanente} onChange={(e) => setNivelPermanente(e.target.value)} style={inp}>
              {NIVEIS_PERMANENTE.map((n) => <option key={n}>{n}</option>)}
            </select>

            {nivelPermanente === "Credenciado" && (
              <>
                <label style={lbl}>Tem cota reduzida?</label>
                <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                  {[{ id: false, label: "Não" }, { id: true, label: "Sim" }].map((opt) => (
                    <button
                      key={String(opt.id)}
                      onClick={() => setCotaReduzida(opt.id)}
                      className="lib-btn"
                      style={{
                        flex: 1, padding: "11px 6px", borderRadius: 10, border: `1.5px solid ${cotaReduzida === opt.id ? COL.terracota : COL.areiaEscura}`,
                        cursor: "pointer", background: cotaReduzida === opt.id ? `${COL.terracota}14` : COL.branco,
                        color: cotaReduzida === opt.id ? COL.terracota : COL.grafite, fontWeight: 700, fontSize: 12.5,
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                {cotaReduzida && (
                  <p style={{ fontSize: 11.5, color: COL.oliva, background: `${COL.oliva}10`, border: `1px dashed ${COL.oliva}`, borderRadius: 10, padding: "9px 12px", marginBottom: 16, lineHeight: 1.5 }}>
                    Cota reduzida: {fmt(COTA_REDUZIDA_VALOR)}/mês — exceção para Credenciado com mais de 25 anos na função.
                  </p>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <label style={lbl}>Campanha</label>
            {campanhasDaCategoria.length === 0 ? (
              <p style={{ fontSize: 12, color: COL.vermelho, background: `${COL.vermelho}10`, border: `1px dashed ${COL.vermelho}`, borderRadius: 10, padding: "9px 12px", marginBottom: 16, lineHeight: 1.4 }}>
                Não há campanhas de {categoria} cadastradas. Crie uma campanha na aba Campanhas antes de cadastrar o colportor.
              </p>
            ) : (
              <select value={campanhaId} onChange={(e) => setCampanhaId(e.target.value)} style={inp}>
                {campanhasDaCategoria.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome} ({formatarDataBR(c.inicio)} a {formatarDataBR(c.fim)})</option>
                ))}
              </select>
            )}

            <label style={lbl}>Colégio</label>
            <select value={colegio} onChange={(e) => setColegio(e.target.value)} style={inp}>
              {COLEGIOS.map((c) => <option key={c}>{c}</option>)}
            </select>

            {colegio === COLEGIO_OUTRO ? (
              <p style={{ fontSize: 11.5, color: "#8A8478", background: COL.areia, border: `1px dashed ${COL.areiaEscura}`, borderRadius: 10, padding: "9px 12px", marginBottom: 16, lineHeight: 1.4 }}>
                Sem colégio na lista? Sem problema — a meta vai usar o valor de referência de Teologia (Uniaene).
              </p>
            ) : (
              <>
                <label style={lbl}>Curso</label>
                <select value={curso} onChange={(e) => setCurso(e.target.value)} style={inp}>
                  {cursosDoColegio.map((c) => <option key={c.curso} value={c.curso}>{c.curso}</option>)}
                </select>
              </>
            )}
          </>
        )}

        <div style={{
          background: `${COL.oliva}14`, border: `1.5px solid ${COL.oliva}`, borderRadius: 12,
          padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 12.5, color: "#5C6B57", fontWeight: 700 }}>Meta de vendas</span>
          <span style={{ fontFamily: FONT_SERIF, fontWeight: 800, fontSize: 19, color: COL.oliva }}>{fmt(metaCalculada)}</span>
        </div>

        <button onClick={submit} className="lib-btn" style={{ ...btnPrimary, background: COL.petroleo, marginTop: 4 }}>
          <Check size={16} /> Salvar
        </button>
      </div>
    </div>
  );
}

function AdminRanking({ colportores, stats, relatorios, campanhasSemanas, campanhas = [] }) {
  const [cat, setCat] = useState("Todas");
  const [periodoSelecionado, setPeriodoSelecionado] = useState(null); // { inicio, fim, label } | null
  const [fonte, setFonte] = useState("atual"); // "atual" | id de campanha oficial

  const lista = colportores
    .filter((c) => c.status !== "pendente")
    .filter((c) => cat === "Todas" || c.categoria === cat)
    .map((c) => ({ ...c, vendido: stats[c.id]?.totalVendido || 0, livros: stats[c.id]?.totalLivros || 0 }))
    .sort((a, b) => b.vendido - a.vendido);

  function vendidoDeColportorNoPeriodo(colportorId, inicio, fim) {
    return relatorios
      .filter((r) => r.colportorId === colportorId && r.data >= inicio && r.data <= fim)
      .reduce((s, r) => s + (r.vendas || []).reduce((sv, v) => {
        const item = CATALOGO.find((c) => c.id === v.itemId);
        return sv + (item?.preco || 0) * v.qtd;
      }, 0), 0);
  }

  // Opções de período: só faz sentido com uma categoria específica selecionada
  // (campanha define o período de Estudantes/Sonhando Alto; mês para Permanentes)
  let opcoesPeriodo = [];
  if (cat === "Permanentes") {
    const hojeDate = new Date();
    const inicioAno = `${hojeDate.getFullYear()}-01-01`;
    const fimAno = `${hojeDate.getFullYear()}-12-31`;
    opcoesPeriodo = mesesDoPeriodo(inicioAno, fimAno).filter((m) => m.inicio <= todayStr());
  } else if (cat === "Estudantes" || cat === "Sonhando Alto") {
    const campanhasDaCategoria = campanhasSemanas.filter((s) => (s.categoriaAplicavel || "Estudantes") === cat);
    if (campanhasDaCategoria.length > 0) {
      const hoje = todayStr();
      const campanhaRef = campanhasDaCategoria.find((c) => hoje >= c.inicio && hoje <= c.fim) || campanhasDaCategoria[campanhasDaCategoria.length - 1];
      opcoesPeriodo = semanasDoPeriodo(campanhaRef.inicio, campanhaRef.fim).filter((s) => s.inicio <= hoje);
    }
  }

  const listaDoPeriodo = periodoSelecionado
    ? lista.map((c) => ({ ...c, vendido: vendidoDeColportorNoPeriodo(c.id, periodoSelecionado.inicio, periodoSelecionado.fim) })).sort((a, b) => b.vendido - a.vendido)
    : [];

  function trocarCategoria(novaCat) {
    setCat(novaCat);
    setPeriodoSelecionado(null);
    setFonte("atual");
  }

  const oficiaisDaCategoria = cat === "Todas" ? [] : (campanhas || []).filter((c) => c.resultados && c.resultados.length > 0 && c.categoria === cat);
  const campOficialSel = fonte !== "atual" ? oficiaisDaCategoria.find((c) => c.id === fonte) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
        {["Todas", ...CATEGORIAS_COLPORTOR].map((c) => (
          <button key={c} onClick={() => trocarCategoria(c)} className="lib-btn lib-tab-btn" style={{
            padding: "8px 14px", borderRadius: 9, border: "none", cursor: "pointer", whiteSpace: "nowrap",
            background: cat === c ? COL.petroleo : COL.branco, color: cat === c ? COL.areia : COL.grafite, fontWeight: 700, fontSize: 13,
          }}>{c}</button>
        ))}
      </div>

      {oficiaisDaCategoria.length > 0 && (
        <div style={card}>
          <h3 style={cardTitle}>Qual ranking ver</h3>
          <div style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            <button onClick={() => setFonte("atual")} className="lib-btn" style={{
              padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${fonte === "atual" ? COL.terracota : COL.areiaEscura}`,
              cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
              background: fonte === "atual" ? COL.terracota : COL.branco, color: fonte === "atual" ? COL.branco : COL.grafite,
              fontWeight: 700, fontSize: 12.5,
            }}>
              Atual
            </button>
            {oficiaisDaCategoria.map((c) => {
              const ativo = fonte === c.id;
              return (
                <button key={c.id} onClick={() => setFonte(c.id)} className="lib-btn" style={{
                  padding: "8px 14px", borderRadius: 20, border: `1.5px solid ${ativo ? COL.terracota : COL.areiaEscura}`,
                  cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                  background: ativo ? COL.terracota : COL.branco, color: ativo ? COL.branco : COL.grafite,
                  fontWeight: 700, fontSize: 12.5,
                }}>
                  {c.nome}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {campOficialSel ? (
        <RankingOficial campanha={campOficialSel} meNome="" />
      ) : (
      <>
      <div style={card} key={cat}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {lista.length === 0 && <p style={{ color: "#B0A99A", textAlign: "center" }}>Nenhum colportor nessa categoria.</p>}
          {lista.map((c, i) => (
            <div key={c.id} className="lib-fade-in" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderBottom: i < lista.length - 1 ? "1px solid #F0E9DC" : "none", animationDelay: `${i * 0.03}s` }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: i === 0 ? "#D4A017" : i === 1 ? "#9CA3AF" : i === 2 ? "#B87333" : COL.areia,
                color: i < 3 ? COL.branco : COL.grafite, fontWeight: 800, fontSize: 13, flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: COL.grafite }}>{c.nome}</p>
                <p style={{ margin: 0, fontSize: 11.5, color: "#8A8478" }}>{c.categoria} · {c.livros} livros</p>
              </div>
              <p style={{ margin: 0, fontWeight: 700, color: COL.petroleo, fontFamily: FONT_SERIF, fontSize: 15 }}>{fmt(c.vendido)}</p>
            </div>
          ))}
        </div>
        {lista.length > 0 && <LinhaTotal valor={lista.reduce((s, c) => s + (c.vendido || 0), 0)} />}
      </div>

      {opcoesPeriodo.length > 0 && (
        <div style={card} className="lib-fade-in">
          <h3 style={cardTitle}>Ranking por {cat === "Permanentes" ? "mês" : "semana"}</h3>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 14 }}>
            {opcoesPeriodo.map((p) => {
              const ativo = periodoSelecionado?.inicio === p.inicio && periodoSelecionado?.fim === p.fim;
              return (
                <button
                  key={p.inicio}
                  onClick={() => setPeriodoSelecionado(ativo ? null : p)}
                  className="lib-btn"
                  style={{
                    padding: "7px 12px", borderRadius: 20, border: `1.5px solid ${ativo ? COL.terracota : COL.areiaEscura}`,
                    cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                    background: ativo ? COL.terracota : COL.branco, color: ativo ? COL.branco : COL.grafite,
                    fontWeight: 700, fontSize: 12,
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {!periodoSelecionado ? (
            <p style={{ fontSize: 12.5, color: "#B0A99A", textAlign: "center", padding: "6px 0" }}>
              Escolha {cat === "Permanentes" ? "um mês" : "uma semana"} para ver o ranking daquele período.
            </p>
          ) : (
            <>
              <p style={{ fontSize: 11.5, color: "#8A8478", margin: "0 0 10px" }}>
                {formatarDataBR(periodoSelecionado.inicio)} a {formatarDataBR(periodoSelecionado.fim)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {listaDoPeriodo.length === 0 && <p style={{ color: "#B0A99A", textAlign: "center" }}>Nenhum colportor nessa categoria.</p>}
                {listaDoPeriodo.map((c, i) => (
                  <div key={c.id} className="lib-fade-in" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 8px", borderBottom: i < listaDoPeriodo.length - 1 ? "1px solid #F0E9DC" : "none", animationDelay: `${i * 0.03}s` }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: i === 0 ? "#D4A017" : i === 1 ? "#9CA3AF" : i === 2 ? "#B87333" : COL.areia,
                      color: i < 3 ? COL.branco : COL.grafite, fontWeight: 800, fontSize: 13, flexShrink: 0,
                    }}>{i + 1}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: COL.grafite }}>{c.nome}</p>
                      <p style={{ margin: 0, fontSize: 11.5, color: "#8A8478" }}>{c.categoria}</p>
                    </div>
                    <p style={{ margin: 0, fontWeight: 700, color: COL.petroleo, fontFamily: FONT_SERIF, fontSize: 15 }}>{fmt(c.vendido)}</p>
                  </div>
                ))}
              </div>
              <LinhaTotal valor={listaDoPeriodo.reduce((s, c) => s + (c.vendido || 0), 0)} />
            </>
          )}
        </div>
      )}
      </>
      )}
    </div>
  );
}

/* ============================================================
   SEMANA/QUINZENA/MÊS MÁXIMO — tipos de campanha de premiação
   Estudantes/Sonhando Alto escolhem entre 3 tipos. Permanentes só
   tem o formato "mes_maximo" (meta mínima, todos que baterem ganham).
   ============================================================ */
const TIPOS_SEMANA_MAXIMA = [
  { id: "segmento", label: "Por segmento", desc: "Meta mínima por segmento — só o maior vendedor de cada segmento ganha." },
  { id: "grupo", label: "Por grupos", desc: "Grupos de colportores com meta coletiva — o grupo todo ganha se bater." },
  { id: "periodo", label: "Quinzena Máxima", desc: "Igual à Semana Máxima, só que no período de uma quinzena." },
];
// Agendamento é medido em quantidade de palestras; os demais segmentos em R$.
function unidadeDoSegmento(segmento) {
  return segmento === "Agendamento" ? "quantidade" : "reais";
}
function formatarValorSegmento(valor, segmento) {
  return unidadeDoSegmento(segmento) === "quantidade"
    ? `${valor} palestra${valor === 1 ? "" : "s"}`
    : fmt(valor);
}

function PainelProgressoCampanha({ campanha: s, tipo, colportores, vendidoNoPeriodo }) {
  const hoje = todayStr();
  const encerrada = hoje > s.fim;

  if (tipo === "mes_maximo") {
    const niveis = (s.niveisMeta || []).slice().sort((a, b) => b.meta - a.meta);
    const linhas = colportores.map((c) => {
      const vendido = vendidoNoPeriodo(c.id, s.inicio, s.fim);
      const nivelAlcancado = niveis.find((n) => vendido >= n.meta);
      return { colportor: c, vendido, nivelAlcancado };
    }).sort((a, b) => b.vendido - a.vendido);
    const ganhadores = linhas.filter((l) => l.nivelAlcancado);

    return (
      <div style={{ marginTop: 10, paddingTop: 12, borderTop: `2px solid ${COL.areia}` }} className="lib-fade-in">
        <p style={{ margin: "0 0 10px", fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
          {encerrada ? `Resultado final (${ganhadores.length} ganhador${ganhadores.length === 1 ? "" : "es"})` : "Progresso dos colportores"}
        </p>
        {linhas.length === 0 ? (
          <p style={{ fontSize: 12.5, color: "#B0A99A" }}>Nenhum colportor aprovado nessa categoria.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {linhas.map(({ colportor: c, vendido, nivelAlcancado }) => (
              <div key={c.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 10px",
                borderRadius: 8, background: nivelAlcancado ? `${COL.oliva}10` : COL.areia,
              }}>
                <div>
                  <p style={{ margin: 0, fontSize: 12.5, fontWeight: 700, color: COL.grafite }}>{c.nome}</p>
                  <p style={{ margin: "1px 0 0", fontSize: 11, color: "#8A8478" }}>{fmt(vendido)}</p>
                </div>
                {nivelAlcancado ? (
                  <span style={{ fontSize: 11, fontWeight: 800, color: COL.oliva, textAlign: "right" }}>
                    ✓ {fmt(nivelAlcancado.meta)}{nivelAlcancado.descricao ? ` · ${nivelAlcancado.descricao}` : ""}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: "#B0A99A" }}>sem nível</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (tipo === "grupo") {
    const grupos = s.grupos || [];
    return (
      <div style={{ marginTop: 10, paddingTop: 12, borderTop: `2px solid ${COL.areia}` }} className="lib-fade-in">
        <p style={{ margin: "0 0 10px", fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
          {encerrada ? "Resultado final dos grupos" : "Progresso dos grupos"}
        </p>
        {grupos.length === 0 ? (
          <p style={{ fontSize: 12.5, color: "#B0A99A" }}>Nenhum grupo criado.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {grupos.map((g) => {
              const vendido = g.colportorIds.reduce((sum, id) => sum + vendidoNoPeriodo(id, s.inicio, s.fim), 0);
              const pct = g.meta > 0 ? Math.min(100, (vendido / g.meta) * 100) : 0;
              const bateu = g.meta > 0 && vendido >= g.meta;
              const membros = colportores.filter((c) => g.colportorIds.includes(c.id));
              return (
                <div key={g.id} style={{
                  borderRadius: 10, padding: "10px 12px",
                  background: bateu ? `${COL.oliva}10` : COL.areia,
                  border: bateu ? `1.5px solid ${COL.oliva}` : "1.5px solid transparent",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: COL.grafite }}>{g.nome}{bateu ? " ✓" : ""}</span>
                    <span style={{ fontSize: 12, color: "#8A8478" }}>{fmt(vendido)} de {fmt(g.meta)}</span>
                  </div>
                  <div style={{ height: 8, background: COL.branco, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, borderRadius: 6, background: bateu ? COL.oliva : COL.terracota }} />
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: 11, color: "#8A8478" }}>
                    {membros.map((m) => m.nome.split(" ")[0]).join(", ") || "Sem colportores"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // tipo === "segmento" ou "periodo": progresso por segmento, vencedor único por segmento (quando aplicável)
  const metas = s.metasPorSegmento || {};
  const segmentosComMeta = SEGMENTOS.filter((seg) => metas[seg] > 0);

  return (
    <div style={{ marginTop: 10, paddingTop: 12, borderTop: `2px solid ${COL.areia}` }} className="lib-fade-in">
      <p style={{ margin: "0 0 10px", fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
        {encerrada ? "Resultado final por segmento" : "Progresso por segmento"}
      </p>
      {segmentosComMeta.length === 0 ? (
        <p style={{ fontSize: 12.5, color: "#B0A99A" }}>Nenhuma meta cadastrada por segmento.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {segmentosComMeta.map((seg) => {
            const unidade = unidadeDoSegmento(seg);
            const colportoresDoSegmento = colportores.filter((c) => c.segmento === seg);
            const linhas = unidade === "reais"
              ? colportoresDoSegmento
                  .map((c) => ({ colportor: c, vendido: vendidoNoPeriodo(c.id, s.inicio, s.fim) }))
                  .sort((a, b) => b.vendido - a.vendido)
              : [];
            const metaSeg = metas[seg];
            const vencedor = unidade === "reais" ? linhas.find((l) => l.vendido >= metaSeg) : null;
            const premiacao = tipo === "segmento" ? s.premiacoesPorSegmento?.[seg] : null;

            return (
              <div key={seg} style={{ background: COL.areia, borderRadius: 10, padding: "10px 12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: COL.grafite }}>{seg}</span>
                  <span style={{ fontSize: 11.5, color: "#8A8478" }}>meta: {formatarValorSegmento(metaSeg, seg)}</span>
                </div>

                {unidade === "quantidade" ? (
                  <p style={{ fontSize: 12, color: "#8A8478", margin: 0 }}>
                    Acompanhamento manual (palestras agendadas) — confira com o líder.
                  </p>
                ) : colportoresDoSegmento.length === 0 ? (
                  <p style={{ fontSize: 12, color: "#B0A99A", margin: 0 }}>Nenhum colportor neste segmento.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                    {linhas.map(({ colportor: c, vendido }) => {
                      const ehVencedor = vencedor && vencedor.colportor.id === c.id;
                      return (
                        <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: ehVencedor ? COL.oliva : COL.grafite, fontWeight: ehVencedor ? 800 : 500 }}>
                            {ehVencedor ? "🏆 " : ""}{c.nome}
                          </span>
                          <span style={{ color: ehVencedor ? COL.oliva : "#8A8478", fontWeight: ehVencedor ? 800 : 500 }}>{fmt(vendido)}</span>
                        </div>
                      );
                    })}
                    {vencedor && premiacao?.descricao && (
                      <p style={{ margin: "4px 0 0", fontSize: 11, color: COL.oliva, fontWeight: 700 }}>
                        Premiação: {premiacao.descricao}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}


function AdminSemanas({ semanas, setSemanas, colportores, relatorios, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [categoriaAplicavel, setCategoriaAplicavel] = useState("Estudantes"); // Estudantes | Sonhando Alto | Permanentes
  const [tipoCampanha, setTipoCampanha] = useState("segmento"); // segmento | grupo | periodo | mes_maximo
  const [titulo, setTitulo] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  // Tipo "segmento": meta mínima + 1 premiação por segmento
  const [metasPorSegmento, setMetasPorSegmento] = useState(() => Object.fromEntries(SEGMENTOS.map((s) => [s, 0])));
  const [premiacoesPorSegmento, setPremiacoesPorSegmento] = useState(() => Object.fromEntries(SEGMENTOS.map((s) => [s, { foto: "", descricao: "" }])));

  // Tipo "grupo": lista de grupos com colportores, meta coletiva e premiação
  const [grupos, setGrupos] = useState([]); // [{id, nome, colportorIds, meta, premiacaoFoto, premiacaoDescricao}]

  // Tipo "periodo" (Quinzena Máxima): metas por segmento + premiações compartilhadas
  const [premiacoes, setPremiacoes] = useState([]); // [{ id, foto, descricao }]
  const [novaPremiacaoDesc, setNovaPremiacaoDesc] = useState("");
  const [novaPremiacaoFoto, setNovaPremiacaoFoto] = useState("");

  // Tipo "mes_maximo" (Permanentes): vários níveis de meta (maior ao menor),
  // cada um com sua premiação. O Permanente ganha só o maior nível que bateu.
  const [niveisMeta, setNiveisMeta] = useState([]); // [{id, meta, foto, descricao}]

  function resetCampos() {
    setTitulo(""); setInicio(""); setFim("");
    setMetasPorSegmento(Object.fromEntries(SEGMENTOS.map((s) => [s, 0])));
    setPremiacoesPorSegmento(Object.fromEntries(SEGMENTOS.map((s) => [s, { foto: "", descricao: "" }])));
    setGrupos([]);
    setPremiacoes([]); setNovaPremiacaoDesc(""); setNovaPremiacaoFoto("");
    setNiveisMeta([]);
  }

  function abrirNovo() {
    setEditandoId(null);
    setCategoriaAplicavel("Estudantes");
    setTipoCampanha("segmento");
    resetCampos();
    setShowForm(true);
  }

  function abrirEdicao(s) {
    setEditandoId(s.id);
    setCategoriaAplicavel(s.categoriaAplicavel || "Estudantes");
    setTipoCampanha(s.tipoCampanha || "periodo");
    setTitulo(s.titulo); setInicio(s.inicio); setFim(s.fim);
    setMetasPorSegmento({ ...Object.fromEntries(SEGMENTOS.map((seg) => [seg, 0])), ...(s.metasPorSegmento || {}) });
    setPremiacoesPorSegmento({
      ...Object.fromEntries(SEGMENTOS.map((seg) => [seg, { foto: "", descricao: "" }])),
      ...(s.premiacoesPorSegmento || {}),
    });
    setGrupos(s.grupos || []);
    setPremiacoes(s.premiacoes || []);
    setNovaPremiacaoDesc(""); setNovaPremiacaoFoto("");
    setNiveisMeta(s.niveisMeta || []);
    setShowForm(true);
  }

  function lidarComFoto(callback) {
    return (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        showToast("Imagem muito grande. Escolha um arquivo até 2MB.", "error");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => callback(reader.result);
      reader.readAsDataURL(file);
    };
  }

  function adicionarPremiacao() {
    if (!novaPremiacaoDesc.trim()) {
      showToast("Descreva a premiação antes de adicionar.", "error");
      return;
    }
    setPremiacoes([...premiacoes, { id: uid("prem"), foto: novaPremiacaoFoto, descricao: novaPremiacaoDesc.trim() }]);
    setNovaPremiacaoDesc(""); setNovaPremiacaoFoto("");
  }
  function removerPremiacao(id) {
    setPremiacoes(premiacoes.filter((p) => p.id !== id));
  }

  function adicionarGrupo() {
    setGrupos([...grupos, { id: uid("grp"), nome: `Grupo ${grupos.length + 1}`, colportorIds: [], meta: 0, premiacaoFoto: "", premiacaoDescricao: "" }]);
  }
  function atualizarGrupo(id, patch) {
    setGrupos(grupos.map((g) => g.id === id ? { ...g, ...patch } : g));
  }
  function removerGrupo(id) {
    setGrupos(grupos.filter((g) => g.id !== id));
  }
  function alternarColportorNoGrupo(grupoId, colportorId) {
    setGrupos(grupos.map((g) => {
      if (g.id !== grupoId) return g;
      const ja = g.colportorIds.includes(colportorId);
      return { ...g, colportorIds: ja ? g.colportorIds.filter((id) => id !== colportorId) : [...g.colportorIds, colportorId] };
    }));
  }

  function adicionarNivelMeta() {
    setNiveisMeta([...niveisMeta, { id: uid("niv"), meta: 0, foto: "", descricao: "" }]);
  }
  function atualizarNivelMeta(id, patch) {
    setNiveisMeta(niveisMeta.map((n) => n.id === id ? { ...n, ...patch } : n));
  }
  function removerNivelMeta(id) {
    setNiveisMeta(niveisMeta.filter((n) => n.id !== id));
  }

  const colportoresDaCategoria = colportores.filter((c) => c.categoria === categoriaAplicavel && c.status !== "pendente");
  const nomeMesAtual = NOMES_MESES_LONGO[new Date().getMonth()];
  const nomeMesAtualCapitalizado = nomeMesAtual.charAt(0).toUpperCase() + nomeMesAtual.slice(1) + " de " + new Date().getFullYear();

  const [progressoAbertoId, setProgressoAbertoId] = useState(null);

  // Quanto um colportor vendeu (em R$) dentro de um período, usando os
  // relatórios diários que ele já envia normalmente.
  function vendidoNoPeriodo(colportorId, inicio, fim) {
    return relatorios
      .filter((r) => r.colportorId === colportorId && r.data >= inicio && r.data <= fim)
      .reduce((s, r) => s + (r.vendas || []).reduce((sv, v) => {
        const item = CATALOGO.find((c) => c.id === v.itemId);
        return sv + (item?.preco || 0) * v.qtd;
      }, 0), 0);
  }

  async function salvar() {
    const ehPermanente = categoriaAplicavel === "Permanentes";
    if (!titulo || (!ehPermanente && (!inicio || !fim))) {
      showToast(ehPermanente ? "Preencha o título." : "Preencha título e datas.", "error");
      return;
    }
    const periodoMes = mesAtualComoPeriodo();
    const base = {
      titulo, categoriaAplicavel, tipoCampanha,
      inicio: ehPermanente ? periodoMes.inicio : inicio,
      fim: ehPermanente ? periodoMes.fim : fim,
    };
    let dados = base;
    if (ehPermanente) {
      if (niveisMeta.length === 0) {
        showToast("Adicione ao menos um nível de meta.", "error");
        return;
      }
      const niveisValidos = niveisMeta.filter((n) => Number(n.meta) > 0);
      if (niveisValidos.length === 0) {
        showToast("Defina o valor da meta em ao menos um nível.", "error");
        return;
      }
      const niveisOrdenados = niveisValidos
        .map((n) => ({ ...n, meta: Number(n.meta) || 0 }))
        .sort((a, b) => b.meta - a.meta); // do maior ao menor
      dados = { ...base, tipoCampanha: "mes_maximo", niveisMeta: niveisOrdenados };
    } else if (tipoCampanha === "segmento") {
      dados = {
        ...base,
        metasPorSegmento: Object.fromEntries(Object.entries(metasPorSegmento).map(([k, v]) => [k, Number(v) || 0])),
        premiacoesPorSegmento,
      };
    } else if (tipoCampanha === "grupo") {
      if (grupos.length === 0) {
        showToast("Crie ao menos um grupo.", "error");
        return;
      }
      dados = { ...base, grupos };
    } else {
      dados = {
        ...base,
        metasPorSegmento: Object.fromEntries(Object.entries(metasPorSegmento).map(([k, v]) => [k, Number(v) || 0])),
        premiacoes,
      };
    }

    if (editandoId) {
      await setSemanas(semanas.map((s) => s.id === editandoId ? { ...s, ...dados } : s));
      showToast("Campanha atualizada!");
    } else {
      await setSemanas([...semanas, { id: uid("sem"), ...dados }]);
      showToast("Campanha criada!");
    }
    setShowForm(false);
  }
  async function remover(id) {
    await setSemanas(semanas.filter((s) => s.id !== id));
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <button onClick={showForm ? () => setShowForm(false) : abrirNovo} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota }}>
        <Flame size={17} /> {showForm ? "Cancelar" : "Criar campanha de premiação"}
      </button>

      {showForm && (
        <div style={card} className="lib-fade-in">
          <label style={lbl}>Categoria</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {CATEGORIAS_COLPORTOR.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategoriaAplicavel(cat); if (cat === "Permanentes") setTipoCampanha("mes_maximo"); else if (tipoCampanha === "mes_maximo") setTipoCampanha("segmento"); }}
                className="lib-btn"
                style={{
                  flex: 1, padding: "10px 6px", borderRadius: 10, border: `1.5px solid ${categoriaAplicavel === cat ? COL.terracota : COL.areiaEscura}`,
                  cursor: "pointer", background: categoriaAplicavel === cat ? `${COL.terracota}14` : COL.branco,
                  color: categoriaAplicavel === cat ? COL.terracota : COL.grafite, fontWeight: 700, fontSize: 12,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {categoriaAplicavel !== "Permanentes" && (
            <>
              <label style={lbl}>Tipo de campanha</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
                {TIPOS_SEMANA_MAXIMA.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTipoCampanha(t.id)}
                    className="lib-btn"
                    style={{
                      textAlign: "left", padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${tipoCampanha === t.id ? COL.terracota : COL.areiaEscura}`,
                      cursor: "pointer", background: tipoCampanha === t.id ? `${COL.terracota}14` : COL.branco,
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: tipoCampanha === t.id ? COL.terracota : COL.grafite }}>{t.label}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "#8A8478", lineHeight: 1.4 }}>{t.desc}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          <label style={lbl}>Título da campanha</label>
          <input
            value={titulo} onChange={(e) => setTitulo(e.target.value)} style={inp}
            placeholder={categoriaAplicavel === "Permanentes" ? "Ex.: Mês Máximo de Julho" : tipoCampanha === "periodo" ? "Ex.: Quinzena Máxima de Julho" : "Ex.: Semana Máxima de Julho"}
          />

          {categoriaAplicavel === "Permanentes" ? (
            <div style={{
              background: `${COL.petroleo}0A`, border: `1px dashed ${COL.petroleo}`, borderRadius: 10,
              padding: "10px 12px", marginBottom: 16, fontSize: 12.5, color: COL.grafite, lineHeight: 1.5,
            }}>
              <Calendar size={13} style={{ verticalAlign: -2, marginRight: 5 }} />
              O Mês Máximo vale automaticamente para o mês em que for lançado — <strong>{nomeMesAtualCapitalizado}</strong>. Não é preciso escolher datas.
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Início</label>
                <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} style={inp} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={lbl}>Fim</label>
                <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} style={inp} />
              </div>
            </div>
          )}

          {categoriaAplicavel === "Permanentes" ? (
            <>
              <label style={lbl}>Níveis de meta (do maior ao menor)</label>
              <p style={{ fontSize: 11.5, color: "#8A8478", margin: "-2px 0 12px", lineHeight: 1.4 }}>
                Valores próprios dessa campanha — não é a meta mensal normal. Cada Permanente ganha a premiação só do maior nível que conseguir alcançar.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
                {niveisMeta
                  .slice()
                  .sort((a, b) => Number(b.meta) - Number(a.meta))
                  .map((n, idx) => (
                  <div key={n.id} style={{ background: COL.areia, borderRadius: 12, padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <span style={{
                        width: 22, height: 22, borderRadius: "50%", background: COL.terracota, color: COL.branco,
                        fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>{idx + 1}</span>
                      <span style={{ flex: 1, fontSize: 12, color: "#8A8478", fontWeight: 700 }}>
                        {idx === 0 ? "Nível mais alto" : `Nível ${idx + 1}`}
                      </span>
                      <button onClick={() => removerNivelMeta(n.id)} style={{ background: "none", border: "none", color: COL.vermelho, cursor: "pointer" }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <CurrencyInput value={n.meta} onChange={(v) => atualizarNivelMeta(n.id, { meta: v })} placeholder="0,00" />
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <label style={{
                        width: 40, height: 40, borderRadius: 8, border: `1.5px dashed ${COL.areiaEscura}`, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        background: n.foto ? "transparent" : COL.branco, overflow: "hidden",
                      }}>
                        {n.foto ? (
                          <img src={n.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Plus size={15} color="#B0A99A" />
                        )}
                        <input type="file" accept="image/*" onChange={lidarComFoto((foto) => atualizarNivelMeta(n.id, { foto }))} style={{ display: "none" }} />
                      </label>
                      <input
                        value={n.descricao} onChange={(e) => atualizarNivelMeta(n.id, { descricao: e.target.value })}
                        placeholder="Premiação deste nível" style={{ ...inp, marginBottom: 0, flex: 1, fontSize: 12.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={adicionarNivelMeta} className="lib-btn" style={{
                width: "100%", padding: "10px 0", borderRadius: 10, border: `1.5px dashed ${COL.terracota}`, cursor: "pointer",
                background: "none", color: COL.terracota, fontWeight: 700, fontSize: 13, marginBottom: 16,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <Plus size={15} /> Adicionar nível de meta
              </button>
            </>
          ) : tipoCampanha === "segmento" ? (
            <>
              <label style={lbl}>Meta mínima e premiação por segmento</label>
              <p style={{ fontSize: 11.5, color: "#8A8478", margin: "-2px 0 12px", lineHeight: 1.4 }}>
                Só o maior vendedor de cada segmento ganha, desde que bata a meta mínima.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                {SEGMENTOS.map((seg) => (
                  <div key={seg} style={{ background: COL.areia, borderRadius: 12, padding: 12 }}>
                    <p style={{ margin: "0 0 8px", fontSize: 13, color: COL.grafite, fontWeight: 700 }}>{seg}</p>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        {unidadeDoSegmento(seg) === "quantidade" ? (
                          <input
                            type="number" min={0} value={metasPorSegmento[seg]}
                            onChange={(e) => setMetasPorSegmento((prev) => ({ ...prev, [seg]: Number(e.target.value) }))}
                            placeholder="Nº de palestras" style={{ ...inp, marginBottom: 0 }}
                          />
                        ) : (
                          <CurrencyInput
                            value={metasPorSegmento[seg]}
                            onChange={(v) => setMetasPorSegmento((prev) => ({ ...prev, [seg]: v }))}
                            placeholder="0,00"
                          />
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <label style={{
                        width: 40, height: 40, borderRadius: 8, border: `1.5px dashed ${COL.areiaEscura}`, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        background: premiacoesPorSegmento[seg]?.foto ? "transparent" : COL.branco, overflow: "hidden",
                      }}>
                        {premiacoesPorSegmento[seg]?.foto ? (
                          <img src={premiacoesPorSegmento[seg].foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Plus size={15} color="#B0A99A" />
                        )}
                        <input type="file" accept="image/*" onChange={lidarComFoto((foto) => setPremiacoesPorSegmento((prev) => ({ ...prev, [seg]: { ...prev[seg], foto } })))} style={{ display: "none" }} />
                      </label>
                      <input
                        value={premiacoesPorSegmento[seg]?.descricao || ""}
                        onChange={(e) => setPremiacoesPorSegmento((prev) => ({ ...prev, [seg]: { ...prev[seg], descricao: e.target.value } }))}
                        placeholder="Premiação deste segmento" style={{ ...inp, marginBottom: 0, flex: 1, fontSize: 12.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : tipoCampanha === "grupo" ? (
            <>
              <label style={lbl}>Grupos de colportores</label>
              <p style={{ fontSize: 11.5, color: "#8A8478", margin: "-2px 0 12px", lineHeight: 1.4 }}>
                Monte os grupos e defina a meta coletiva (soma das vendas do grupo) e a premiação de cada um.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 12 }}>
                {grupos.map((g) => (
                  <div key={g.id} style={{ background: COL.areia, borderRadius: 12, padding: 12 }}>
                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                      <input
                        value={g.nome} onChange={(e) => atualizarGrupo(g.id, { nome: e.target.value })}
                        style={{ ...inp, marginBottom: 0, flex: 1, fontWeight: 700 }}
                      />
                      <button onClick={() => removerGrupo(g.id)} style={{ background: "none", border: "none", color: COL.vermelho, cursor: "pointer" }}>
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p style={{ margin: "0 0 6px", fontSize: 11.5, color: "#8A8478", fontWeight: 700 }}>Colportores no grupo ({g.colportorIds.length} selecionado{g.colportorIds.length === 1 ? "" : "s"})</p>
                    {colportoresDaCategoria.length === 0 ? (
                      <p style={{
                        fontSize: 12, color: COL.vermelho, background: `${COL.vermelho}10`, border: `1px dashed ${COL.vermelho}`,
                        borderRadius: 8, padding: "8px 10px", marginBottom: 10, lineHeight: 1.4,
                      }}>
                        Nenhum colportor aprovado em "{categoriaAplicavel}" ainda. Aprove colportores na aba Equipe antes de montar os grupos.
                      </p>
                    ) : (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                        {colportoresDaCategoria.map((c) => {
                          const selecionado = g.colportorIds.includes(c.id);
                          return (
                            <button
                              key={c.id}
                              onClick={() => alternarColportorNoGrupo(g.id, c.id)}
                              className="lib-btn"
                              style={{
                                padding: "6px 10px", borderRadius: 20, border: `1.5px solid ${selecionado ? COL.terracota : COL.areiaEscura}`,
                                cursor: "pointer", background: selecionado ? COL.terracota : COL.branco,
                                color: selecionado ? COL.branco : COL.grafite, fontWeight: 600, fontSize: 11.5,
                              }}
                            >
                              {selecionado ? "✓ " : ""}{c.nome.split(" ")[0]}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <p style={{ margin: "0 0 6px", fontSize: 11.5, color: "#8A8478", fontWeight: 700 }}>Meta coletiva do grupo</p>
                    <div style={{ marginBottom: 10 }}>
                      <CurrencyInput value={g.meta} onChange={(v) => atualizarGrupo(g.id, { meta: v })} placeholder="0,00" />
                    </div>

                    <p style={{ margin: "0 0 6px", fontSize: 11.5, color: "#8A8478", fontWeight: 700 }}>Premiação do grupo</p>
                    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <label style={{
                        width: 40, height: 40, borderRadius: 8, border: `1.5px dashed ${COL.areiaEscura}`, flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                        background: g.premiacaoFoto ? "transparent" : COL.branco, overflow: "hidden",
                      }}>
                        {g.premiacaoFoto ? (
                          <img src={g.premiacaoFoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Plus size={15} color="#B0A99A" />
                        )}
                        <input type="file" accept="image/*" onChange={lidarComFoto((foto) => atualizarGrupo(g.id, { premiacaoFoto: foto }))} style={{ display: "none" }} />
                      </label>
                      <input
                        value={g.premiacaoDescricao} onChange={(e) => atualizarGrupo(g.id, { premiacaoDescricao: e.target.value })}
                        placeholder="Premiação deste grupo" style={{ ...inp, marginBottom: 0, flex: 1, fontSize: 12.5 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={adicionarGrupo} className="lib-btn" style={{
                width: "100%", padding: "10px 0", borderRadius: 10, border: `1.5px dashed ${COL.terracota}`, cursor: "pointer",
                background: "none", color: COL.terracota, fontWeight: 700, fontSize: 13, marginBottom: 16,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                <Plus size={15} /> Adicionar grupo
              </button>
            </>
          ) : (
            <>
              <label style={lbl}>Meta por segmento</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {SEGMENTOS.map((seg) => (
                  <div key={seg} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ flex: 1, fontSize: 13, color: COL.grafite, fontWeight: 600 }}>{seg}</span>
                    <div style={{ width: 150 }}>
                      {unidadeDoSegmento(seg) === "quantidade" ? (
                        <input
                          type="number" min={0} value={metasPorSegmento[seg]}
                          onChange={(e) => setMetasPorSegmento((prev) => ({ ...prev, [seg]: Number(e.target.value) }))}
                          placeholder="Nº de palestras" style={{ ...inp, marginBottom: 0 }}
                        />
                      ) : (
                        <CurrencyInput
                          value={metasPorSegmento[seg]}
                          onChange={(v) => setMetasPorSegmento((prev) => ({ ...prev, [seg]: v }))}
                          placeholder="0,00"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <label style={lbl}>Premiações da campanha</label>
              <div style={{ background: COL.areia, borderRadius: 12, padding: 14, marginBottom: 16 }}>
                {premiacoes.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
                    {premiacoes.map((p) => (
                      <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, background: COL.branco, borderRadius: 10, padding: 8 }}>
                        {p.foto ? (
                          <img src={p.foto} alt="" style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: 44, height: 44, borderRadius: 8, background: COL.areiaEscura, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <Award size={18} color="#B0A99A" />
                          </div>
                        )}
                        <span style={{ flex: 1, fontSize: 13, color: COL.grafite }}>{p.descricao}</span>
                        <button onClick={() => removerPremiacao(p.id)} style={{ background: "none", border: "none", color: COL.vermelho, cursor: "pointer", flexShrink: 0 }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <label style={{
                    width: 44, height: 44, borderRadius: 8, border: `1.5px dashed ${COL.areiaEscura}`, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                    background: novaPremiacaoFoto ? "transparent" : COL.branco, overflow: "hidden",
                  }}>
                    {novaPremiacaoFoto ? (
                      <img src={novaPremiacaoFoto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <Plus size={18} color="#B0A99A" />
                    )}
                    <input type="file" accept="image/*" onChange={lidarComFoto(setNovaPremiacaoFoto)} style={{ display: "none" }} />
                  </label>
                  <input
                    value={novaPremiacaoDesc} onChange={(e) => setNovaPremiacaoDesc(e.target.value)}
                    placeholder="Ex.: Vale-compra R$ 50" style={{ ...inp, marginBottom: 0, flex: 1 }}
                    onKeyDown={(e) => e.key === "Enter" && adicionarPremiacao()}
                  />
                  <button onClick={adicionarPremiacao} className="lib-btn" style={{
                    width: 44, height: 44, borderRadius: 8, border: "none", cursor: "pointer", flexShrink: 0,
                    background: COL.petroleo, color: COL.areia, display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={18} />
                  </button>
                </div>
                <p style={{ fontSize: 11, color: "#8A8478", margin: "8px 0 0", lineHeight: 1.4 }}>
                  Toque no quadro para escolher uma foto (opcional), descreva o prêmio e toque em ✓ para adicionar.
                </p>
              </div>
            </>
          )}

          <button onClick={salvar} className="lib-btn" style={{ ...btnPrimary, background: COL.petroleo }}>
            <Check size={16} /> {editandoId ? "Salvar alterações" : "Criar campanha"}
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {semanas.length === 0 && <p style={{ textAlign: "center", color: "#B0A99A", padding: 20 }}>Nenhuma campanha de premiação criada ainda.</p>}
        {semanas.slice().reverse().map((s) => {
          const tipo = s.categoriaAplicavel === "Permanentes" ? "mes_maximo" : (s.tipoCampanha || "periodo");
          const tipoInfo = TIPOS_SEMANA_MAXIMA.find((t) => t.id === tipo);
          const metas = s.metasPorSegmento || {};
          const temMetas = Object.values(metas).some((v) => v > 0);
          return (
            <div key={s.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <p style={{ margin: 0, fontWeight: 700, color: COL.terracota, fontSize: 15 }}>{s.titulo}</p>
                    <span style={{ fontSize: 10, fontWeight: 700, color: COL.petroleo, background: COL.areia, padding: "2px 8px", borderRadius: 20 }}>
                      {s.categoriaAplicavel || "Estudantes"}
                    </span>
                  </div>
                  <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#8A8478" }}>
                    <Calendar size={12} style={{ verticalAlign: -1, marginRight: 3 }} />
                    {formatarDataBR(s.inicio)} a {formatarDataBR(s.fim)}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: 11.5, color: COL.oliva, fontWeight: 700 }}>
                    {tipo === "mes_maximo" ? "Mês Máximo" : tipoInfo?.label}
                  </p>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => setProgressoAbertoId(progressoAbertoId === s.id ? null : s.id)} className="lib-btn" style={{
                    ...iconBtn, color: progressoAbertoId === s.id ? COL.terracota : COL.grafite,
                    background: progressoAbertoId === s.id ? `${COL.terracota}14` : COL.areia,
                  }}>
                    <BarChart3 size={15} />
                  </button>
                  <button onClick={() => abrirEdicao(s)} style={iconBtn}><Settings size={15} /></button>
                  <button onClick={() => remover(s.id)} style={{ ...iconBtn, color: COL.vermelho }}><Trash2 size={15} /></button>
                </div>
              </div>

              {tipo === "mes_maximo" && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COL.areia}` }}>
                  <p style={{ margin: "0 0 8px", fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>
                    Níveis de meta — ganha o maior que bater
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(s.niveisMeta || []).map((n, idx) => (
                      <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          width: 18, height: 18, borderRadius: "50%", background: idx === 0 ? "#D4A017" : COL.areiaEscura,
                          color: idx === 0 ? COL.branco : COL.grafite, fontSize: 10, fontWeight: 800,
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>{idx + 1}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: COL.oliva, flexShrink: 0 }}>{fmt(n.meta)}</span>
                        {n.descricao && <span style={{ fontSize: 12, color: "#8A8478" }}>· {n.descricao}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tipo === "segmento" && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COL.areia}` }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>Meta mínima e premiação por segmento</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {SEGMENTOS.filter((seg) => metas[seg] > 0).map((seg) => (
                      <div key={seg} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5 }}>
                        <span style={{ color: COL.grafite }}>{seg}</span>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontWeight: 700, color: COL.oliva }}>{formatarValorSegmento(metas[seg], seg)}</div>
                          {s.premiacoesPorSegmento?.[seg]?.descricao && (
                            <div style={{ fontSize: 11, color: "#8A8478" }}>{s.premiacoesPorSegmento[seg].descricao}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tipo === "grupo" && (s.grupos || []).length > 0 && (
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COL.areia}` }}>
                  <p style={{ margin: "0 0 6px", fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>Grupos</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {s.grupos.map((g) => (
                      <div key={g.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                        <span style={{ color: COL.grafite }}>{g.nome} ({g.colportorIds.length})</span>
                        <span style={{ fontWeight: 700, color: COL.oliva }}>{fmt(g.meta)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tipo === "periodo" && (
                <>
                  {temMetas && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COL.areia}` }}>
                      <p style={{ margin: "0 0 6px", fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>Meta por segmento</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {SEGMENTOS.filter((seg) => metas[seg] > 0).map((seg) => (
                          <div key={seg} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5 }}>
                            <span style={{ color: COL.grafite }}>{seg}</span>
                            <span style={{ fontWeight: 700, color: COL.oliva }}>{formatarValorSegmento(metas[seg], seg)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {(s.premiacoes || []).length > 0 && (
                    <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${COL.areia}` }}>
                      <p style={{ margin: "0 0 8px", fontSize: 11, color: "#8A8478", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.4 }}>Premiações</p>
                      <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                        {s.premiacoes.map((p) => (
                          <div key={p.id} style={{ flexShrink: 0, width: 84, textAlign: "center" }}>
                            {p.foto ? (
                              <img src={p.foto} alt="" style={{ width: 64, height: 64, borderRadius: 10, objectFit: "cover", margin: "0 auto" }} />
                            ) : (
                              <div style={{ width: 64, height: 64, borderRadius: 10, background: COL.areia, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Award size={22} color={COL.terracota} />
                              </div>
                            )}
                            <p style={{ fontSize: 10.5, color: "#8A8478", margin: "4px 0 0", lineHeight: 1.3 }}>{p.descricao}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              {progressoAbertoId === s.id && (
                <PainelProgressoCampanha
                  campanha={s} tipo={tipo}
                  colportores={colportores.filter((c) => c.categoria === (s.categoriaAplicavel || "Estudantes") && c.status !== "pendente")}
                  vendidoNoPeriodo={vendidoNoPeriodo}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


const CATEGORIAS_CAMPANHA = ["Estudantes", "Sonhando Alto"];

function AdminLideranca({ lideres, setLideres, colportores, relatoriosLider, showToast }) {
  const pendentes = lideres.filter((l) => l.status === "pendente");
  const aprovados = lideres.filter((l) => l.status !== "pendente");

  async function aprovar(l) {
    await setLideres(lideres.map((x) => x.id === l.id ? { ...x, status: "aprovado" } : x));
    showToast(`${l.nome} foi aprovado como líder e já pode entrar no sistema.`);
  }
  async function rejeitar(l) {
    if (!confirm(`Rejeitar a solicitação de ${l.nome}? O telefone ficará livre para um novo cadastro.`)) return;
    await setLideres(lideres.filter((x) => x.id !== l.id));
    showToast("Solicitação rejeitada e removida.");
  }
  async function excluir(id) {
    if (!confirm("Remover este líder?")) return;
    await setLideres(lideres.filter((l) => l.id !== id));
    showToast("Líder removido.");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {pendentes.length > 0 && (
        <div style={{ ...card, border: `1.5px solid ${COL.terracota}`, background: `${COL.terracota}0A` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Bell size={16} color={COL.terracota} />
            <h3 style={{ ...cardTitle, margin: 0, fontSize: 16 }}>
              {pendentes.length} solicitação{pendentes.length === 1 ? "" : "ões"} de liderança pendente{pendentes.length === 1 ? "" : "s"}
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {pendentes.map((l) => (
              <div key={l.id} style={{ background: COL.branco, borderRadius: 12, padding: 14 }}>
                <p style={{ margin: 0, fontWeight: 700, color: COL.grafite, fontSize: 14.5 }}>{l.nome}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#8A8478" }}>{l.telefone} · Líder de {l.categoria}</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: COL.oliva, fontWeight: 700 }}>Meta: {fmt(l.meta)} (acompanhamento)</p>
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={() => aprovar(l)} className="lib-btn" style={{
                    flex: 1, padding: "9px 0", borderRadius: 9, border: "none", cursor: "pointer",
                    background: COL.oliva, color: COL.branco, fontWeight: 700, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <Check size={15} /> Aprovar
                  </button>
                  <button onClick={() => rejeitar(l)} className="lib-btn" style={{
                    flex: 1, padding: "9px 0", borderRadius: 9, border: `1.5px solid ${COL.vermelho}`, cursor: "pointer",
                    background: COL.branco, color: COL.vermelho, fontWeight: 700, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  }}>
                    <X size={15} /> Rejeitar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={card}>
        <h3 style={cardTitle}>Líderes ativos</h3>
        {aprovados.length === 0 ? (
          <p style={{ textAlign: "center", color: "#B0A99A", padding: 20 }}>Nenhum líder aprovado ainda.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {aprovados.map((l) => {
              const qtdEquipe = colportores.filter((c) =>
                (l.campanhaId ? c.campanhaId === l.campanhaId : c.categoria === l.categoria) && c.status !== "pendente"
              ).length;
              const relsDoLider = relatoriosLider.filter((r) => r.liderId === l.id);
              const totalLivros = relsDoLider.reduce((s, r) => s + (r.livros || 0), 0);
              const confirmados = relsDoLider.filter((r) => r.confirmado).length;
              const pct = l.meta > 0 ? Math.min(100, (totalLivros / l.meta) * 100) : 0;
              return (
                <div key={l.id} style={{ paddingBottom: 12, borderBottom: "1px solid #F0E9DC" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, color: COL.grafite, fontSize: 14.5 }}>{l.nome}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "#8A8478" }}>{l.telefone} · Líder de {l.categoria}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: COL.oliva, fontWeight: 600 }}>{qtdEquipe} colportor{qtdEquipe === 1 ? "" : "es"} na equipe</p>
                    </div>
                    <button onClick={() => excluir(l.id)} style={{ ...iconBtn, color: COL.vermelho }}><Trash2 size={15} /></button>
                  </div>
                  {l.meta > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ height: 7, background: COL.areia, borderRadius: 6, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? COL.oliva : COL.terracota, borderRadius: 6 }} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                        <span style={{ fontSize: 11.5, color: "#8A8478" }}>{totalLivros} livro{totalLivros === 1 ? "" : "s"} de {fmt(l.meta)}</span>
                        <span style={{ fontSize: 11.5, color: "#8A8478" }}>{confirmados}/{relsDoLider.length} confirmados</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function AdminCampanhas({ campanhas, setCampanhas, colportores, showToast }) {
  const [showForm, setShowForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [expandidoId, setExpandidoId] = useState(null);
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIAS_CAMPANHA[0]);
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");

  function abrirNovo() {
    setEditandoId(null);
    setNome(""); setCategoria(CATEGORIAS_CAMPANHA[0]); setInicio(""); setFim("");
    setShowForm(true);
  }
  function abrirEdicao(c) {
    setEditandoId(c.id);
    setNome(c.nome); setCategoria(c.categoria); setInicio(c.inicio); setFim(c.fim);
    setShowForm(true);
  }

  async function salvar() {
    if (!nome.trim() || !inicio || !fim) {
      showToast("Preencha nome e datas da campanha.", "error");
      return;
    }
    if (editandoId) {
      await setCampanhas(campanhas.map((c) => c.id === editandoId
        ? { ...c, nome: nome.trim(), categoria, inicio, fim }
        : c));
      showToast("Campanha atualizada.");
    } else {
      await setCampanhas([...campanhas, { id: uid("camp"), nome: nome.trim(), categoria, inicio, fim }]);
      showToast("Campanha criada!");
    }
    setShowForm(false);
  }

  async function remover(id) {
    const vinculados = colportores.filter((c) => c.campanhaId === id).length;
    if (vinculados > 0 && !confirm(`${vinculados} colportor(es) estão vinculados a essa campanha. Remover mesmo assim?`)) {
      return;
    }
    await setCampanhas(campanhas.filter((c) => c.id !== id));
  }

  function statusCampanha(c) {
    const hoje = todayStr();
    if (hoje < c.inicio) return { texto: "Em breve", cor: COL.petroleo };
    if (hoje > c.fim) return { texto: "Encerrada", cor: "#B0A99A" };
    return { texto: "Em andamento", cor: COL.oliva };
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <button onClick={showForm ? () => setShowForm(false) : abrirNovo} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota }}>
        <Calendar size={17} /> {showForm ? "Cancelar" : "Criar campanha"}
      </button>

      {showForm && (
        <div style={card} className="lib-fade-in">
          <label style={lbl}>Nome da campanha</label>
          <input value={nome} onChange={(e) => setNome(e.target.value)} style={inp} placeholder="Ex.: Estudantes Petrolina" />

          <label style={lbl}>Categoria</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} style={inp}>
            {CATEGORIAS_CAMPANHA.map((c) => <option key={c}>{c}</option>)}
          </select>

          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Início</label>
              <input type="date" value={inicio} onChange={(e) => setInicio(e.target.value)} style={inp} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={lbl}>Fim</label>
              <input type="date" value={fim} onChange={(e) => setFim(e.target.value)} style={inp} />
            </div>
          </div>

          <button onClick={salvar} className="lib-btn" style={{ ...btnPrimary, background: COL.petroleo }}>
            <Check size={16} /> {editandoId ? "Salvar alterações" : "Criar campanha"}
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {campanhas.length === 0 && (
          <p style={{ textAlign: "center", color: "#B0A99A", padding: 20 }}>Nenhuma campanha criada ainda. Crie uma para liberar o cadastro de Estudantes e Sonhando Alto.</p>
        )}
        {campanhas.slice().reverse().map((c) => {
          const inscritos = colportores.filter((col) => col.campanhaId === c.id).length;
          const status = statusCampanha(c);
          return (
            <div key={c.id} style={card}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <p style={{ margin: 0, fontWeight: 800, color: COL.terracota, fontSize: 15 }}>{c.nome}</p>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: status.cor, background: `${status.cor}14`, padding: "2px 8px", borderRadius: 20 }}>
                      {status.texto}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "#8A8478" }}>{c.categoria}</p>
                  <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "#8A8478" }}>
                    <Calendar size={12} style={{ verticalAlign: -1, marginRight: 3 }} />
                    {formatarDataBR(c.inicio)} a {formatarDataBR(c.fim)}
                  </p>
                  <p style={{ margin: "3px 0 0", fontSize: 12.5, color: COL.oliva, fontWeight: 700 }}>
                    {inscritos} colportor{inscritos === 1 ? "" : "es"} inscrito{inscritos === 1 ? "" : "s"}
                  </p>
                  {c.resultados && c.resultados.length > 0 && (
                    <button onClick={() => setExpandidoId(expandidoId === c.id ? null : c.id)} className="lib-btn" style={{
                      margin: "6px 0 0", padding: 0, background: "none", border: "none", cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: COL.petroleo, fontWeight: 700,
                    }}>
                      <Award size={12} />
                      {c.resultados.length} colportores no ranking
                      <ChevronRight size={13} style={{ transform: expandidoId === c.id ? "rotate(90deg)" : "none", transition: "transform .2s" }} />
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button onClick={() => abrirEdicao(c)} style={iconBtn}><Settings size={15} /></button>
                  <button onClick={() => remover(c.id)} style={{ ...iconBtn, color: COL.vermelho }}><Trash2 size={15} /></button>
                </div>
              </div>
              {expandidoId === c.id && c.resultados && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${COL.areia}`, display: "flex", flexDirection: "column", gap: 6 }}>
                  {[...c.resultados]
                    .sort((a, b) => c.tipoResultado === "permanente" ? (b.liquido - a.liquido) : ((a.posicao || 999) - (b.posicao || 999)))
                    .map((r, i) => (
                      <div key={r.nome + i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5 }}>
                        <span style={{ width: 24, color: "#B0A99A", fontWeight: 700, flexShrink: 0 }}>{(c.tipoResultado === "permanente" ? i + 1 : r.posicao)}º</span>
                        <span style={{ flex: 1, color: COL.grafite, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.nome}</span>
                        <span style={{ color: COL.petroleo, fontWeight: 700, whiteSpace: "nowrap" }}>{fmt(c.tipoResultado === "permanente" ? r.liquido : r.vendido)}</span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminAvisos({ avisos, setAvisos, colportores, campanhas, showToast }) {
  const [texto, setTexto] = useState("");
  const [categoria, setCategoria] = useState("Todos");
  const [campanhaId, setCampanhaId] = useState("Todas");

  const campanhasDaCategoria = (categoria === "Estudantes" || categoria === "Sonhando Alto")
    ? campanhas.filter((c) => c.categoria === categoria)
    : [];

  function onTrocarCategoria(novaCategoria) {
    setCategoria(novaCategoria);
    setCampanhaId("Todas");
  }

  async function enviar() {
    if (!texto.trim()) return;
    const destinoCampanha = campanhasDaCategoria.length > 0 && campanhaId !== "Todas" ? campanhaId : null;
    await setAvisos([...avisos, {
      id: uid("av"), texto: texto.trim(), categoria,
      campanhaId: destinoCampanha,
      criadoEm: new Date().toISOString(),
    }]);
    showToast("Aviso enviado para a equipe!");
    setTexto("");
  }
  async function remover(id) {
    await setAvisos(avisos.filter((a) => a.id !== id));
  }

  const hoje = todayStr();
  const lembreteSugerido = `Olá, equipe! Não esqueça de enviar seu relatório diário de hoje (${new Date(hoje + "T00:00").toLocaleDateString("pt-BR")}): ofertas, orações, vendas e livros entregues. Sua fidelidade no relatório nos ajuda a acompanhar e celebrar o trabalho de cada um. 🙏📖`;

  function descricaoDestinatario(a) {
    if (a.categoria === "Todos") return "Todos";
    if (a.campanhaId) {
      const camp = campanhas.find((c) => c.id === a.campanhaId);
      return camp ? `${a.categoria} · ${camp.nome}` : a.categoria;
    }
    return a.categoria;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={card}>
        <h3 style={cardTitle}>Enviar aviso / lembrete</h3>
        <label style={lbl}>Para quem</label>
        <select value={categoria} onChange={(e) => onTrocarCategoria(e.target.value)} style={inp}>
          <option>Todos</option>
          {CATEGORIAS_COLPORTOR.map((c) => <option key={c}>{c}</option>)}
        </select>

        {campanhasDaCategoria.length > 0 && (
          <>
            <label style={lbl}>Campanha (opcional)</label>
            <select value={campanhaId} onChange={(e) => setCampanhaId(e.target.value)} style={inp}>
              <option value="Todas">Todas as campanhas de {categoria}</option>
              {campanhasDaCategoria.map((c) => (
                <option key={c.id} value={c.id}>{c.nome} ({formatarDataBR(c.inicio)} a {formatarDataBR(c.fim)})</option>
              ))}
            </select>
            <p style={{ fontSize: 11.5, color: "#8A8478", margin: "-6px 0 16px", lineHeight: 1.4 }}>
              Permanentes não tem campanha — o aviso vai para todos os colportores permanentes.
            </p>
          </>
        )}

        <label style={lbl}>Mensagem</label>
        <textarea value={texto} onChange={(e) => setTexto(e.target.value)} rows={4} style={{ ...inp, resize: "vertical", fontFamily: FONT_SANS }} placeholder="Escreva o aviso..." />
        <button onClick={() => setTexto(lembreteSugerido)} style={{ background: "none", border: `1.5px dashed ${COL.terracota}`, borderRadius: 10, padding: "9px 12px", color: COL.terracota, fontSize: 12.5, fontWeight: 600, cursor: "pointer", marginBottom: 14, width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}>
          <Sparkles size={14} /> Usar lembrete de relatório diário
        </button>
        <button onClick={enviar} className="lib-btn" style={{ ...btnPrimary, background: COL.terracota }}><Megaphone size={16} /> Enviar aviso</button>
      </div>

      <div style={card}>
        <h3 style={cardTitle}>Avisos enviados</h3>
        {avisos.length === 0 ? (
          <p style={{ color: "#B0A99A", fontSize: 13, textAlign: "center" }}>Nenhum aviso enviado ainda.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {avisos.slice().reverse().map((a) => (
              <div key={a.id} style={{ borderLeft: `3px solid ${COL.terracota}`, paddingLeft: 12, display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: COL.grafite, lineHeight: 1.5 }}>{a.texto}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 11, color: "#B0A99A" }}>{descricaoDestinatario(a)} · {new Date(a.criadoEm).toLocaleDateString("pt-BR")}</p>
                </div>
                <button onClick={() => remover(a.id)} style={{ background: "none", border: "none", color: "#B0A99A", cursor: "pointer", flexShrink: 0 }}><X size={15} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
