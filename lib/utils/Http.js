const axios = require('axios');
axios.defaults.baseURL = 'http://114.132.184.148:9999/';
/**
 * 获取模板地址
 */
const getTemplates = async () => {
    const res = await axios.get('/api/project_template');
    if (res.status === 200 && res.data.code === 200) {
        return res.data.data;
    }
    return undefined;
};

module.exports = {
    getTemplates
};
