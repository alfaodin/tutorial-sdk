// Create the ingniter
class Igniter {
    IGNITER_FILE_NAME = 'igniter';
    DATA_CLIENT_ID_ATTRIBUTE = 'data-client-id';
    MAIN_TUTORIAL_BUTTON_ID = 'tutorialButtonId';

    clientId: string;
    clientConfig: ClientConfigurationModel;

    async startTutorialIgniter() {
        const clientId = this.getClientId();
        this.clientConfig = await this.getClientConfiguration(clientId);
        this.createTutorialUI(this.clientConfig);
    }

    //- get the client id configutation (simple HTML)
    getClientId() {
        const igniterScriptElement = document.querySelector(`script[src*='${this.IGNITER_FILE_NAME}']`);
        return igniterScriptElement.getAttribute(this.DATA_CLIENT_ID_ATTRIBUTE).trim();
    }

    //- get config file, like tutorial version, topics, completed turorials, UI and common styles (http request)
    async getClientConfiguration(clientId): Promise<ClientConfigurationModel> {
        const url = `tutorial/${clientId}.json`;
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onload = () => {
                resolve(JSON.parse(request.responseText));
            };
            request.onerror = () => {
                reject();
            };
            request.open('GET', url);
            request.setRequestHeader('accept', 'application/json');
            request.send();
        });
    }

    //- Render Tutorial button
    createTutorialUI(clientConfig) {
        const fragment = document.createDocumentFragment();

        this.createTutorialButton(fragment, clientConfig.buttonTemplate);
        this.createTutorialTopics(fragment, clientConfig);

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

        this.addListenersToTutorialsButton();
        this.addListenersToMainButton(clientConfig);
    }

    createTutorialButton(fragment, htmlTemplate) {
        const childEle = document.createElement('div');
        childEle.id = this.MAIN_TUTORIAL_BUTTON_ID;
        childEle.className = 'tutorial-button';
        childEle.innerHTML = htmlTemplate;
        fragment.appendChild(childEle);
    }

    createTutorialTopics(fragment, clientConfig) {
        const rootHtml: HTMLDivElement = document.createElement('div');
        rootHtml.className = 'tutorial-topics-container';
        rootHtml.innerHTML = clientConfig.topicTemplate;
        rootHtml.style.display = 'none';

        const buttonsFragment = document.createDocumentFragment();

        const topics = clientConfig.topics;
        for (let i = 0; i < topics.length; i++) {
            const topicHtml = document.createElement('button');
            topicHtml.className = 'topic-button';
            topicHtml.innerText = topics[i].text;
            topicHtml.setAttribute('tutorial-id', `${topics[i].tutorialId}`);
            buttonsFragment.appendChild(topicHtml);
        }
        const topicContainer = rootHtml.querySelector('#topicTemplate div.btn-group');
        topicContainer.appendChild(buttonsFragment);

        fragment.appendChild(rootHtml);
    }

    addListenersToMainButton(clientConfig) {
        const mainButtonEle = document.getElementById(this.MAIN_TUTORIAL_BUTTON_ID);

        mainButtonEle.addEventListener('click', () => {
            console.log('SET LOADING STATE');

            const topicsContainer: HTMLDivElement = document.querySelector('.tutorial-topics-container');
            const isTutorialDisplayed = topicsContainer.style.display === 'none';
            topicsContainer.style.display = isTutorialDisplayed ? 'block' : 'none';

            if (isTutorialDisplayed) {
                this.getTutorialSDK(clientConfig);
            } else {
                (window as any).TutorialSDK.closeTutorial();
            }
        });
    }

    addListenersToTutorialsButton() {
        document.addEventListener('click', (e: any) => {
            if (e.target && e.target.className == 'topic-button') {
                const tutorialId = e.target.getAttribute('tutorial-id');
                const tutorialConf = this.clientConfig.tutorial.find(tutorial => `${tutorial.id}` === `${tutorialId}`);
                (window as any).TutorialSDK.starTutorial(tutorialConf);
                
            }
        });
    }

    //- get the tutorial SDK lazy loaded ***** could be loaded on demand too
    getTutorialSDK(clientConfig) {
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
    // WHEN USER CLICKS the TUTORIAL BUTTON
    //- display the topics

    //- users selects the topic through click in buttons
    //- load tutorial configuration
    //- tutorial SDK logic
}

export const igniter = new Igniter();
igniter.startTutorialIgniter();

export interface ClientConfigurationModel {
    css: string;
    version: string;
    topics: string[];
    topicTemplate: string;
    buttonTemplate: string;
    tutorial: any[];
}