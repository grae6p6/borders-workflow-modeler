import React from 'react'
import debounce from 'lodash/debounce'

import Modeler from '../../../../lib/cmmn-modeler.min';

import 'cmmn-js/assets/cmmn-font/css/cmmn-embedded.css';
import 'cmmn-js/assets/cmmn-font/css/cmmn.css';


const newDiagramXML = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
    "<cmmn:definitions xmlns:dc=\"http://www.omg.org/spec/CMMN/20151109/DC\" xmlns:di=\"http://www.omg.org/spec/CMMN/20151109/DI\" xmlns:cmmndi=\"http://www.omg.org/spec/CMMN/20151109/CMMNDI\" xmlns:cmmn=\"http://www.omg.org/spec/CMMN/20151109/MODEL\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" id=\"Test\" targetNamespace=\"http://bpmn.io/schema/cmmn\">\n" +
    "  <cmmn:case id=\"Case_1\">\n" +
    "    <cmmn:casePlanModel id=\"CasePlanModel_1\" name=\"A CasePlanModel\">\n" +
    "      <cmmn:planItem id=\"PlanItem_1\" definitionRef=\"Task_1\" />\n" +
    "      <cmmn:task id=\"Task_1\" />\n" +
    "    </cmmn:casePlanModel>\n" +
    "  </cmmn:case>\n" +
    "  <cmmndi:CMMNDI>\n" +
    "    <cmmndi:CMMNDiagram id=\"_5a66685b-5f57-4e2f-b1d1-acca4fae04b2\">\n" +
    "      <cmmndi:Size xsi:type=\"dc:Dimension\" width=\"500\" height=\"500\" />\n" +
    "      <cmmndi:CMMNShape id=\"DI_CasePlanModel_1\" cmmnElementRef=\"CasePlanModel_1\">\n" +
    "        <dc:Bounds x=\"114\" y=\"63\" width=\"534\" height=\"389\" />\n" +
    "        <cmmndi:CMMNLabel />\n" +
    "      </cmmndi:CMMNShape>\n" +
    "      <cmmndi:CMMNShape id=\"PlanItem_1_di\" cmmnElementRef=\"PlanItem_1\">\n" +
    "        <dc:Bounds x=\"150\" y=\"96\" width=\"100\" height=\"80\" />\n" +
    "        <cmmndi:CMMNLabel />\n" +
    "      </cmmndi:CMMNShape>\n" +
    "    </cmmndi:CMMNDiagram>\n" +
    "  </cmmndi:CMMNDI>\n" +
    "</cmmn:definitions>";

class CMMNPage extends React.Component{

    componentWillMount() {
        this.bpmnModeler = null;
        this.createNewDiagram = this.createNewDiagram.bind(this);
        this.openDiagram = this.openDiagram.bind(this);
        this.registerFileDrop = this.registerFileDrop.bind(this);
        this.saveSVG= this.saveSVG.bind(this);
        this.saveDiagram = this.saveDiagram.bind(this);
    }


    saveSVG(done){
        this.bpmnModeler.saveSVG(done);
    };

    saveDiagram(done){
        this.bpmnModeler.saveXML({ format: true }, function(err, xml) {
            done(err, xml);
        });
    };

    setEncoded(link, name, data) {
        const encodedData = encodeURIComponent(data);
        if (data) {
            link.addClass('active').attr({
                'href': 'data:application/cmmn11-xml;charset=UTF-8,' + encodedData,
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
        this.bpmnModeler.importXML(xml, function(err) {
            if (err) {
                container
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
            e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
        };

        container.get(0).addEventListener('dragover', handleDragOver, false);
        container.get(0).addEventListener('drop', handleFileSelect, false);
    }

    componentDidMount() {
        $('#js-properties-panel').hide();
        this.bpmnModeler = new Modeler({
            propertiesPanel: {
                parent: '#js-properties-panel'
            },
            additionalModules: [
                require('cmmn-js-properties-panel'),
                require('cmmn-js-properties-panel/lib/provider/cmmn'),
            ],
            moddleExtensions: {
                camunda: require('camunda-cmmn-moddle/resources/camunda')
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
                this.setEncoded(downloadLink, 'diagram.cmmn', err ? null : xml);
            });
        }, 500);
        this.bpmnModeler.on('commandStack.changed', exportArtifacts);

    }

    render(){
        return <div >
            <div className="content" name="js-drop-zone" id="js-drop-zone" style={{ height: '90%', position: 'absolute'}}>
                <div className="message intro">
                    <div className="note">
                        Drop CMMN diagram from your desktop or <a href="#" onClick={this.createNewDiagram} >create a new diagram</a> to get
                        started.
                    </div>
                </div>
                <div className="message error">
                    <div className="note">
                        <p>Ooops, we could not display the CMMN diagram.</p>

                        <div className="details">
                            <span>cause of the problem</span>
                            <pre></pre>
                        </div>
                    </div>
                </div>
                <div className="canvas" id="js-canvas" />
                <div id="js-properties-panel" />
            </div>
            <ul className="buttons">
                <li>
                    Download as:
                </li>
                <li>
                    <a id="js-download-diagram" href="#" title="download CMMN diagram">
                        CMMN diagram
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


export default CMMNPage;