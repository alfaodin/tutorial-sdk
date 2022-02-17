console.log('BIEN');
(function () {
    function starTutorial(tutorial) {
        console.log('Esta es una prueba ' + tutorial);

        closeTutorial();

        const ele = document.getElementById(tutorial);
        ele.classList.add('tutorial-step-highlight');

        alert('ALQUIMIA! -->', tutorial);
    }
    function closeTutorial() {
        const elements = document.querySelectorAll('.tutorial-step-highlight');
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            element.classList.remove('tutorial-step-highlight');
        }
    }

    window.TutorialSDK = {
        starTutorial,
        closeTutorial
    };
})();