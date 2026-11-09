const http = require('http');
const app = require('./server');
const db = require('./config/db');

// Helper to make HTTP requests to the active in-process server
const makeRequest = (serverPort, path, method, headers = {}, body = null) => {
  return new Promise((resolve, reject) => {
    let payload = null;
    const finalHeaders = { ...headers };

    if (body) {
      payload = typeof body === 'string' ? body : JSON.stringify(body);
      finalHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const options = {
      hostname: '127.0.0.1',
      port: serverPort,
      path,
      method,
      headers: finalHeaders,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, headers: res.headers, body: parsed });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
};

async function runTests() {
  console.log('🚀 Starting Automated Backend Pipeline Tests...\n');
  await db.init();

  // Listen on an available ephemeral port for testing
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const testPort = server.address().port;
  console.log(`📡 In-process test server active on 127.0.0.1:${testPort}`);

  let adminToken = '';
  let createdProductId = '';
  let createdServiceId = '';

  try {
    // 1. Health check
    console.log('\n1. Testing GET /api/health');
    const health = await makeRequest(testPort, '/api/health', 'GET');
    console.log(`   Status: ${health.status}, Stats:`, health.body.stats);
    if (health.status !== 200 || health.body.status !== 'healthy') throw new Error('Health check failed');

    // 2. Auth: Register a new user
    console.log('\n2. Testing POST /api/auth/register (User signup)');
    const testEmail = `tester_${Date.now()}@example.com`;
    const regRes = await makeRequest(
      testPort,
      '/api/auth/register',
      'POST',
      { 'Content-Type': 'application/json' },
      {
        name: 'Pipeline Test User',
        email: testEmail,
        password: 'password123',
        role: 'user',
      }
    );
    console.log(`   Status: ${regRes.status}, Registered:`, regRes.body.user?.email);
    if (regRes.status !== 201 || !regRes.body.token) throw new Error('Signup failed');

    // 3. Auth: Login as Admin
    console.log('\n3. Testing POST /api/auth/login (Admin login)');
    const loginRes = await makeRequest(
      testPort,
      '/api/auth/login',
      'POST',
      { 'Content-Type': 'application/json' },
      {
        email: 'admin@axz.com',
        password: 'admin123',
      }
    );
    console.log(`   Status: ${loginRes.status}, Token received:`, Boolean(loginRes.body.token));
    if (loginRes.status !== 200 || !loginRes.body.token) throw new Error('Admin login failed');
    adminToken = loginRes.body.token;

    // 4. Auth: Verify /api/auth/me
    console.log('\n4. Testing GET /api/auth/me (Token verification)');
    const meRes = await makeRequest(testPort, '/api/auth/me', 'GET', {
      Authorization: `Bearer ${adminToken}`,
    });
    console.log(`   Status: ${meRes.status}, User:`, meRes.body.user?.name, `[Role: ${meRes.body.user?.role}]`);
    if (meRes.status !== 200 || meRes.body.user?.role !== 'admin') throw new Error('Get Me failed');

    // 5. Products: List all products
    console.log('\n5. Testing GET /api/products');
    const prodsRes = await makeRequest(testPort, '/api/products', 'GET');
    console.log(`   Status: ${prodsRes.status}, Product Count:`, prodsRes.body.count);
    if (prodsRes.status !== 200 || !Array.isArray(prodsRes.body.products)) throw new Error('List products failed');

    // 6. Products: Create new product (Admin CRUD)
    console.log('\n6. Testing POST /api/products (Create Product)');
    const createProdRes = await makeRequest(
      testPort,
      '/api/products',
      'POST',
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      {
        name: 'Special Grade Waterproofing Chemical',
        category: 'Chemicals & Additives',
        price: '₹2,450',
        unit: 'Per 20L Drum',
        variety: 'Dr. Fixit Pidifin 2K • SikaTop Seal',
        badge: 'WATERPROOF PRO',
        description: 'Advanced acrylic polymer-modified elastomeric waterproof coating membrane.',
        specs: ['Zero water penetration', 'High crack bridging flexibility', 'Direct brush application'],
        images: ['/uploads/sample-chemical.jpg'],
        inStock: true,
      }
    );
    console.log(`   Status: ${createProdRes.status}, Created Product:`, createProdRes.body.product?.name, `ID: ${createProdRes.body.product?.id}`);
    if (createProdRes.status !== 201 || !createProdRes.body.product?.id) throw new Error('Create product failed');
    createdProductId = createProdRes.body.product?.id;

    // 7. Products: Update product
    console.log(`\n7. Testing PUT /api/products/${createdProductId} (Update Product)`);
    const updateProdRes = await makeRequest(
      testPort,
      `/api/products/${createdProductId}`,
      'PUT',
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      {
        price: '₹2,350',
        badge: 'WATERPROOF PRO 2.0',
      }
    );
    console.log(`   Status: ${updateProdRes.status}, Updated Price:`, updateProdRes.body.product?.price);
    if (updateProdRes.status !== 200 || updateProdRes.body.product?.price !== '₹2,350') throw new Error('Update product failed');

    // 8. Photo Pipeline: Delete photo from product
    console.log(`\n8. Testing DELETE /api/products/${createdProductId}/photos (Photo Pipeline)`);
    const deletePhotoRes = await makeRequest(
      testPort,
      `/api/products/${createdProductId}/photos`,
      'DELETE',
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      {
        photoUrl: '/uploads/sample-chemical.jpg',
      }
    );
    console.log(`   Status: ${deletePhotoRes.status}, Message:`, deletePhotoRes.body.message);
    if (deletePhotoRes.status !== 200) throw new Error('Delete photo failed');

    // 9. Services: Create new service (Admin CRUD)
    console.log('\n9. Testing POST /api/services (Create Service)');
    const createServRes = await makeRequest(
      testPort,
      '/api/services',
      'POST',
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      {
        title: 'Architectural Structural Design Consultation',
        category: 'Engineering & Consultation',
        shortDesc: 'Certified structural engineer vetting of RCC column layouts and beam loads.',
        description: 'Comprehensive structural analysis for multi-story residential and commercial complexes.',
        icon: 'compass',
        features: ['Seismic zone 3/4 compliance check', 'Foundation soil bearing capacity review', 'Bar bending schedule optimization'],
      }
    );
    console.log(`   Status: ${createServRes.status}, Created Service:`, createServRes.body.service?.title, `ID: ${createServRes.body.service?.id}`);
    if (createServRes.status !== 201 || !createServRes.body.service?.id) throw new Error('Create service failed');
    createdServiceId = createServRes.body.service?.id;

    // 10. Services: Update service
    console.log(`\n10. Testing PUT /api/services/${createdServiceId} (Update Service)`);
    const updateServRes = await makeRequest(
      testPort,
      `/api/services/${createdServiceId}`,
      'PUT',
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      {
        shortDesc: 'Updated: Certified structural vetting with 24-hr turnaround.',
      }
    );
    console.log(`   Status: ${updateServRes.status}, Updated shortDesc:`, updateServRes.body.service?.shortDesc);
    if (updateServRes.status !== 200) throw new Error('Update service failed');

    // 11. Inquiries Pipeline: Public Quotation Submission & Admin Pipeline
    console.log('\n11. Testing POST /api/inquiries (Quotation submission from website)');
    const inquiryPostRes = await makeRequest(
      testPort,
      '/api/inquiries',
      'POST',
      { 'Content-Type': 'application/json' },
      {
        name: 'Tanmay Dutta',
        phone: '9073453034',
        material: 'Bricks (1 No. & Solling)',
        location: 'Howrah (Sankrail & Andul)',
        message: 'Need 12,000 bricks & 400 bags cement for site casting.',
      }
    );
    console.log(`   Status: ${inquiryPostRes.status}, Created Inquiry ID: ${inquiryPostRes.body.inquiry?.id}`);
    if (inquiryPostRes.status !== 201) throw new Error('Create inquiry failed');
    const createdInqId = inquiryPostRes.body.inquiry?.id;

    console.log('\n12. Testing GET /api/inquiries (Admin review inquiries)');
    const inquiryGetRes = await makeRequest(testPort, '/api/inquiries', 'GET');
    console.log(`   Status: ${inquiryGetRes.status}, Inquiries count: ${inquiryGetRes.body.count}`);
    if (inquiryGetRes.status !== 200 || inquiryGetRes.body.count < 1) throw new Error('Get inquiries failed');

    console.log(`\n13. Testing PUT /api/inquiries/${createdInqId} (Update Inquiry Status)`);
    const inqUpdateRes = await makeRequest(
      testPort,
      `/api/inquiries/${createdInqId}`,
      'PUT',
      { 'Content-Type': 'application/json' },
      { status: 'contacted', notes: 'Spoke with Tanmay Dutta, shared itemized PDF quotation.' }
    );
    console.log(`   Status: ${inqUpdateRes.status}, Updated status: ${inqUpdateRes.body.inquiry?.status}`);
    if (inqUpdateRes.status !== 200) throw new Error('Update inquiry failed');

    // 14. Cleanup test records
    console.log(`\n14. Testing DELETE /api/products/${createdProductId}, /api/services/${createdServiceId} & /api/inquiries/${createdInqId}`);
    const delProd = await makeRequest(testPort, `/api/products/${createdProductId}`, 'DELETE', {
      Authorization: `Bearer ${adminToken}`,
    });
    console.log(`   Deleted product: ${delProd.status === 200 ? 'OK' : 'FAIL'}`);

    const delServ = await makeRequest(testPort, `/api/services/${createdServiceId}`, 'DELETE', {
      Authorization: `Bearer ${adminToken}`,
    });
    console.log(`   Deleted service: ${delServ.status === 200 ? 'OK' : 'FAIL'}`);

    const delInq = await makeRequest(testPort, `/api/inquiries/${createdInqId}`, 'DELETE');
    console.log(`   Deleted test inquiry: ${delInq.status === 200 ? 'OK' : 'FAIL'}`);

    // 15. Testing Company & Depot Operations API
    console.log('\n15. Testing GET /api/company & PUT /api/company (Depot Details)');
    const getComp = await makeRequest(testPort, '/api/company', 'GET');
    console.log(`   GET /api/company Status: ${getComp.status}, Facility: ${getComp.body.data?.facilityName}`);
    if (getComp.status !== 200 || !getComp.body.data?.facilityName) throw new Error('GET company failed');

    const origFacility = getComp.body.data.facilityName;
    const putComp = await makeRequest(
      testPort,
      '/api/company',
      'PUT',
      { 'Content-Type': 'application/json' },
      { facilityName: `${origFacility} [Verified Site]` }
    );
    console.log(`   PUT /api/company Status: ${putComp.status}, Updated: ${putComp.body.data?.facilityName}`);
    if (putComp.status !== 200 || !putComp.body.data?.facilityName.includes('[Verified Site]')) throw new Error('PUT company failed');

    // Restore original
    await makeRequest(
      testPort,
      '/api/company',
      'PUT',
      { 'Content-Type': 'application/json' },
      { facilityName: origFacility }
    );
    console.log('   Restored original company facility name.');

    // 16. Testing Universal Pricing Table Pipeline (Live Website Sync)
    console.log('\n16. Testing /api/pricing-table (Universal Benchmark Rates)');
    const getPricing = await makeRequest(testPort, '/api/pricing-table', 'GET');
    console.log(`   GET /api/pricing-table Status: ${getPricing.status}, Row Count: ${getPricing.body.count}`);
    if (getPricing.status !== 200 || getPricing.body.count < 8) throw new Error('GET pricing table failed');

    // Create a new benchmark pricing row
    const postPricing = await makeRequest(
      testPort,
      '/api/pricing-table',
      'POST',
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      {
        description: 'Coarse Sand for RCC Casting',
        tag: 'PREMIUM',
        standardUnit: '4 M.Tonns',
        brandVariety: 'Grade-I River Silt Screened',
        benchmarkRate: '₹9,850/-',
      }
    );
    console.log(`   POST /api/pricing-table Status: ${postPricing.status}, Added: ${postPricing.body.item?.description}`);
    if (postPricing.status !== 201 || !postPricing.body.item?.id) throw new Error('POST pricing table row failed');
    const createdPriceRowId = postPricing.body.item.id;

    // Update the benchmark pricing row
    const putPricing = await makeRequest(
      testPort,
      `/api/pricing-table/${createdPriceRowId}`,
      'PUT',
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      {
        benchmarkRate: '₹9,950/-',
      }
    );
    console.log(`   PUT /api/pricing-table Status: ${putPricing.status}, Updated Rate: ${putPricing.body.item?.benchmarkRate}`);
    if (putPricing.status !== 200 || putPricing.body.item?.benchmarkRate !== '₹9,950/-') throw new Error('PUT pricing row failed');

    // Delete test row
    const delPricing = await makeRequest(
      testPort,
      `/api/pricing-table/${createdPriceRowId}`,
      'DELETE',
      {
        Authorization: `Bearer ${adminToken}`,
      }
    );
    console.log(`   DELETE /api/pricing-table Status: ${delPricing.status === 200 ? 'OK' : 'FAIL'}`);
    if (delPricing.status !== 200) throw new Error('DELETE pricing row failed');

    console.log('\n=============================================');
    console.log('✅ ALL BACKEND PIPELINES & CRUD OPERATIONS VERIFIED!');
    console.log('=============================================\n');

    server.close();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ Test pipeline failed:', err);
    if (server) server.close();
    process.exit(1);
  }
}

runTests();
