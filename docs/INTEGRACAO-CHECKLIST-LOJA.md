# Params necessários para o Checklist Loja funcionar

Este documento descreve os parâmetros e o contrato que o Smart Laudo espera para o **Checklist Loja (Estado do Carro)** funcionar com dados vindos de uma API externa (ex.: Car Manager).

---

## 1. Parâmetro na URL do app

O app precisa receber o **ID do veículo** na rota:

| Parâmetro   | Onde      | Obrigatório | Descrição                          |
|------------|-----------|-------------|-------------------------------------|
| `vehicleId`| Path (URL)| Sim*        | ID do veículo na API externa        |

\* Se não houver `vehicleId`, a tela abre com formulário vazio (entrada manual).

**Exemplos de URL:**
- Com veículo da API: `https://seu-dominio.com/loja/checklist/52`
- Sem veículo: `https://seu-dominio.com/loja/checklist`

---

## 2. Configuração da API (variável de ambiente)

O app chama a API para buscar o veículo. A base da URL é configurável:

| Variável               | Obrigatório | Padrão                         | Descrição                    |
|------------------------|-------------|--------------------------------|-------------------------------|
| `VITE_API_BASE_URL`    | Não         | `https://api.carmanager.com.br`| Base da API (sem `/api` no fim) |
| `VITE_API_TOKEN`       | Recomendado*| —                              | Token Bearer para autenticar na API (evita redirect para /login e CORS) |

\* Necessário se a API exige login; sem token a API redireciona para `/login` e o navegador pode bloquear por CORS.

No `.env`:
```env
VITE_API_BASE_URL=https://api.carmanager.com.br
VITE_API_TOKEN=seu_token_aqui
```

O app fará: `GET {VITE_API_BASE_URL}/api/vehicles/{vehicleId}` com header `Authorization: Bearer {VITE_API_TOKEN}` quando o token estiver definido.

---

## 3. Resposta esperada da API (GET /api/vehicles/:id)

A API deve responder com **JSON** no formato abaixo. Os campos usados pelo checklist estão marcados.

### Campos utilizados pelo Smart Laudo (obrigatórios para preencher o checklist)

| Campo API   | Tipo   | Uso no checklist        |
|-------------|--------|--------------------------|
| `id`        | number | Identificação interna    |
| `plate`     | string | Placa                    |
| `chassis`   | string | Chassi (VIN)             |
| `brand`     | string | Marca                    |
| `model`     | string | Modelo                   |
| `year`      | string | Ano                      |
| `color`     | string | Cor                      |
| `km`        | string | Quilometragem atual      |
| `notes`     | string \| null | Versão/observação (campo "Versão") |

### Exemplo mínimo de resposta (200 OK)

```json
{
  "id": 52,
  "company_id": 2,
  "brand": "Land Rover",
  "model": "Discovery Sport",
  "year": "2021",
  "color": "Branco",
  "plate": "XXX4Y56",
  "chassis": "CHS00050",
  "km": "21000",
  "notes": "Discovery Sport SE",
  "purchase_price": 298000,
  "status": "available",
  "purchase_date": "2024-05-15T03:00:00.000000Z",
  "codigo_fipe": "FPE050",
  "codigo_ano": "2021",
  "vehicleType": null,
  "motor": "2.0 Turbo",
  "cambio": "Automático",
  "is_consignado": false,
  "sale_price": 340000,
  "sale_price_promo": null,
  "expenses": [],
  "images": [],
  "documents": [],
  "sale": null,
  "created_at": "2026-03-10T05:23:21.000000Z",
  "updated_at": "2026-03-10T05:23:21.000000Z",
  "deleted_at": null
}
```

Campos adicionais (ex.: `expenses`, `images`) podem existir; o app não os usa para preencher o checklist, apenas os listados na tabela acima.

### Em caso de erro

