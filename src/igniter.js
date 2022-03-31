// Create the ingniter
(function () {
    IGNITER_FILE_NAME = 'igniter';
    DATA_CLIENT_ID_ATTRIBUTE = 'data-client-id';
    MAIN_TUTORIAL_BUTTON_ID = 'tutorialButtonId';
    clientConfig;
    
    async function startTutorialIgniter() {
        const clientId = getClientId();
        clientConfig = await getClientConfiguration(clientId);
        createTutorialUI(clientConfig);
    }

    //- get the client id configutation (simple HTML)
    function getClientId() {
        const igniterScriptElement = document.querySelector(`script[src*='${IGNITER_FILE_NAME}']`);
        return igniterScriptElement.getAttribute(DATA_CLIENT_ID_ATTRIBUTE).trim();
    }

    //- get config file, like tutorial version, topics, completed turorials, UI and common styles (http request)
    async function getClientConfiguration(clientId) {
        const url = `tutorial/${clientId}.json`;
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onload = function () {
                resolve(JSON.parse(request.responseText));
            };
            request.onerror = function () {
                reject();
            };
            request.open('GET', url);
            request.setRequestHeader('accept', 'application/json');
            request.send();
        });
    }

    //- Render Tutorial button
    function createTutorialUI(clientConfig) {
        const fragment = document.createDocumentFragment();

        createTutorialButton(fragment, clientConfig.buttonTemplate);
        createTutorialTopics(fragment, clientConfig);

        const body = document.getElementsByTagName('body')[0];

        const rootHtml = document.createElement('div');
        rootHtml.className = 'tutorial-container';

        const contentHtml = document.createElement('div');
        contentHtml.className = 'tutorial-content';
        contentHtml.appendChild(fragment);

        rootHtml.appendChild(contentHtml);
        body.appendChild(rootHtml);

        const style = document.createElement('style');
        style.id = 'tutorial-style';
        style.innerHTML = clientConfig.css;
        document.head.appendChild(style);

        addListenersToTutorialsButton();
        addListenersToMainButton(clientConfig);
    }

    function createTutorialButton(fragment, htmlTemplate) {
        const childEle = document.createElement('div');
        childEle.id = MAIN_TUTORIAL_BUTTON_ID;
        childEle.className = 'tutorial-button';
        childEle.innerHTML = htmlTemplate;
        fragment.appendChild(childEle);
    }

    function createTutorialTopics(fragment, clientConfig) {
        const rootHtml = document.createElement('div');
        rootHtml.className = 'tutorial-topics-container';
        rootHtml.innerHTML = clientConfig.topicTemplate;
        rootHtml.style = 'display:none';

        const buttonsFragment = document.createDocumentFragment();

        const topics = clientConfig.topics;
        for (let i = 0; i < topics.length; i++) {
            const topicHtml = document.createElement('button');
            topicHtml.className = 'topic-button';
            topicHtml.innerText = topics[i].text;
            topicHtml.setAttribute('tutorial-id', `test${i}`);
            buttonsFragment.appendChild(topicHtml);
        }
        const topicContainer = rootHtml.querySelector('#topicTemplate div.btn-group');
        topicContainer.appendChild(buttonsFragment);

        fragment.appendChild(rootHtml);
    }

    function addListenersToMainButton(clientConfig) {
        const mainButtonEle = document.getElementById(MAIN_TUTORIAL_BUTTON_ID);

        mainButtonEle.addEventListener('click', function () {
            const topicsContainer = document.querySelector('.tutorial-topics-container');
            const isTutorialDisplayed = topicsContainer.style.display === 'none';
            topicsContainer.style.display = isTutorialDisplayed ? 'block' : 'none';

            if (isTutorialDisplayed) {
                getTutorialSDK(clientConfig);
            } else {
                window.TutorialSDK.closeTutorial();
            }
        });
    }

    function addListenersToTutorialsButton() {
        document.addEventListener('click', function (e) {
            if (e.target && e.target.className == 'topic-button') {
                const tutorialId = e.target.getAttribute('tutorial-id');
                const tutorialConf = clientConfig.tutorial.findFirst(tutorial => tutorial.id === tutorialId);
                window.TutorialSDK.starTutorial(tutorialConf);
            }
        });
    }

    //- get the tutorial SDK lazy loaded ***** could be loaded on demand too
    function getTutorialSDK(clientConfig) {
        const url = `tutorial/${clientConfig.version}/tutorialSDK.js`;
        const scriptTutorialEle = document.querySelector(`script[src~="${url}"]`);
        if (!scriptTutorialEle) {
            const bannerScript = document.createElement('script');
            bannerScript.async = true;
            bannerScript.type = 'text/javascript';
            bannerScript.setAttribute('crossorigin', 'true');
            document.getElementsByTagName('head')[0].appendChild(bannerScript);
            bannerScript.setAttribute('src', url);
        }
    }

    startTutorialIgniter();
})();