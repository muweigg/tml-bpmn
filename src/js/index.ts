import testXML from './test.bpmn';

window.onload = () => {
    const tmlBpmn = new window.TMLBpmn({
        onClick: businessObject => console.log(businessObject)
    });

    let rsBtn = document.querySelector('.bpmn-auxiliary-tools button:nth-of-type(1)');
    rsBtn.addEventListener('click', function () {
        tmlBpmn.resetZoom();
    }, false);

    let ksBtn = document.querySelector('.bpmn-auxiliary-tools button:nth-of-type(2)');
    ksBtn.addEventListener('click', function () {
        tmlBpmn.showKeyboardShortcuts = !tmlBpmn.showKeyboardShortcuts;
    }, false);

    let navigated = document.querySelector('#navigated');
    navigated.addEventListener('click', function () {
        tmlBpmn.navigated = !tmlBpmn.navigated;
    }, false);
    
    let modeler = document.querySelector('#modeler');
    modeler.addEventListener('click', function () {
        tmlBpmn.modeler = !tmlBpmn.modeler;
        tmlBpmn.modeler
            ? ksBtn.classList.add('bpmn-hide')
            : ksBtn.classList.remove('bpmn-hide');
    }, false);
    
    let tokenSimulation = document.querySelector('#tokenSimulation');
    tokenSimulation.addEventListener('click', function () {
        tmlBpmn.tokenSimulation = !tmlBpmn.tokenSimulation;
    }, false);

    
    let loadTestXML = document.querySelector('#loadTestXML');
    loadTestXML.addEventListener('click', function () {
        tmlBpmn.loadXML(testXML);
    }, false);

    let newDiagram = document.querySelector('#newDiagram');
    newDiagram.addEventListener('click', function () {
        tmlBpmn.newDiagram();
    }, false);

    let exportXML = document.querySelector('#exportXML');
    exportXML.addEventListener('click', function () {
        console.log(tmlBpmn.exportXML());
    }, false);

    let exportJSON = document.querySelector('#exportJSON');
    exportJSON.addEventListener('click', function () {
        console.log(tmlBpmn.exportJSON());
    }, false);
}