import { getSettings } from "../../settings/defaultSettings";

export default abstract class Handler {
    sparqlEndpointUrl;
    semanticPostProcess;
    language;
    searchPath;
    listOrder;
  
    constructor(
      sparqlEndpointUrl: string,
      semanticPostProcess: (sparql: any) => string,
      language: string,
      searchPath: string
    ) {
      this.sparqlEndpointUrl = sparqlEndpointUrl;
      this.semanticPostProcess = semanticPostProcess;
      this.language = language;
      this.searchPath = searchPath != null ? searchPath : "rdfs:label";
      this.listOrder = "alphabetical";
    }
    /**
     * Post-processes the SPARQL query and builds the full URL for list content
     **/
    buildURL(sparql: string): string {
      sparql = this.semanticPostProcess(sparql);
      var separator = this.sparqlEndpointUrl.indexOf("?") > 0 ? "&" : "?";
  
      var url =
        this.sparqlEndpointUrl +
        separator +
        "query=" +
        encodeURIComponent(sparql) +
        "&format=json";
      return url;
    }
    listLocation(
      domain: any,
      property: any,
      range: any,
      data: { results: { bindings: any } }
    ) {
      return data.results.bindings;
    }
  
    elementLabel(element: { label: { value: any } }) {
      return element.label.value;
    }
  
    /* TODO : rename to elementValue */
    elementUri(element: { uri: { value: any }; value: { value: any } }) {
      if (element.uri) {
        return element.uri.value;
      } else if (element.value) {
        return element.value.value;
      }
    }
  
    enableMatch(domain: any, property: any, range: any) {
      return false;
    }
  
    buildHttpRequest( ) {

    var headers = new Headers();
    headers.append(
        "Accept",
        "application/sparql-results+json, application/json, */*;q=0.01"
    );
    let requestOptions = {
        method: "GET",
        headers: headers,
        mode: "cors",
        cache: "default",
    } as {[key:string]:any};

    const config = getSettings().dataEndpoints.find((val)=>{
    if(val?.endpoint === this.sparqlEndpointUrl)
    return val
    })
    
    if(config) {
        // the sparqlEndpointUrl equals an endpoint in Settings.dataEndpoints
        for (const [key, value] of Object.entries(config)) {
            if(key === 'endpoint') {
                if (typeof value !== 'string') {
                    console.error('endpoint in dataEndpoints must be a string!')
                }
                this.sparqlEndpointUrl = value as string
            } else {
                requestOptions[key] = value
            }
            
        }
    } 

    return requestOptions
    }
  }