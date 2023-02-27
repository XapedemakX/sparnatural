export class SparnaturalAttributes {
  config: any;
  defaultEndpoint: string;
  language: string;
  addDistinct?: boolean;
  limit?: number;
  typePredicate?: string;
  maxDepth: number;
  maxOr: number;
  sparqlPrefixes?: { [key: string]: string };
  localCacheDataTtl?: number;
  debug: boolean;
  submitButton?: boolean;
  dataEndpoints:Array<{
    endpoint:string;
    credentials: "omit" | "same-origin" | "include";
    cache: "default" | "reload" | "no-cache";
    mode: "cors" | "no-cors" | 'same-origin' | 'navigate';
    method: "GET" | "POST"
    headers:{
      [key: string]: string;
    }
  }>

  constructor(element:HTMLElement) {
    // not the differences in attribute names
    this.config = this.#read(element,"src",this.#isJSON(element.getAttribute('src')));
    this.defaultEndpoint = this.#read(element, "endpoint");
    if(!this.config || !this.defaultEndpoint) {
      throw Error('No config or deault endpoint provided!');
    }
    this.language = this.#read(element, "lang");
    // use the singular to match RDFa attribute name
    this.sparqlPrefixes = this.#parsePrefixes(element);
    this.addDistinct = this.#read(element, "distinct", true);
    this.limit = this.#read(element, "limit", true);
    this.typePredicate = this.#read(element, "typePredicate");
    this.maxDepth = this.#read(element, "maxDepth");
    this.maxOr = this.#read(element, "maxOr");
    this.localCacheDataTtl = this.#read(element, "localCacheDataTtl", true);
    this.debug = this.#read(element, "debug", true);
    this.submitButton = this.#read(element, "submitButton", true);
    this.dataEndpoints = this.#parseDataEndpoints(element)
  }

  #read(element:HTMLElement, attribute:string, asJson:boolean = false) {
    return element.getAttribute(attribute)?(asJson)?JSON.parse(element.getAttribute(attribute)):element.getAttribute(attribute):undefined
  }

  #parseDataEndpoints(element:HTMLElement){
    if(!element.getAttribute("dataEndpoints")) {
      return;
    }
    let arr:Array<any>
    try{
      // must be parsable as a JSON
      arr = JSON.parse(this.#read(element,"dataEndpoints"))
    } catch(e){
      console.error(`element attribut dataEndpoints must be a valid JSON`)
      console.error((e as Error).stack)
    }
    // objects must have endpoint specified
    arr.forEach(o=>{
      if(!("endpoint" in o))throw Error('Object in dataEndpoints must specify an endpoint!')
    })
    return arr
  }

  #parsePrefixes(element:HTMLElement) {
    if(!element.getAttribute("prefix")) {
      return;
    }

    let sparqlPrefixes = {};
    let prefixArray = element.getAttribute("prefix").trim().split(/:\s+|\s+/);
    for (let i = 0; i < prefixArray.length; i++) {
      try{
        const prefixPair = {
          prefix: prefixArray[i].split(':')[0],
          iri: prefixArray[i].split(':').slice(1).join(':')
        }
        Object.defineProperty(sparqlPrefixes, prefixPair.prefix, {
          value: prefixPair.iri,
          writable: true,
          enumerable:true
        })
      } catch(e){
        console.error('Parsing of attribute prexis failed!')
        console.error(`Can not parse ${prefixArray[i]}`)
      }
    }
    return sparqlPrefixes;
  }
  #isJSON =(json:string)=> {
    let is_json = true; //true at first
    // Check if config is given as JSON string or as URL
    try {
      JSON.parse(json);
    } catch (error) {
        is_json = false;
    }
    return is_json
  }

}