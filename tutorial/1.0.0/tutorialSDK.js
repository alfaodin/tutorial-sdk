console.log('BIEN');
(function () {
    let currentStep;
    let tutorialConfig;

    function starTutorial(tutorialConf) {
        currentStep = 0;
        tutorialConfig = tutorialConf;
        renderTutorial();
    }

    async function renderTutorial() {
        //const tutorialTemplate = await getTutorialTemplate();
        createIframeV2();
    }

    function createIframeV2() {
        const embedElement = document.createElement('iframe');
        embedElement.id = 'tutorialIframe';
        embedElement.src = 'html-template/tutorial.html';
        const mainElement = document.getElementById('app-main');
        mainElement.appendChild(embedElement);

        setTimeout(() => {
            const iframe = document.getElementById("tutorialIframe");

            const closeButon = iframe.contentWindow.document.getElementById('close-tutorial-button');
            closeButon.addEventListener('click', closeTutorial);

            const backButon = iframe.contentWindow.document.getElementById('btn-anterior');
            backButon.addEventListener('click', backButonHandler);

            const nextButon = iframe.contentWindow.document.getElementById('btn-siguiente');
            nextButon.addEventListener('click', nextButonHandler);

            backButon.style.display = 'none';

            setDataStep();
        }, 300);
    }

    function nextButonHandler() {
        nextStep(true);
        const iframe = document.getElementById("tutorialIframe");
        const nextButon = iframe.contentWindow.document.getElementById('btn-siguiente');
        const backButon = iframe.contentWindow.document.getElementById('btn-anterior');

        const length = tutorialConfig.steps.length;

        if (currentStep > 0) {
            backButon.style.display = 'block';
        }
        if (currentStep >= length - 1) {
            nextButon.style.display = 'none';
        } else {
            nextButon.style.display = 'block';
        }
    }

    function backButonHandler() {
        nextStep(false);
        const iframe = document.getElementById("tutorialIframe");
        const backButon = iframe.contentWindow.document.getElementById('btn-anterior');
        const nextButon = iframe.contentWindow.document.getElementById('btn-siguiente');

        const length = tutorialConfig.steps.length;

        if (currentStep < length - 1) {
            nextButon.style.display = 'block';
        }
        if (currentStep <= 0) {
            backButon.style.display = 'none';
        } else {
            backButon.style.display = 'block';
        }
    }

    function nextStep(isNextStep) {
        if (isNextStep === true) {
            currentStep++;
        } else {
            currentStep--;
        }
        setDataStep();
    }

    function setDataStep() {
        const iframe = document.getElementById("tutorialIframe");
        const iDom = iframe.contentWindow.document;

        const tutorialData = tutorialConfig.steps[currentStep];
        const titleElement = iDom.getElementById('tutorial-title');
        titleElement.innerText = tutorialData.title;

        const descriptionElement = iDom.getElementById('tutorial-description');
        descriptionElement.innerText = tutorialData.description;

        const imageElement = iDom.getElementById('tutorial-picture');
        imageElement.setAttribute('src', `${tutorialData.url}`);
    }

    async function getTutorialTemplate() {
        const url = 'html-template/tutorial.html';
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.onload = function () {
                resolve(request.responseText);
            };
            request.onerror = function () {
                reject();
            };
            request.open('GET', url);
            request.setRequestHeader('accept', 'text/xml');
            request.send();
        });
    }

    function createIframe(tutorialTemplate) {
        const iframe = document.createElement('iframe');
        const mainElement = document.querySelector('.tutorial-container');
        mainElement.appendChild(iframe);

        iframe.style.width = '100vw';
        iframe.style.height = '100vh';
        iframe.style.position = 'absolute';
        iframe.style.top = 0;
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(tutorialTemplate);
        iframe.contentWindow.document.close();
    }

    function closeTutorial() {
        console.log('close...');
        const iframe = document.getElementById("tutorialIframe");
        const iDom = iframe.contentWindow.document;

        const closeButon = iDom.getElementById('close-tutorial-button');
        closeButon.removeEventListener('click');

        const backButon = iDom.getElementById('btn-anterior');
        backButon.removeEventListener('click');

        const nextButon = iDom.getElementById('btn-siguiente');
        nextButon.removeEventListener('click');

        iframe.remove();
    }

    window.TutorialSDK = {
        starTutorial,
        closeTutorial
    };
})();