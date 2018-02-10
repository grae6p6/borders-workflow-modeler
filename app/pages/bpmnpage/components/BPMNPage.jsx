import React from 'react'
import Modeler from 'bpmn-js/dist/bpmn-modeler.production.min';
import debounce from 'lodash/debounce'

import 'bpmn-js-token-simulation/assets/css/bpmn-js-token-simulation.css'
import 'bpmn-js-token-simulation/assets/css/font-awesome.min.css'
import "bpmn-js/assets/bpmn-font/css/bpmn-embedded.css";
import "diagram-js/assets/diagram-js.css";


const newDiagramXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
    "<bpmn2:definitions xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:bpmn2=\"http://www.omg.org/spec/BPMN/20100524/MODEL\" xmlns:bpmndi=\"http://www.omg.org/spec/BPMN/20100524/DI\" xmlns:dc=\"http://www.omg.org/spec/DD/20100524/DC\" xmlns:di=\"http://www.omg.org/spec/DD/20100524/DI\" xsi:schemaLocation=\"http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd\" id=\"sample-diagram\" targetNamespace=\"http://bpmn.io/schema/bpmn\">\n" +
    "  <bpmn2:process id=\"Process_1\" isExecutable=\"false\">\n" +
    "    <bpmn2:startEvent id=\"StartEvent_1\"/>\n" +
    "  </bpmn2:process>\n" +
    "  <bpmndi:BPMNDiagram id=\"BPMNDiagram_1\">\n" +
    "    <bpmndi:BPMNPlane id=\"BPMNPlane_1\" bpmnElement=\"Process_1\">\n" +
    "      <bpmndi:BPMNShape id=\"_BPMNShape_StartEvent_2\" bpmnElement=\"StartEvent_1\">np\n" +
    "        <dc:Bounds height=\"36.0\" width=\"36.0\" x=\"412.0\" y=\"240.0\"/>\n" +
    "      </bpmndi:BPMNShape>\n" +
    "    </bpmndi:BPMNPlane>\n" +
    "  </bpmndi:BPMNDiagram>\n" +
    "</bpmn2:definitions>";


class BPMNPage extends React.Component {

    componentWillMount() {
        this.bpmnModeler = null;
        this.createNewDiagram = this.createNewDiagram.bind(this);
        this.openDiagram = this.openDiagram.bind(this);
        this.registerFileDrop = this.registerFileDrop.bind(this);
        this.saveSVG = this.saveSVG.bind(this);
        this.saveDiagram = this.saveDiagram.bind(this);
    }


    saveSVG(done) {
        this.bpmnModeler.saveSVG(done);
    };

    saveDiagram(done) {
        this.bpmnModeler.saveXML({format: true}, function (err, xml) {
            done(err, xml);
        });
    };

    setEncoded(link, name, data) {
        const encodedData = encodeURIComponent(data);
        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
                'download': name
            });
        } else {
            link.removeClass('active');
        }
    }

    createNewDiagram(event) {
        event.stopPropagation();
        event.preventDefault();
        $('#js-properties-panel').show();
        this.openDiagram(newDiagramXML);
    }

    openDiagram(xml) {
        const that = this;
        this.bpmnModeler.importXML(xml, function (err) {
            if (err) {
                that.container
                    .removeClass('with-diagram')
                    .addClass('with-error');
                that.container.find('.error pre').text(err.message);
                console.error(err);
            } else {
                $('#js-properties-panel').show();
                that.bpmnModeler.get('canvas').zoom('fit-viewport');
                that.container
                    .removeClass('with-error')
                    .addClass('with-diagram');
            }
        });
    }

    registerFileDrop(container, callback) {
        const handleFileSelect = (e) => {
            e.stopPropagation();
            e.preventDefault();

            const files = e.dataTransfer.files;
            const file = files[0];
            const reader = new FileReader();

            reader.onload = function (e) {
                const xml = e.target.result;
                callback(xml);
            };

            reader.readAsText(file);
        };

        const handleDragOver = (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
        };

        container.get(0).addEventListener('dragover', handleDragOver, false);
        container.get(0).addEventListener('drop', handleFileSelect, false);
    }

    componentDidMount() {
        $('#js-properties-panel').hide();
        this.bpmnModeler = new Modeler({
            keyboard: {bindTo: document},
            propertiesPanel: {
                parent: '#js-properties-panel'
            },
            additionalModules: [
                require('bpmn-js-properties-panel'),
                require('bpmn-js-properties-panel/lib/provider/bpmn'),
                require('bpmn-js-token-simulation/lib/modeler')
            ],
            moddleExtensions: {
                camunda: require('camunda-bpmn-moddle/resources/camunda')
            },
        });
        this.bpmnModeler.attachTo("#js-canvas");

        this.container = $('#js-drop-zone');
        this.registerFileDrop(this.container, this.openDiagram);

        const downloadLink = $('#js-download-diagram');
        const downloadSvgLink = $('#js-download-svg');

        const exportArtifacts = debounce(() => {
            this.saveSVG((err, svg) => {
                this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg);
            });

            this.saveDiagram((err, xml) => {
                this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml);
            });
        }, 500);

        this.bpmnModeler.on('commandStack.changed', exportArtifacts);
        const eventBus = this.bpmnModeler.get('eventBus');
        eventBus.on('tokenSimulation.toggleMode', (e) => {
            if (e.simulationModeActive) {
                $('#downloadButtons').hide();
                $('#js-properties-panel').hide();
            } else {
                $('#downloadButtons').show();
                $('#js-properties-panel').show();
            }
        })
    }

    render() {
        return <div>
            <div className="content" name="js-drop-zone" id="js-drop-zone"
                 style={{height: '90%', position: 'absolute'}}>
                <div className="message intro">
                    <div className="note">
                        Drop BPMN diagram from your desktop or <a href="#" onClick={this.createNewDiagram}>create a new
                        diagram</a> to get
                        started.
                    </div>
                </div>
                <div className="message error">
                    <div className="note">
                        <p>Ooops, we could not display the BPMN 2.0 diagram.</p>

                        <div className="details">
                            <span>Cause of the problem:</span>
                            <pre></pre>
                        </div>
                    </div>
                </div>

                <div className="canvas" id="js-canvas"/>
                <div id="js-properties-panel" />

            </div>
            <ul className="buttons" id="downloadButtons">
                <li>
                    Download as:
                </li>
                <li>
                    <a id="js-download-diagram" href="#" title="download BPMN diagram">
                        BPMN diagram
                    </a>
                </li>
                <li>
                    <a id="js-download-svg" href="#" title="download as SVG image">
                        SVG image
                    </a>
                </li>
            </ul>
        </div>
    }
}


export default BPMNPage;