- **4xx/5xx:** o app exibe "Erro ao carregar veículo" e a mensagem retornada no corpo da resposta (ou status HTTP).

---

## 4. Resumo para integração

Para o Checklist Loja funcionar com dados da API:

1. **Enviar o usuário para:**  
   `{URL_DO_APP}/loja/checklist/{id_do_veiculo}`  
   Ex.: `https://app.smartlaudo.com.br/loja/checklist/52`

2. **Configurar no app (opcional):**  
   `VITE_API_BASE_URL` no `.env` se a API não for `https://api.carmanager.com.br`.

3. **Garantir que a API responda:**  
   `GET {BASE}/api/vehicles/{id}` com JSON contendo pelo menos:  
   `id`, `plate`, `chassis`, `brand`, `model`, `year`, `color`, `km`, `notes` (ou equivalentes).

4. **CORS:** a API deve permitir requisições do domínio onde o Smart Laudo está hospedado (ex.: `https://smart-laudo.vercel.app`).

5. **Autenticação:** se a API exigir login, defina `VITE_API_TOKEN` no `.env` (token Bearer). Sem token, a API pode redirecionar para `/login` e o navegador pode bloquear por CORS (veja seção 6).

---

## 6. Erro de CORS / redirect para /login

**Mensagem típica:**  
`Access to fetch at 'https://api.carmanager.com.br/login' (redirected from '.../api/vehicles/52') from origin 'https://smart-laudo.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.`

**O que está acontecendo:**

1. O app chama `GET .../api/vehicles/52` **sem** autenticação.
2. A API responde com **redirect (302)** para `.../login` (página de login).
3. O navegador segue o redirect e faz request para `.../login`.
4. A resposta de `/login` (ou do servidor) **não** envia o header `Access-Control-Allow-Origin` permitindo a origem do Smart Laudo.
5. Por segurança, o navegador **bloqueia** o acesso a essa resposta (política CORS).

**Soluções:**

| Ação | Descrição |
|------|-----------|
| **1. Enviar token** | No Smart Laudo, defina `VITE_API_TOKEN` no `.env` (e nas variáveis de ambiente do Vercel) com um token válido da API. O app passará a enviar `Authorization: Bearer <token>` e a API deve responder 200 em `/api/vehicles/:id` em vez de redirecionar. Assim o request não vai para `/login` e o erro de CORS some. |
| **2. CORS no servidor** | Quem administra a API (api.carmanager.com.br) deve configurar CORS para permitir a origem do app (ex.: `Access-Control-Allow-Origin: https://smart-laudo.vercel.app` ou `*`). Isso vale tanto para as rotas de API quanto para a rota de login, se houver redirect. |
| **3. Proxy no backend** | Se não for possível alterar a API nem usar token no front, o Smart Laudo pode usar um backend próprio que chama a API (no servidor não há CORS) e expõe um endpoint que o front chama. |

Recomendação: usar **token** (`VITE_API_TOKEN`) e garantir que a API aceite requisições autenticadas do domínio do app (CORS para a origem do Smart Laudo).

---

## 7. Prompt de integração (copiar/colar)

```
Para integrar com o Checklist Loja do Smart Laudo:

- URL do checklist com veículo: {ORIGEM_DO_APP}/loja/checklist/{VEHICLE_ID}
  Ex.: https://meu-app.com/loja/checklist/52

- O app chama: GET {VITE_API_BASE_URL}/api/vehicles/{VEHICLE_ID}
  Padrão de base: https://api.carmanager.com.br

- A API deve retornar 200 OK com JSON contendo:
  id (number), plate (string), chassis (string), brand (string), model (string),
  year (string), color (string), km (string), notes (string | null).

- Se a API exige autenticação: definir VITE_API_TOKEN no .env (token Bearer) para evitar redirect para /login e erro de CORS.

- Opcional: definir VITE_API_BASE_URL no .env do Smart Laudo para apontar para outra API.
```
