const axios = require('axios');

async function testNews() {
    console.log('🔍 Testing News Endpoint...\n');
    const baseURL = 'http://localhost:5000/api';

    try {
        // 1. Create a News Item (Admin)
        console.log('1️⃣ Logging in as admin...');
        const loginResponse = await axios.post(`${baseURL}/auth/login`, {
            email: 'admin@citycars.az',
            password: 'Vaqif1988@'
        });
        const token = loginResponse.data.token;
        console.log('✅ Login successful!');

        const api = axios.create({
            baseURL,
            headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('\n2️⃣ Creating a test news article...');
        const newArticle = {
            title: 'Test Article ' + Date.now(),
            content: 'This is a test content for the news article.',
            category: 'Testing',
            author: 'Automated Test'
        };
        const createRes = await api.post('/news', newArticle);
        console.log('✅ Article created:', createRes.data.title);
        const articleId = createRes.data.id;

        // 2. Fetch All News (Public)
        console.log('\n3️⃣ Fetching all news (public)...');
        const fetchRes = await axios.get(`${baseURL}/news`);
        console.log(`✅ Fetched ${fetchRes.data.length} articles.`);
        const found = fetchRes.data.find(n => n.id === articleId);
        if (found) console.log('✅ Created article found in public list.');
        else console.error('❌ Created article NOT found in public list!');

        // 3. Update News Item (Admin)
        console.log('\n4️⃣ Updating the article...');
        const updateRes = await api.put(`/news/${articleId}`, { title: 'Updated Test Title' });
        console.log('✅ Article updated:', updateRes.data.title);

        // 4. Delete News Item (Admin)
        console.log('\n5️⃣ Deleting the article...');
        await api.delete(`/news/${articleId}`);
        console.log('✅ Article deleted.');

        // 5. Verify Deletion
        const verifyRes = await axios.get(`${baseURL}/news`);
        const stillExists = verifyRes.data.find(n => n.id === articleId);
        if (!stillExists) console.log('✅ Verified deletion: Article is gone.');
        else console.error('❌ Error: Article still exists after deletion!');

    } catch (error) {
        console.error('❌ Error:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

testNews();
