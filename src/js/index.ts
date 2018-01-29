import testXML from './test.bpmn';

let language: any = {
    "Activate the global connect tool": '关联',
    "Activate the hand tool": '拖动',
    "Activate the lasso tool": '多选',
    "Sub Process": '子处理',
    "Sub Process (collapsed)": '子处理 (折叠)',
    "Sub Process (expanded)": '子处理 (展开)',
    "Create expanded SubProcess": '创建子处理 (展开)',
    "Exclusive Gateway": '排他网关',
    "Parallel Gateway": '并行网关',
    "Default Flow": '默认流',
    "Sequence Flow": '顺序流',
    "Conditional Flow": '条件流',
    "Start Event": '开始事件',
    "End Event": '结束事件',
    "Task": '任务',
    "User Task": '审核任务',
    "Text Annotation": "文本注解",
    "Settings Options": "任务配置",
}

window.onload = () => {
    const tmlBpmn = new window.TMLBpmn({
        language: language,
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
    
    let allowDownload = document.querySelector('#allowDownload');
    allowDownload.addEventListener('click', function () {
        tmlBpmn.allowDownload = !tmlBpmn.allowDownload;
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
            {
                id: 'ExclusiveGateway_1kbxls2',
                color: {
                    task: {
                        'fill': '#d0eba4',
                        'stroke': '#d0eba4',
                    },
                    text: {
                        'fill': '#668431',
                        'stroke': '#668431',
                    }
                }
            },
            {
                id: 'Task_0n9lj4c',
                color: {
                    task: {
                        'stroke': '#ff9800',
                    },
                    text: {
                        'fill': '#ff9800',
                    }
                }
            },
            {
                id: 'ExclusiveGateway_0trgzvx',
                color: {
                    task: {
                        'fill': '#d0eba4',
                        'stroke': '#d0eba4',
                    },
                    text: {
                        'fill': '#668431',
                        'stroke': '#668431',
                    }
                }
            },
            {
                id: 'Task_0s46biu',
                color: {
                    task: {
                        'fill': '#d0eba4',
                        'stroke': '#d0eba4',
                    },
                    text: {
                        'fill': '#668431',
                    }
                }
            },
            {
                id: 'ExclusiveGateway_1wijtyo',
                color: {
                    task: {
                        'fill': '#fff0be',
                        'stroke': '#ff9800',
                    },
                    text: {
                        'fill': '#ff9800',
                        'stroke': '#ff9800',
                    }
                }
            },
            {
                id: 'Task_07qxgpe',
                color: {
                    task: {
                        'fill': '#fff0be',
                        'stroke': '#ff9800',
                    },
                    text: {
                        'fill': '#ff9800',
                    }
                }
            },
        ];
        tmlBpmn.nodePathHighlighted(ids);
    }, false);
}