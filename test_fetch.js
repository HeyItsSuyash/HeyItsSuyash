const axios = require('axios');
const USERNAME = 'HeyItsSuyash';
async function fetchReadme(repoName) {
    try {
        const res = await axios.get(`https://raw.githubusercontent.com/${USERNAME}/${repoName}/main/README.md`);
        let text = res.data;
        text = text.replace(/<[^>]*>?/gm, ''); 
        text = text.replace(/!\[.*?\]\(.*?\)/g, ''); 
        text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
        text = text.replace(/#+\s/g, ''); 
        text = text.replace(/\*\*/g, ''); 
        text = text.replace(/`/g, ''); 
        text = text.replace(/\n+/g, ' ').trim();
        return text.substring(0, 100) + (text.length > 100 ? '...' : '');
    } catch(e) {
        return "No description available.";
    }
}
async function t() {
    console.log(await fetchReadme('HeyItsSuyash'));
    console.log(await fetchReadme('ayyappan-dosa'));
}
t();
