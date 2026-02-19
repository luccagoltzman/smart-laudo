# Smart Laudo

<div align="center">

**Checklist digital para vistoria veicular e laudo cautelar**

Padronize o processo, reduza erros e transmita mais profissionalismo ao cliente.

</div>

---

## Índice

- [O que é o Smart Laudo?](#-o-que-é-o-smart-laudo)
- [Para quem é?](#-para-quem-é)
- [O que o app faz hoje?](#-o-que-o-app-faz-hoje)
- [Como rodar o projeto](#-como-rodar-o-projeto)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Tecnologias](#-tecnologias)
- [Próximos passos (roadmap)](#-próximos-passos-roadmap)

---

## O que é o Smart Laudo?

O **Smart Laudo** é um aplicativo web que funciona como um **checklist digital** para vistorias de veículos. Em vez de usar papel e caneta, o vistoriador preenche tudo no celular ou tablet: dados do carro, documentação, estrutura, pintura, vidros, motor, segurança e outros itens. No final, o sistema mostra um **resumo com nível de risco** (baixo, atenção ou alto), permite **assinar digitalmente**, exibe um **QR Code para validação** e **gera o laudo em PDF** com todas as fotos e a assinatura incluídas.

---

## Para quem é?

- **Profissionais de vistoria** que querem padronizar e acelerar o trabalho em campo  
- **Despachantes e assessorias** que emitem laudos cautelares  
- **Quem quer reduzir risco jurídico** usando um processo claro e rastreável  
- **Clientes** que valorizam relatório organizado e profissional  

---

## O que o app faz hoje?

| Funcionalidade | Descrição |
|----------------|-----------|
| **Identificação do veículo** | Placa, Renavam, chassi, marca, modelo, ano, cor, KM |
| **10 seções de checklist** | Documentação, estrutura, pintura, vidros, VIN, motor, segurança, testes funcionais, rodagem |
| **Status por item** | Cada item pode ser **Aprovado**, **Atenção** ou **Reprovado** |
| **Observações** | Campo de texto opcional em qualquer item |
| **Fotos por item** | Até 4 fotos por item (câmera ou galeria), com miniaturas e remoção individual |
| **Fotos no PDF** | As fotos anexadas entram no laudo em PDF ao lado de cada item |
| **Score de risco** | Cálculo automático: Baixo risco, Atenção ou Alto risco |
| **Resumo da vistoria** | Totais por status, dados do veículo, assinatura e QR Code |
| **Assinatura digital** | Área para assinar com dedo ou mouse; assinatura vai para o PDF |
| **Gerar PDF** | Botão que gera e baixa o laudo em PDF (dados, seções, fotos, assinatura, QR Code) |
| **QR Code de validação** | Cliente escaneia o QR e acessa a página que confirma a autenticidade do laudo |
| **Página Validar** | Rota `/validar/:id` exibe “Laudo válido” e dados do veículo quando o ID existe |
| **Salvamento automático** | Tudo é salvo no navegador (localStorage); ao reabrir, o progresso continua |
| **Mobile-first** | Layout pensado para uso em celular/tablet, com botões grandes e fáceis de tocar |

### Fluxo de uso

1. **Início** → Ver progresso e tocar em *Iniciar checklist* ou *Continuar checklist*  
2. **Checklist** → Preencher identificação do veículo e percorrer as 10 seções, marcando ✓ / ! / ✕ e adicionando observações ou fotos quando quiser  
3. **Resumo** → Ver score de risco, totais por status, **assinar digitalmente**, ver o **QR Code** e tocar em **Gerar PDF do laudo** para baixar o arquivo  
4. **Validação** → O cliente pode escanear o QR Code (ou acessar o link do PDF) para abrir a página de validação e conferir o laudo  

---

## Como rodar o projeto

### Pré-requisitos

- **Node.js** instalado (versão 18 ou superior).  
  - Se não tiver: [baixe em nodejs.org](https://nodejs.org/) e instale.

### Passo a passo

1. **Abra o terminal** na pasta do projeto (`smart-laudo`).

2. **Instale as dependências** (só na primeira vez):
   ```bash
   npm install
   ```

3. **Suba o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Abra no navegador** o endereço que aparecer no terminal (geralmente `http://localhost:5173`).

5. Para **testar no celular** na mesma rede: use o IP do seu computador e a porta (ex.: `http://192.168.1.10:5173`). O Vite mostra o endereço de rede no terminal.

### Outros comandos

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia o app em modo desenvolvimento (com recarregar automático) |
| `npm run build` | Gera a versão otimizada para colocar em um servidor |
| `npm run preview` | Abre a versão de produção localmente, após o `build` |

---

## Estrutura do projeto

```
smart-laudo/
├── src/
│   ├── components/     # Componentes reutilizáveis (botões, cards, status, assinatura, etc.)
│   ├── data/           # Dados do checklist (seções e itens)
│   ├── hooks/          # Lógica de estado (vistoria, fotos, assinatura, salvamento)
│   ├── pages/          # Home, Checklist, Resumo, Validar (/validar/:id)
│   ├── styles/         # Estilos globais (variáveis, reset)
│   ├── types/          # Definições TypeScript (checklist, assinatura)
│   ├── utils/          # Cálculo de risco, geração de PDF, validação
│   ├── App.tsx         # Rotas e estrutura principal
│   └── main.tsx        # Ponto de entrada
├── index.html
├── package.json
└── vite.config.ts
```

Cada componente importante tem seu próprio arquivo **TypeScript** (`.tsx`), **estilo** (`.module.scss`) e **export** (`index.ts`), mantendo o código organizado e fácil de manter.

---

## Tecnologias

- **React 18** – interface e componentes  
- **TypeScript** – tipagem e melhor suporte no editor  
- **Vite** – build e servidor de desenvolvimento rápidos  
- **React Router** – navegação entre páginas  
- **SCSS (módulos)** – estilos por componente, sem conflito de nomes  

---

## Próximos passos (roadmap)

Funcionalidades planejadas para dar ainda mais valor:

- [ ] **Gerar PDF** do laudo automaticamente  
- [ ] **Fotos anexadas** por item no relatório final  
- [ ] **Assinatura digital** do vistoriador  
- [ ] **QR Code** para validar autenticidade do laudo  
- [ ] **Modo offline** (funcionar sem internet em campo)  
- [ ] **Histórico de vistorias** e banco de veículos  
- [ ] **Área do cliente** para consultar o laudo pelo link  

---

<div align="center">

**Smart Laudo** — checklist digital para vistori