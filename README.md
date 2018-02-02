# Borders Workflow Web Modeler

This web modeler allows users to create BPMN and CMMN models and download 
them to their local machines

### Supported features:
* BPMN
* CMMN
* Drag existing models
* Save models locally

### Features to be implemented:

* DMN
* Persistence backed storage
* Comments
* Process Model history
* Diff models
* Integration with Keycloak


## To run locally:
```
npm install
npm start

```
Navigate to http://localhost:8080

## To run docker image:
```
docker build -t workflow-web-modeler .
docker run -p 8080:8080 workflow-web-modeler:latest

```
 
Navigate to http://localhost:8080
