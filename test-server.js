import puppeteer from 'puppeteer';

async function testServer() {
  let browser;
  
  try {
    console.log('🚀 Iniciando testes do servidor...');
    
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Teste 1: Verificar se o servidor está respondendo
    console.log('📡 Testando conexão com o servidor...');
    
    try {
      await page.goto('http://localhost:5000', { 
        waitUntil: 'networkidle0',
        timeout: 10000 
      });
      console.log('✅ Servidor respondendo na porta 5000');
    } catch (error) {
      console.log('❌ Erro ao conectar no servidor:', error.message);
      return;
    }
    
    // Teste 2: Verificar se a página principal carrega
    console.log('🔍 Verificando carregamento da página...');
    
    const title = await page.title();
    console.log('📄 Título da página:', title);
    
    // Teste 3: Verificar se há elementos React carregados
    console.log('⚛️ Verificando se React carregou...');
    
    await page.waitForSelector('body', { timeout: 5000 });
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.length > 0) {
      console.log('✅ Conteúdo carregado na página');
    } else {
      console.log('⚠️ Página parece estar vazia');
    }
    
    // Teste 4: Verificar APIs
    console.log('🔌 Testando endpoints da API...');
    
    const apiResponse = await page.evaluate(async () => {
      try {
        const response = await fetch('/api/health');
        return {
          status: response.status,
          ok: response.ok
        };
      } catch (error) {
        return { error: error.message };
      }
    });
    
    if (apiResponse.ok) {
      console.log('✅ API health check funcionando');
    } else {
      console.log('⚠️ API health check:', apiResponse);
    }
    
    // Teste 5: Verificar console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    await page.reload({ waitUntil: 'networkidle0' });
    
    if (consoleErrors.length === 0) {
      console.log('✅ Nenhum erro no console');
    } else {
      console.log('⚠️ Erros encontrados no console:');
      consoleErrors.forEach(error => console.log('   -', error));
    }
    
    console.log('\n🎉 Testes concluídos com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// Executar os testes
testServer();