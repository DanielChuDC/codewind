 /*******************************************************************************
 * Copyright (c) 2019 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v20.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 ******************************************************************************/
const { ADMIN_COOKIE, testTimeout } = require('../config');
const reqService = require('./request.service');

const styledTemplates = {
    codewind: {
        label: 'Codewind template',
        description: 'Codewind template',
        language: 'go',
        url: 'https://github.com/codewind-resources/goTemplate',
        projectType: 'docker',
        source: 'Default templates',
        // defaults to projectStyle 'Codewind'
    },
    appsody: {
        label: 'Appsody template',
        description: 'Appsody stack',
        language: 'nodejs',
        url: 'https://github.com/appsody/template/repo',
        projectType: 'nodejs',
        projectStyle: 'Appsody',
    },
};

const templateRepositoryURL = 'https://raw.githubusercontent.com/codewind-resources/codewind-templates/master/devfiles/index.json';

const sampleRepos = {
    codewind: {
        url: templateRepositoryURL,
        description: 'The default set of templates for new projects in Codewind.',
        enabled: true,
        protected: true,
        projectStyles: ['Codewind'],
        name: 'Default templates',
    },
};

const validUrlNotPointingToIndexJson = 'https://support.oneskyapp.com/hc/en-us/article_attachments/202761627/example_1.json';

async function getDefaultTemplatesFromGithub() {
    const { status, text } = await reqService.externalChaiRequest(templateRepositoryURL).get('');
    status.should.equal(200);
    // Parse the index.json into our template format
    const rawTemplates = JSON.parse(text);
    const parsedTemplates = rawTemplates.map(({ displayName, description, language, projectType, location }) => {
        return {
            label: displayName,
            description,
            language,
            url: location,
            projectType,
            source: 'Default templates',
        };
    });
    return parsedTemplates;
}

async function getTemplateRepos() {
    const res = await reqService.chai
        .get('/api/v1/templates/repositories')
        .set('Cookie', ADMIN_COOKIE);
    return res;
}

async function addTemplateRepo(repo) {
    const res = await reqService.chai
        .post('/api/v1/templates/repositories')
        .set('Cookie', ADMIN_COOKIE)
        .send(repo);
    return res;
}

async function deleteTemplateRepo(repoUrl) {
    const res = await reqService.chai
        .delete('/api/v1/templates/repositories')
        .set('Cookie', ADMIN_COOKIE)
        .send({ url: repoUrl });
    return res;
}

async function batchPatchTemplateRepos(operations) {
    const res = await reqService.chai
        .patch('/api/v1/batch/templates/repositories')
        .set('Cookie', ADMIN_COOKIE)
        .send(operations);
    return res;
}

async function enableTemplateRepos(repoUrls) {
    const operations = repoUrls.map(url => {
        return {
            url,
            op: 'enable',
            value: 'true',
        };
    });
    const res = await batchPatchTemplateRepos(operations);
    return res;
}

async function disableTemplateRepos(repoUrls) {
    const operations = repoUrls.map(url => {
        return {
            url,
            op: 'enable',
            value: 'false',
        };
    });
    const res = await batchPatchTemplateRepos(operations);
    return res;
}

async function getTemplates(queryParams) {
    const res = await reqService.chai
        .get('/api/v1/templates')
        .query(queryParams)
        .set('Cookie', ADMIN_COOKIE);
    return res;
}

/**
 * Removes all templates repos known to PFE, and adds the supplied repos
 * @param {[JSON]} repoList
 */
async function setTemplateReposTo(repoList) {
    const reposToDelete = (await getTemplateRepos()).body;
    if (reposToDelete.length > 0) {
        await Promise.all(reposToDelete.map(repo =>
            deleteTemplateRepo(repo.url)
        ));
    }
    await Promise.all(repoList.map(repo =>
        addTemplateRepo(repo)
    ));
}

async function getTemplateStyles() {
    const res = await reqService.chai
        .get('/api/v1/templates/styles')
        .set('Cookie', ADMIN_COOKIE);
    return res;
}

function saveReposBeforeTestAndRestoreAfter() {
    let originalTemplateRepos;
    before(async function() {
        this.timeout(testTimeout.short);
        const res = await getTemplateRepos();
        originalTemplateRepos = res.body;
    });
    after(async function() {
        this.timeout(testTimeout.short);
        await setTemplateReposTo(originalTemplateRepos);
    });
}

function saveReposBeforeEachTestAndRestoreAfterEach() {
    let originalTemplateRepos;
    beforeEach(async function() {
        this.timeout(testTimeout.short);
        const res = await getTemplateRepos();
        originalTemplateRepos = res.body;
    });
    afterEach(async function() {
        this.timeout(testTimeout.short);
        await setTemplateReposTo(originalTemplateRepos);
    });
}

module.exports = {
    getDefaultTemplatesFromGithub,
    styledTemplates,
    templateRepositoryURL,
    sampleRepos,
    validUrlNotPointingToIndexJson,
    getTemplateRepos,
    addTemplateRepo,
    deleteTemplateRepo,
    batchPatchTemplateRepos,
    enableTemplateRepos,
    disableTemplateRepos,
    getTemplates,
    setTemplateReposTo,
    getTemplateStyles,
    saveReposBeforeTestAndRestoreAfter,
    saveReposBeforeEachTestAndRestoreAfterEach,
};
