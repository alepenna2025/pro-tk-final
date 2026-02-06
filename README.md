# ⬛ Social Media Poster - Instagram & Facebook

Aplicação web moderna para publicar automaticamente no Instagram e Facebook usando IA para gerar legendas. **Tema Dark/Black profissional por padrão.**

## ✨ Funcionalidades

- ⬛ **Design Dark Premium**: Interface Black Theme elegante e profissional
- 🎨 **6 Temas Disponíveis**: Black, Gradient, Dark Blue, Ocean, Sunset, Forest
- 🤖 **IA Avançada**: 8 estilos diferentes de copy (Engajamento, Educacional, Inspiracional, etc)
- 📊 **Análise Inteligente**: Sugestões automáticas para melhorar suas legendas
- 📸 **Upload de Imagens**: Suporte para arquivos locais ou URLs
- 📱 **Instagram Business**: Publicação direta no Instagram
- 👥 **Facebook**: Opção de publicar simultaneamente no Facebook
- ⏰ **Agendamento**: Programe posts para horários específicos
- 🔒 **Seguro**: Autenticação via Facebook Graph API

## 🛠️ Tecnologias

- Next.js 16 + TypeScript
- Tailwind CSS 4
- Facebook Graph API v18.0
- Axios

## 🚀 Instalação Local

```bash
# Clone o repositório
git clone <seu-repositorio>
cd tk-project-main

# Instale as dependências
npm install

# Execute em desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

## 🌐 Deploy na Vercel (Grátis)

### Passo a Passo:

1. **Crie uma conta no GitHub** (se não tiver)
   - Acesse [github.com](https://github.com) e crie uma conta

2. **Envie o código para o GitHub**:
   ```bash
   # Crie um novo repositório no GitHub (via interface web)
   # Depois execute:
   git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy na Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Sign Up" e faça login com GitHub
   - Clique em "Add New Project"
   - Selecione seu repositório
   - Clique em "Deploy"

Pronto! Seu app estará online em poucos minutos.

## 📱 Como Usar

1. Obtenha um token do [Facebook Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Cole o token na tela de login
3. Selecione sua página/Instagram
4. Faça upload de uma imagem
5. Escreva ou gere uma legenda com IA
6. Publique!

## 🔐 Permissões Necessárias

Ao gerar o token, selecione:
- `pages_show_list`
- `pages_read_engagement`
- `instagram_basic`
- `instagram_content_publish`
- `pages_manage_posts` (para Facebook)

## 📄 Licença

MIT License - Livre para uso.
