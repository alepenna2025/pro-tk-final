
const axios = require('axios');
require('dotenv').config();

const ACCESS_TOKEN = 'EAAMrj5I3CQsBQvbYdOZCCEKGIU9xYNzkCi2Dvoj9MYgj9VHHIEnETKYiRB1xRyCR0E3itEf4Ix9FqsyxxEHRuGctVNTUg2KFkXMtLsE5ppCKf9YFV1VklOZCWDFnyZAaqYSiqhAZC09wZCNset1BQDMZCESsUot6msrFPjCJFA6QvAFVZCKNHGWTfJRrmDlklZAC4sgu';
const GRAPH_API_URL = 'https://graph.facebook.com/v18.0';
const PAGE_ID = '949128981620522';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  header: (msg) => console.log(`${colors.cyan}═${colors.reset} ${msg}`)
};

/**
 * Test 1: Validate Token Permissions
 */
async function testTokenPermissions() {
  log.header('VALIDANDO PERMISSÕES DO TOKEN');
  try {
    const response = await axios.get(`${GRAPH_API_URL}/me/permissions`, {
      params: { access_token: ACCESS_TOKEN }
    });

    const permissions = response.data.data;
    log.success(`Token tem ${permissions.length} permissões:`);
    
    const expectedPermissions = [
      'ads_management',
      'ads_read',
      'manage_notifications',
      'manage_pages',
      'read_insights',
      'rsvp_event'
    ];

    permissions.forEach(perm => {
      if (expectedPermissions.includes(perm.permission)) {
        log.success(`  • ${perm.permission}`);
      } else {
        log.info(`  • ${perm.permission}`);
      }
    });

    return true;
  } catch (error) {
    log.error(`Erro ao validar permissões: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

/**
 * Test 2: Manage Pages - List and Get Page Details
 */
async function testManagePages() {
  log.header('TESTANDO MANAGE_PAGES PERMISSION');
  try {
    // Get all pages the user manages
    const pagesRes = await axios.get(`${GRAPH_API_URL}/me/accounts`, {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'id,name,access_token,category'
      }
    });

    const pages = pagesRes.data.data;
    if (pages.length === 0) {
      log.warn('Nenhuma página disponível');
      return;
    }

    log.success(`${pages.length} página(s) encontrada(s):`);
    pages.forEach(page => {
      log.info(`  • ${page.name} (ID: ${page.id}) - Categoria: ${page.category}`);
    });

    return pages[0]?.id;
  } catch (error) {
    log.error(`Erro ao listar páginas: ${error.response?.data?.error?.message || error.message}`);
    return null;
  }
}

/**
 * Test 3: Read Insights - Analytics Data
 */
async function testReadInsights(pageId) {
  log.header('TESTANDO READ_INSIGHTS PERMISSION');
  try {
    const insightsRes = await axios.get(`${GRAPH_API_URL}/${pageId}/insights`, {
      params: {
        access_token: ACCESS_TOKEN,
        metric: 'page_views,page_fans,page_engaged_users,page_post_engagements',
        period: 'day'
      }
    });

    const insights = insightsRes.data.data;
    if (insights.length === 0) {
      log.warn('Nenhum insight disponível');
      return;
    }

    log.success('Insights coletados:');
    insights.forEach(insight => {
      const value = insight.values?.[0]?.value || 'N/A';
      log.info(`  • ${insight.name}: ${value}`);
    });

    return true;
  } catch (error) {
    log.error(`Erro ao buscar insights: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

/**
 * Test 4: Ads Management - List Ad Accounts
 */
async function testAdsManagement() {
  log.header('TESTANDO ADS_MANAGEMENT PERMISSION');
  try {
    const adAccountsRes = await axios.get(`${GRAPH_API_URL}/me/adaccounts`, {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'id,name,account_status,currency'
      }
    });

    const adAccounts = adAccountsRes.data.data;
    if (adAccounts.length === 0) {
      log.warn('Nenhuma conta de anúncios vinculada');
      return false;
    }

    log.success(`${adAccounts.length} conta(s) de anúncios encontrada(s):`);
    adAccounts.forEach(account => {
      const status = account.account_status === 1 ? '✓ Ativa' : '✗ Inativa';
      log.info(`  • ${account.name} (${status}) - Moeda: ${account.currency}`);
    });

    return true;
  } catch (error) {
    log.error(`Erro ao buscar contas de anúncios: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

/**
 * Test 5: Post to Facebook (requires manage_pages + pages_manage_posts from different token)
 */
async function testPostToFacebook(pageId, caption) {
  log.header('TESTANDO POST NO FACEBOOK');
  try {
    const postRes = await axios.post(`${GRAPH_API_URL}/${pageId}/feed`, {
      message: caption,
      access_token: ACCESS_TOKEN
    });

    log.success(`Post criado! ID: ${postRes.data.id}`);
    return postRes.data.id;
  } catch (error) {
    if (error.response?.data?.error?.code === 200) {
      log.warn('Permissão pages_manage_posts não encontrada no token');
      log.info('Dica: Use o token com permissões pages_manage_posts e pages_read_engagement');
    } else {
      log.error(`Erro ao postar: ${error.response?.data?.error?.message || error.message}`);
    }
    return null;
  }
}

/**
 * Test 6: Get Events for RSVP
 */
async function testRsvpEvent(pageId) {
  log.header('TESTANDO RSVP_EVENT PERMISSION');
  try {
    const eventsRes = await axios.get(`${GRAPH_API_URL}/${pageId}/events`, {
      params: {
        access_token: ACCESS_TOKEN,
        fields: 'id,name,start_time,end_time'
      }
    });

    const events = eventsRes.data.data;
    if (events.length === 0) {
      log.warn('Nenhum evento encontrado para esta página');
      return false;
    }

    log.success(`${events.length} evento(s) encontrado(s):`);
    events.forEach(event => {
      log.info(`  • ${event.name} (${new Date(event.start_time).toLocaleDateString('pt-BR')})`);
    });

    return true;
  } catch (error) {
    log.error(`Erro ao buscar eventos: ${error.response?.data?.error?.message || error.message}`);
    return false;
  }
}

/**
 * MAIN TEST FLOW
 */
async function runCompleteTest() {
  console.log(`\n${'═'.repeat(70)}`);
  console.log('TESTE COMPLETO - FACEBOOK COM NOVAS PERMISSÕES');
  console.log('Permissões: ads_management, ads_read, manage_notifications, manage_pages, read_insights, rsvp_event');
  console.log(`${'═'.repeat(70)}\n`);

  // Test 1: Validate permissions
  const hasPermissions = await testTokenPermissions();
  if (!hasPermissions) {
    log.error('Token inválido ou expirado');
    return;
  }

  console.log('\n');

  // Test 2: Manage Pages
  const pageId = await testManagePages();
  if (!pageId) {
    log.error('Não foi possível obter página');
    return;
  }

  console.log('\n');

  // Test 3: Read Insights
  await testReadInsights(pageId);

  console.log('\n');

  // Test 4: Ads Management
  await testAdsManagement();

  console.log('\n');

  // Test 5: Generate and post caption
  log.header('GERANDO LEGENDA COM IA E TESTANDO POST');
  try {
    const captionRes = await axios.post('http://localhost:3000/api/ai-agent', {
      prompt: 'Promoção de novos cursos de marketing digital',
      action: 'generate_caption',
      model: 'gemini-2.0-flash'
    });

    const caption = captionRes.data.caption;
    log.success('Legenda gerada com sucesso');
    
    console.log('\n');
    
    // Try to post
    await testPostToFacebook(pageId, caption);
  } catch (error) {
    log.error(`Erro ao gerar legenda: ${error.message}`);
  }

  console.log('\n');

  // Test 6: RSVP Event
  await testRsvpEvent(pageId);

  console.log(`\n${'═'.repeat(70)}`);
  log.success('TESTE CONCLUÍDO!');
  console.log(`${'═'.repeat(70)}\n`);
}

runCompleteTest();
