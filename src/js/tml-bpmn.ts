import 'classlist.js';
import debounce from 'lodash/debounce';
import { BpmnService } from './service/bpmn.service';
import newDiagramXML from './resource/new-diagram.bpmn';

(() => {
    class TMLBpmn {

        _xml: string = '';
        _viewer: any = null;
        _isModeler: boolean = false;
        _isNavigated: boolean = false;
        _isTokenSimulation: boolean = false;
        _bpmnService: any = new BpmnService();
        _parser: DOMParser = new DOMParser();
        _bpmnNodeIndex: any = {};

        _domKeyboardShortcuts: any = null;
        _isShowKeyboardShortcuts: boolean = false;
        _downloadSVG: any = null;
        _downloadDiagram: any = null;

        _onClick: any = null;
        _onSettings: any = null;

        set modeler(val) {
            if (this._isModeler === val) return;
            this._isModeler = val;
            if (this._viewer) {
                this.destroy();
                this.createViewer();
            }
        }

        get modeler() { return this._isModeler; }
        
        set navigated(val) {
            if (this._isNavigated === val) return;
            this._isNavigated = val;
            if (this._viewer) {
                this.destroy();
                this.createViewer();
            }
        }

        get navigated() { return this._isNavigated; }
        
        set tokenSimulation(val) {
            if (this._isTokenSimulation === val) return;
            this._isTokenSimulation = val;
            if (this._viewer) {
                this.destroy();
                this.createViewer();
            }
        }
        
        get tokenSimulation() { return this._isTokenSimulation; }

        set showKeyboardShortcuts(val) {
            if (this._isShowKeyboardShortcuts === val) return;
            this._isShowKeyboardShortcuts = val;
            if (!this._domKeyboardShortcuts) return;
            this._isShowKeyboardShortcuts
                ? this._domKeyboardShortcuts.classList.add('active')
                : this._domKeyboardShortcuts.classList.remove('active');
        }
        
        get showKeyboardShortcuts() {
            return this._isShowKeyboardShortcuts;
        }


        constructor (options: any = { onClick: () => {}, onSettings: () => {} }) {
            this.createViewer();
            this._domKeyboardShortcuts = document.querySelector('.bpmn-keyboard-shortcuts');
            this._downloadSVG = document.querySelector('.download-svg');
            this._downloadDiagram = document.querySelector('.download-diagram');

            this._onClick = options.onClick;
            this._onSettings = options.onSettings;
        }

        createViewer () {
            let xml: string = this._xml === '' ? newDiagramXML: this._xml;
            let paletteProviderModule = this._bpmnService.getPaletteProviderModule();
            let options: any = {
                container: '#bpmn-canvas',
                keyboard: { bindTo: document },
                additionalModules: [
                    paletteProviderModule,
                ]
            }
            
            this._viewer = this.modeler
                ? this._bpmnService.getModelerInstance(options, this.tokenSimulation, this._onSettings)
                : this.navigated ? this._bpmnService.getNavigatedViewerInstance(options, this.tokenSimulation) : this._bpmnService.getViewerInstance(options, this.tokenSimulation);

            this._viewer.importXML(xml, err => {
                if (err) return console.log('error rendering', err);
                this.resetZoom();
            });

            this._viewer.on('commandStack.changed', this.exportArtifacts());
            
            this._viewer.on('element.click', event => {
                var element = event.element,
                    moddle = this._viewer.get('moddle'),
                    businessObject = element.businessObject;
                if (!element.parent) return;
                this._onClick(businessObject);
            });
        }
        
        exportArtifacts () {
            return debounce(() => {
                if (!this._viewer) return;
                if (this._downloadSVG) {
                    this.saveSVG((err, svg) => {
                        this.setEncoded(this._downloadSVG, 'diagram.svg', err ? null : svg);
                    });
                }
                if (this._downloadDiagram) {
                    this.saveDiagram((err, xml) => {
                        this.setEncoded(this._downloadDiagram, 'diagram.bpmn', err ? null : xml);
                        this._xml = xml;
                    });
                }
            }, 500);
        }
    
        getExtension(element, type) {
            if (!element.extensionElements) {
                return null;
            }

            return element.extensionElements.values.filter(function(e) {
                return e.$instanceOf(type);
            })[0];
        }

        setEncoded (link, name, data) {
            var encodedData = encodeURIComponent(data);
        
            if (data) {
                link.classList.add('active');
                link.href = `data:application/bpmn20-xml;charset=UTF-8,${encodedData}`;
                link.download = name
            } else {
                link.classList.remove('active');
            }
        }

        saveSVG (done) {
            this._viewer.saveSVG(done);
        }
        
        saveDiagram (done) {
            this._viewer.saveXML({ format: true }, (err, xml) => done(err, xml));
        }
        
        exportXML () {
            let xxml:any = null;
            this._viewer.saveXML({ format: true }, (err, xml) => {
                if (!err) xxml = xml;
            });
            return xxml;
        }
        
        exportJSON () {
            let json:any = null;
            this._viewer.saveXML({ format: true }, (err, xml) => {
                let xmlDom = this._parser.parseFromString(xml, 'application/xml');
                json = this.buildJSON(this.preprocess(xmlDom.children[0].children));
            });
            // console.log(this._bpmnNodeIndex);
            return json;
        }
        
        preprocess (nodeList: NodeList, processId: string = '', index: any = {}) {
            let catgoryIdx = {
                'bpmn:startEvent': 0,
                'bpmn:endEvent': 10,
                'bpmn:exclusiveGateway': 1,
                'bpmn:parallelGateway': 1,
                'bpmn:task': 2,
                'bpmn:subProcess': 3
            };
            let list = Array.prototype.slice.call(nodeList);
            for (let node of list) {
                if (node.nodeName === 'bpmn:process'
                    || node.nodeName === 'bpmn:subProcess') this.preprocess(node.children, node.id, index);

                if (node.nodeName !== 'bpmndi:BPMNDiagram' && node.nodeName !== 'bpmn:process') {

                    this._bpmnNodeIndex[node.id] = node;
                        
                    let bsO = {};
                    bsO['prcsid'] = node.id;
                    bsO['processname'] = '';
                    bsO['type'] = node.nodeName;
                    bsO['group'] = processId;
                    bsO['catgory'] = catgoryIdx[node.nodeName];
                    bsO['is_begin'] = node.nodeName === 'bpmn:startEvent';
                    bsO['is_end'] = node.nodeName === 'bpmn:endEvent';
                    
                    if (node.nodeName === 'bpmn:startEvent' && node.parentElement.nodeName === 'bpmn:process') bsO['root'] = true;

                    if (node.children.length > 0) {
                        let children = Array.prototype.slice.call(node.children);

                        let incoming = children.filter(child => {
                            if (child.nodeName === 'bpmn:incoming') return child.innerHTML;
                        }).map(incoming => incoming.innerHTML);

                        let outgoing = children.filter(child => {
                            if (child.nodeName === 'bpmn:outgoing') return child;
                        }).map(outgoing => outgoing.innerHTML);

                        if (incoming.length > 0) bsO['processup'] = incoming;
                        if (outgoing.length > 0) bsO['processto'] = outgoing;
                    }

                    if (node.attributes.length > 1) {
                        let attributes = Array.prototype.slice.call(node.attributes);
                        let options = attributes.filter(attr => attr.nodeName === 'tml:options')[0];
                        if (options) {
                            try { bsO['options'] = JSON.parse(options.nodeValue); }
                            catch (e) { bsO['options'] = options.nodeValue; }
                        }
                        let name = attributes.filter(attr => attr.nodeName === 'name')[0];
                        if (name) bsO['processname'] = name.nodeValue;
                    }

                    index[node.id] = bsO;
                }
            }
            return index;
        }

        buildJSON (index: any = {}) {
            let nodes = [];

            for (let key of Object.keys(index)) {
                if (!/^SequenceFlow.*/i.test(key))
                    nodes.push(index[key]);
            }

            for (let i in nodes) {
                
                let bsO = nodes[i];

                if (bsO.processup && bsO.processup.length > 0) {
                    bsO.processup = bsO.processup.map(id => {
                        let node = this._bpmnNodeIndex[id];
                        for (let attr of node.attributes) {
                            if (attr.name === 'sourceRef')
                                return index[attr.nodeValue].prcsid;
                        }
                    });
                }
                
                if (bsO.processto && bsO.processto.length > 0) {
                    bsO.processto = bsO.processto.map(id => {
                        let node = this._bpmnNodeIndex[id];
                        for (let attr of node.attributes) {
                            if (attr.name === 'targetRef')
                                return index[attr.nodeValue].prcsid;
                        }
                    });
                }
            }

            return nodes.filter(node => node.prcsid !== '');
        }

        newDiagram () {
            this._viewer.importXML(newDiagramXML, err => {
                if (err) return console.log('error rendering', err);
                this.resetZoom();
            });
        }
    
        loadXML (xml) {
            if (!this._viewer) return;
            this._viewer.importXML(xml, err => {
                if (err) return console.log('error rendering', err);
                this.resetZoom();
                this._xml = xml;
                this.exportArtifacts()();
            });
        }

        resetZoom () {
            if (!this._viewer) return;
            let canvas = this._viewer.get('canvas');
            canvas.zoom('fit-viewport');
        }
        
        destroy () {
            if (this._viewer) {
                this._viewer.destroy();
                this._viewer = null;
            }
        }
    }

    window.TMLBpmn = TMLBpmn;
})();