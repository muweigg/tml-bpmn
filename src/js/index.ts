import testXML from './test.bpmn';

window.onload = () => {
    const tmlBpmn = new window.TMLBpmn({
        onClick: businessObject => console.log('onClick: ', businessObject),
        onSettings: businessObject => console.log('onSettings: ', businessObject)
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
            ? ksBtn.classList.remove('bpmn-hide')
            : ksBtn.classList.add('bpmn-hide');
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

    let nodePathHighlighted = document.querySelector('#nodePathHighlighted');
    nodePathHighlighted.addEventListener('click', function () {
        let ids = [
            'StartEvent_1',
            'ExclusiveGateway_1kbxls2',
            'StartEvent_1u8b44m',
            'ExclusiveGateway_0trgzvx',
            'Task_0s46biu',
            ['ExclusiveGateway_1wijtyo', 'Task_07qxgpe'],
        ];
        tmlBpmn.nodePathHighlighted(ids);
    }, false);
}